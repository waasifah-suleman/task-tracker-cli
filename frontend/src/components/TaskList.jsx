import { useState, useEffect } from "react";
import TaskCard from "./TaskCard";
import AddTaskForm from "./AddTaskForm";

const FILTERS = ["all", "todo", "in-progress", "done"];

function TaskList() {
  const [tasks, setTasks] = useState([]);

  const [activeFilter, setActiveFilter] = useState("all");

  function fetchTasks(filter) {
    const url =
      filter && filter !== "all"
        ? `http://127.0.0.1:8000/tasks?status=${filter}`
        : "http://127.0.0.1:8000/tasks";

    fetch(url)
      .then((response) => response.json())
      .then((data) => setTasks(data));
  }

  useEffect(() => {
    fetchTasks("all");
  }, []);

  function handleFilterChange(filter) {
    setActiveFilter(filter);
    fetchTasks(filter);
  }

  return (
    <div>
      <h2 className="text-lg font-semi-bold text-gray-200 mb-4">My Tasks</h2>

      <AddTaskForm onTaskAdded={fetchTasks} />

      <div className="flex gap-2 mb-4">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterChange(filter)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition capitalize
                        ${
                          activeFilter === filter
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                        }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {tasks.length === 0 && (
        <p className="text-gray-400 text-sm">No tasks found.</p>
      )}

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={() => fetchTasks(activeFilter)}
          onUpdate={() => fetchTasks(activeFilter)}
        />
      ))}
    </div>
  );
}

export default TaskList;
