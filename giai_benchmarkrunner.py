import os
import json
import platform
from datasets import load_dataset

# Import your Auto-Use AgentService
if platform.system() == "Darwin":
    from Auto_Use.macOS_use.agent.service import AgentService
elif platform.system() == "Windows":
    from Auto_Use.windows_use.agent.service import AgentService
else:
    raise RuntimeError(f"Unsupported OS: {platform.system()}")

# --- Configuration ---
PROVIDER = "perplexity" # Or your preferred provider
MODEL = "gemini-3.1-pro" 
OUTPUT_FILE = "gaia_submission.jsonl"
DATASET_DIR = r"D:\AI PROJECT\hugging face" # Point to your downloaded files

def get_completed_tasks(filepath):
    """Reads the output file to find which tasks are already done."""
    completed = set()
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            for line in f:
                if line.strip():
                    data = json.loads(line)
                    completed.add(data.get("task_id"))
    return completed

def main():
    print(f"Loading GAIA Test Set...")
    # Load metadata from your local download
    dataset = load_dataset(DATASET_DIR, "2023_all", split="test")
    
    # Initialize your agent once to save startup time
    print(f"Initializing Auto-Use Agent ({MODEL})...")
    agent = AgentService(provider=PROVIDER, model=MODEL, save_conversation=False)
    
    completed_tasks = get_completed_tasks(OUTPUT_FILE)
    print(f"Found {len(completed_tasks)} completed tasks. Resuming...")

    try:
        for example in dataset:
            task_id = example["task_id"]
            
            # Skip if already done
            if task_id in completed_tasks:
                continue
                
            question = example["Question"]
            file_name = example.get("file_name")
            file_path = example.get("file_path")
            
            # Construct the prompt for the agent
            prompt = f"Task: {question}\n"
            if file_name:
                full_path = os.path.join(DATASET_DIR, file_path)
                prompt += f"\nNote: You need to analyze the file located at: {full_path}"
            
            prompt += "\nPlease provide a short, exact answer required to solve this."

            print(f"\n[{task_id}] Running Task...")
            
            # --- CRITICAL PART ---
            # You might need to modify agent.process_request to RETURN the final answer 
            # instead of just printing it, so we can capture it here.
            final_answer = agent.process_request(prompt) 
            
            # If process_request doesn't return a string, you'll need to extract it 
            # from your agent's state or memory.
            if not final_answer:
                final_answer = "No answer returned"

            # Save immediately to prevent data loss on crash/pause
            result = {
                "task_id": task_id,
                "model_answer": final_answer
            }
            
            with open(OUTPUT_FILE, 'a', encoding='utf-8') as f:
                f.write(json.dumps(result) + '\n')
                
            print(f"Saved result for {task_id}")

    except KeyboardInterrupt:
        print("\n\n[PAUSED] Execution stopped by user. Progress has been saved to", OUTPUT_FILE)
        print("Run the script again to resume from where you left off.")

if __name__ == "__main__":
    main()