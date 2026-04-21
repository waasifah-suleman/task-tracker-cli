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
    <div>
      <input
        type="text"
        placeholder="Added a new task..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={handleSubmit}>Add Task</button>
    </div>
  )
}

export default AddTaskForm
