import { useState, useEffect } from "react"
import TaskCard from "./TaskCard"
import AddTaskForm from "./AddTaskForm"

function TaskList() {
    const [tasks, setTasks] = useState([])

    function fetchTasks() {
        fetch("http://127.0.0.1:8000/tasks")
        .then(response => response.json())
        .then(data => setTasks(data))
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    return (
        <div>
            <h2>My Tasks</h2>

            <AddTaskForm onTaskAdded={fetchTasks} />

            {tasks.map(task => (
                <TaskCard key={task.id} task={task} onDelete={fetchTasks} />
            ))}
        </div>
    )
}

export default TaskList