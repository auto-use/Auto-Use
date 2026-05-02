# Copyright 2026 Autouse AI — https://github.com/auto-use/Auto-Use
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# If you build on this project, please keep this header and credit
# Autouse AI (https://github.com/auto-use/Auto-Use) in forks and derivative works.
# A small attribution goes a long way toward a healthy open-source
# community — thank you for contributing.

# Auto_Use/macOS_use/controller/tool/applescript.py
# macOS AppleScript tool — generic handler for any app
# Uses open_app() for activation/launching/main screen positioning
# Agent writes the action lines, service wraps with tell application + activation

import logging
import subprocess
import threading
import time

from .open_app import _move_to_main_screen, _is_app_running, _bring_to_front, open_app

logger = logging.getLogger(__name__)


# Scans every process for a permission dialog and clicks Allow.
# Fingerprint: any window or sheet that has TWO buttons whose names contain
# "Allow" (i.e. "Allow" + "Don't Allow"). That structural pattern matches every
# macOS permission prompt — TCC automation, Local Network, Files & Folders,
# Screen Recording, Microphone, etc. — without depending on dialog text, which
# varies wildly across permission types and macOS versions.
_DIALOG_SCANNER_SCRIPT = '''
tell application "System Events"
    set didClick to false
    repeat with p in application processes
        if didClick then exit repeat
        try
            repeat with w in windows of p
                if didClick then exit repeat
                set containers to {w}
                try
                    set containers to containers & (sheets of w)
                end try
                repeat with c in containers
                    try
                        if (count of (buttons of c whose name contains "Allow")) ≥ 2 then
                            click (first button of c whose name is "Allow")
                            set didClick to true
                            exit repeat
                        end if
                    end try
                end repeat
            end repeat
        end try
    end repeat
    return didClick
end tell
'''


def _click_automation_allow_button() -> bool:
    """Find any visible TCC automation Allow dialog and click it. Idempotent."""
    try:
        result = subprocess.run(
            ["osascript", "-e", _DIALOG_SCANNER_SCRIPT],
            capture_output=True, text=True, timeout=3
        )
        clicked = result.returncode == 0 and result.stdout.strip() == "true"
        if clicked:
            logger.info("Auto-clicked AppleScript automation Allow dialog")
        return clicked
    except Exception as e:
        logger.debug(f"Allow dialog scan failed: {e}")
        return False


class AppleScriptService:
    """Generic AppleScript executor for any macOS app.

    Contract: the agent supplies a complete AppleScript (typically wrapped in
    `tell application "X" ... end tell`). The runtime handles app launch and
    activation — the script should not contain `activate` or `launch` lines.
    Stray ones are stripped defensively for already-running apps.
    """

    def __init__(self):
        pass

    @staticmethod
    def _strip_activate(script: str) -> str:
        """Drop standalone `activate` / `launch` lines so we don't spawn a new window."""
        lines = script.split('\n')
        filtered = [line for line in lines if line.strip().lower() not in ('activate', 'launch')]
        return '\n'.join(filtered)

    def execute(self, app_name: str, action: str) -> dict:
        """
        Execute a complete AppleScript on behalf of the agent.

        Args:
            app_name: Application name (used for activation/launch only — never
                injected into the script).
            action: Complete AppleScript to execute verbatim.

        Returns:
            dict: {status, action, app, command, output/error}
        """
        app_name = app_name.strip()
        script = action.strip()

        if not app_name or not script:
            return {
                "status": "error",
                "action": "applescript",
                "message": "Both app name and script are required"
            }

        app_running = _is_app_running(app_name)

        if app_running:
            # Already running: front the existing instance and strip any stray
            # `activate`/`launch` the LLM may have included.
            _bring_to_front(app_name)
            time.sleep(0.3)
            script = self._strip_activate(script)
        else:
            # Not running: launch via the indexed app discovery path. open_app
            # waits ~1 s and re-positions the window onto the main display.
            open_app(app_name)

        result = self._run_with_dialog_watcher(script)

        if result.get("status") == "success":
            _move_to_main_screen()

        result["app"] = app_name
        result["command"] = action
        return result

    def _run_with_dialog_watcher(self, script: str) -> dict:
        """Run osascript with a background watcher that auto-clicks Allow dialogs.

        First-run scripts that drive another app can trigger one or more macOS
        permission prompts (TCC automation, Local Network, Screen Recording,
        etc.) that block osascript until dismissed. The watcher polls for any
        such dialog and clicks Allow as soon as it appears. After a successful
        click it scans again immediately, so back-to-back prompts (e.g. AppleScript
        automation followed by Local Network) are both cleared without delay.
        """
        stop_event = threading.Event()

        def watcher():
            while not stop_event.is_set():
                clicked = _click_automation_allow_button()
                if clicked:
                    continue  # another prompt may be queued behind this one
                if stop_event.wait(1.0):
                    break

        watcher_thread = threading.Thread(target=watcher, daemon=True)
        watcher_thread.start()
        try:
            return self._run(script)
        finally:
            stop_event.set()
            watcher_thread.join(timeout=2)

    def _run(self, script: str) -> dict:
        """Execute AppleScript via osascript and return structured result"""
        try:
            result = subprocess.run(
                ["osascript", "-e", script],
                capture_output=True,
                text=True,
                timeout=30
            )

            if result.returncode != 0:
                error_msg = result.stderr.strip()
                first_line = script.lstrip().split('\n', 1)[0][:120]
                logger.error(f"AppleScript error: {error_msg} | script[1]: {first_line}")
                return {
                    "status": "error",
                    "action": "applescript",
                    "message": f"{error_msg} (script started with: {first_line})"
                }

            output = result.stdout.strip()
            logger.info(f"AppleScript success: {output[:200]}")
            return {
                "status": "success",
                "action": "applescript",
                "output": output
            }

        except subprocess.TimeoutExpired:
            logger.error("AppleScript timed out (30s)")
            return {
                "status": "error",
                "action": "applescript",
                "message": "Script timed out (30s)"
            }
        except Exception as e:
            logger.error(f"AppleScript execution failed: {e}")
            return {
                "status": "error",
                "action": "applescript",
                "message": str(e)
            }