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
    <div className="bg-white rounded-lg shadow-sm p-4 mb-3 flex items-center justify-between">
      <div className="flex-1 mr-4">
        {isEditing ? (
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEditSave()}
          />
        ) : (
          <p className="font-medium text-gray-700">{task.description}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <select
          className="border border-gray-300 rounded-lg text-sm px-2 py-1 focus:outline-none"
          value={task.status}
          onChange={handleStatusChange}
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        {isEditing ? (
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded-lg transition"
            onClick={handleEditSave}
          >
            Save
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-lg transition"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        )}

        <button
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-lg transition"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
