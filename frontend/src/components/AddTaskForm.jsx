import { useState } from "react";

function AddTaskForm({ onTaskAdded }) {
  const [description, setDescription] = useState("");

  function handleSubmit() {
    if (!description.trim()) return;

    fetch("http://127.0.0.1:8000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, status: "todo" }),
    })
      .then((response) => response.json())
      .then(() => {
        onTaskAdded();
        setDescription("");
      });
  }

  return (
    <div className="flex gap-2 mb-6">
      <input
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        type="text"
        placeholder="Added a new task..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSubmit()}
      />

      <button 
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        onClick={handleSubmit}>Add Task</button>
    </div>
  )
}

export default AddTaskForm
