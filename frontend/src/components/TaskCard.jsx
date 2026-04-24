import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";

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
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm p-4 mb-3 flex items-center justify-between">
      <div className="flex-1 mr-4">
        {isEditing ? (
          <input
            className="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEditSave()}
          />
        ) : (
          <p className="font-medium text-gray-100">{task.description}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <select
          className="bg-gray-700 border border-gray-600 text-gray-100 rounded-lg text-sm px-2 py-1 focus:outline-none"
          value={task.status}
          onChange={handleStatusChange}
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        {isEditing ? (
          <>
          <button
            className="text-green-400 hover:text-green-300 transition"
            onClick={handleEditSave}
          >
            <Check size={18} />
          </button>
          <button
            className="text-gray-400 hover:text-gray-300 transition"
            onClick={() => setIsEditing(false)}
          >
            <X size={18} />
          </button>
          </>
        ) : (
        <button
          className="text-blue-400 hover:text-blue-300 transition"
          onClick={() => setIsEditing(true)}
          >
            <Pencil size={18} />
            </button>
        )}
        <button
          className="text-red-400 hover:text-red-300 transition"
          onClick={handleDelete}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
