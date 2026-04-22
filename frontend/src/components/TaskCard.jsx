import { useState } from "react";

function TaskCard({ task, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(task.description);

  function handleDelete() {
    fetch(`http://127.0.0.1:8000/tasks/${task.id}`, {
      method: "DELETE",
    }).then(() => onDelete());
  }

  function handleStatusChange(e) {
    fetch(`http://127.0.0.1:8000/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: e.target.value }),
    }).then(() => onUpdate());
  }

  function handleEditSave() {
    if (!editedDescription.trim()) return;
    fetch(`http://127.0.0.1:8000/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: editedDescription }),
    }).then(() => {
      setIsEditing(false);
      onUpdate();
    });
  }

  return (
    <div>
      {isEditing ? (
        <input
          type="text"
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleEditSave()}
        />
      ) : (
        <p>{task.description}</p>
      )}

      <select value={task.status} onChange={handleStatusChange}>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      {isEditing ? (
        <button onClick={handleEditSave}>Save</button>
      ) : (
        <button onClick={() => setIsEditing(true)}>Edit</button>
      )}

      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default TaskCard;
