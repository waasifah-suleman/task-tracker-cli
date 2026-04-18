import json
import sys
from pathlib import Path
from datetime import datetime

TASK_FILE = Path("tasks.json")
VALID_STATUSES = ("todo", "in-progress", "done")

def load_tasks():

    if not TASK_FILE.exists():
        return []
    
    try:
        with open(TASK_FILE, "r", encoding="utf-8") as file:
            return json.load(file)
    
    except json.JSONDecodeError:
        print("Error: tasks.json is corrupted. Fix or delete it.")
        sys.exit(1)

def save_tasks(tasks):
    
    try:
        with open(TASK_FILE, "w", encoding="utf-8") as file:
            json.dump(tasks, file, indent=2)
    
    except OSError as e:
        print(f"Error: Could not save tasks. {e}")
        sys.exit(1)

def get_next_id(tasks):
    return max((task["id"] for task in tasks), default=0) + 1

def get_timestamp():
    return datetime.now().isoformat()


def format_time(ts):
    return datetime.fromisoformat(ts).strftime("%Y-%m-%d %H:%M")

def find_task_by_id(tasks, task_id):
    return next((task for task in tasks if task["id"] == task_id), None)

def add_task(description):
    tasks = load_tasks()

    new_task = {
        "id": get_next_id(tasks),
        "description": description,
        "status": "todo",
        "created_at": get_timestamp(),
        "updated_at": get_timestamp()
    }

    tasks.append(new_task)
    save_tasks(tasks)

    print(f"Task added: {new_task['id']}")

def update_task(task_id, new_description):
    tasks = load_tasks()
    task = find_task_by_id(tasks, task_id)

    if not task:
        print(f"Could not find task with ID {task_id}.")
        sys.exit(1)
    
    task["description"] = new_description
    task["updated_at"] = get_timestamp()

    save_tasks(tasks)
    print(f"Task {task_id} updated")

def delete_task(task_id):
    tasks = load_tasks()
    task = find_task_by_id(tasks, task_id)

    if not task:
        print(f"No task found with ID {task_id}")
        sys.exit(1)
    
    tasks = [t for t in tasks if t["id"] != task_id]

    save_tasks(tasks)
    print(f"Task {task_id} deleted")

def mark_task(task_id, status):
    if status not in VALID_STATUSES:
        print("Invalid status")
        sys.exit(1)
    
    tasks = load_tasks()
    task = find_task_by_id(tasks, task_id)

    if not task:
        print(f"No task found with Id {task_id}.")
        sys.exit(1)
    
    task["status"] = status
    task["updated_at"] = get_timestamp()

    save_tasks(tasks)
    print(f"Task {task_id} -> {status}")

def list_tasks(filter_status=None):
    tasks = load_tasks()

    if filter_status:
        tasks = [t for t in tasks if t["status"] == filter_status]
    
    if not tasks:
        print(f"No tasks found." if not filter_status else f"No '{filter_status}' tasks.")
        return
      
    print(f"\n{'ID': <5} {'Status': <15} {'Description': <40} {'Created': <20}")
    print("-" * 80)

    for task in tasks:
        print(
            f"{task['id']: <5} "
            f"{task['status']: <15} "
            f"{task['description']: <40} "
            f"{format_time(task['created_at'])}"
        )
    
    print()

def main():

    if len(sys.argv) < 2:
        print("Usage: python tasks.py <command> [arguments]\n")
        print("Commands:")
        print(" add <description>")
        print(" update <id> <description")
        print(" delete <id>")
        print(" mark-done <id>")
        print(" mark-in-progress <id>")
        print(" list")
        print(" list done | todo | in-progress")
        sys.exit(0)
    
    command = sys.argv[1].lower()

    if command == "add":
        if len(sys.argv) < 3:
            print("Usage: python tasks.py add \"Your task\"")
            sys.exit(1)
    
        add_task(" ".join(sys.argv[2:]))
    
    elif command == "update":
        if len(sys.argv) < 4:
            print("Usage: python tasks.py update <id> \"New description\"")
            sys.exit(1)
        try:
            update_task(int(sys.argv[2]), " ".join(sys.argv[3:]))
        except ValueError:
            print("ID must be a number")
            sys.exit(1)
    
    elif command == "delete":
        try:
            delete_task(int(sys.argv[2]))
        except (IndexError, ValueError):
            print("Usage: python tasks.py delete <id>")
            sys.exit(1)
    
    elif command == "mark-done":
        try:
            mark_task(int(sys.argv[2]), "done")
        except (IndexError, ValueError):
            print("Usage: python tasks.py mark-done <id>")
            sys.exit(1)

    elif command == "mark-in-progress":
        try:
            mark_task(int(sys.argv[2]), "in-progress")
        except (IndexError, ValueError):
            print("Usage: python tasks.py mark-in-progress <id>")
            sys.exit(1)
    
    elif command == "list":
        if len(sys.argv) == 2:
            list_tasks()
        else:
            status = sys.argv[2].lower()
            if status not in VALID_STATUSES:
                print("Valid filters: done, todo, in-progress")
                sys.exit(1)
            list_tasks(status)
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)

if __name__ == "__main__":
    main()