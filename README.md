# Task Tracker CLI

A lightweight command-line task management tool built in Python.
Track your tasks locally without the bloat of external apps. Fast, simple, and persistent via JSON storage.

---

## Features

- Add, update, and delete tasks via CLI
- Mark tasks as `todo`, `in-progress`, or `done`
- Persistent local storage using JSON
- Filter tasks by status
- Automatic timestamps for creation and updates

---

## Requirements

- Python 3.6 or higher
- No external libraries required

---

## Setup

Clone the repository and enter the project folder:

```bash
git clone https://github.com/waasifah-suleman/task-tracker-cli.git
cd task-tracker-cli
```

---

## Usage

All commands are run using:

```bash
python tasks.py <command> [arguments]
```

A `tasks.json` file will be automatically created in the same directory when you add your first task.

---

## Commands

### Add a task
```bash
python tasks.py add "Your task description"
```

### Update a task
```bash
python tasks.py update <id> "New description"
```

### Delete a task
```bash
python tasks.py delete <id>
```

### Mark as in progress
```bash
python tasks.py mark-in-progress <id>
```

### Mark as done
```bash
python tasks.py mark-done <id>
```

### List all tasks
```bash
python tasks.py list
```

### List tasks by status
```bash
python tasks.py list todo
python tasks.py list in-progress
python tasks.py list done
```

---

## Task Structure

Each task is stored in `tasks.json` with the following fields:

| Field | Description |
|---|---|
| `id` | Unique identifier, auto-generated |
| `description` | Task text |
| `status` | `todo`, `in-progress`, or `done` |
| `created_at` | Timestamp when created |
| `updated_at` | Timestamp when last modified |

---

## Example

```bash
$ python tasks.py add "Buy groceries"
Task added: 1

$ python tasks.py mark-in-progress 1
Task 1 -> in-progress

$ python tasks.py list
ID    Status          Description              Created
-------------------------------------------------------------
1     in-progress     Buy groceries            2025-04-18 14:30
```

---

## Project Structure

```
task-tracker-cli/
├── tasks.py        # Main application logic
├── .gitignore      # Excludes local data from version control
└── README.md       # Project documentation
```

---

## Notes

- Invalid task IDs are handled gracefully
- Data is persisted automatically after each change
- No external dependencies required