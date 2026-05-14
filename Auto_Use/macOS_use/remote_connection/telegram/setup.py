"""Telegram remote-connection setup driver (macOS, guided mode).

Opens Safari, navigates to web.telegram.org, then lets the user log in
manually. Progress is paced by a small always-on-top banner that streams
status text and has a Next button. The script blocks on user clicks via
banner.wait_for_next() — the user does the actual login (phone, country,
OTP) themselves; we just get them to the right page.
"""
import logging
import time

from Auto_Use.macOS_use.controller.tool.open_app import open_app
from Auto_Use.macOS_use.tree.element import UIElementScanner, ELEMENT_CONFIG
from Auto_Use.macOS_use.controller.service import ControllerService
from Auto_Use.macOS_use.controller.key_combo.service import KeyComboService
from Auto_Use.macOS_use.remote_connection.telegram.banner import StatusBanner

logger = logging.getLogger(__name__)

TELEGRAM_WEB_URL = "web.telegram.org"
STEP_DELAY_SEC = 2


def _find_address_bar(mapping: dict) -> str | None:
    """Return the index of Safari's smart-search field, or None if not found."""
    for idx, info in mapping.items():
        if info.get("name") == "smart search field" and info.get("type") == "TextField":
            return idx
    return None


def _open_telegram_in_safari(banner) -> bool:
    """Launch Safari and navigate it to web.telegram.org.

    Streams sub-step status to the banner so the user can see what's happening
    while Safari takes focus. Returns False on any failure.
    """
    banner.update("Please wait — confirming Safari is open…")
    if not open_app("Safari"):
        logger.error("setup.py: failed to launch Safari")
        return False
    time.sleep(STEP_DELAY_SEC)

    scanner = UIElementScanner(ELEMENT_CONFIG)
    scanner.scan_elements()
    mapping = scanner.get_elements_mapping()
    time.sleep(STEP_DELAY_SEC)

    address_bar_index = _find_address_bar(mapping)
    if address_bar_index is None:
        logger.error("setup.py: Safari address bar not found in scan")
        return False

    banner.update("Safari detected. Writing the URL for you, please wait…")

    controller = ControllerService()
    controller.set_elements(mapping, scanner.application_name)
    key_combo = KeyComboService()

    controller.click(address_bar_index)
    time.sleep(STEP_DELAY_SEC)

    controller.canvas_input(TELEGRAM_WEB_URL)
    time.sleep(STEP_DELAY_SEC)

    key_combo.send("return")
    return True


def run(country_code: str = "", phone: str = "") -> bool:
    """Guided Telegram-Web pairing.

    Shows a banner, waits for the user to click Next, opens Telegram Web,
    waits for the user to log in manually + click Next, then closes.

    country_code and phone are accepted but ignored — kept only so the
    pre-existing /api/telegram/connect callsite signature still works.
    """
    banner = StatusBanner()
    banner.show()
    try:
        banner.update("Let's get you set up with Telegram. Please click Next.")
        banner.wait_for_next()

        if not _open_telegram_in_safari(banner):
            banner.update("Failed to open Telegram. Close this banner and try again.")
            banner.wait_for_next(timeout=15)
            return False

        banner.update("Please log in to Telegram, then click Next")
        banner.wait_for_next()

        banner.update("Done")
        time.sleep(STEP_DELAY_SEC)
        return True
    finally:
        banner.close()
