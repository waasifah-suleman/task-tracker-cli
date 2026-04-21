function TaskCard({ task, onDelete, onUpdate }) {

    function handleDelete() {
        fetch(`http://127.0.0.1:8000/tasks/${task.id}`, {
            method: "DELETE"
        }).then(() => onDelete())
    }

    function handleStatusChange(e) {
        fetch(`http://127.0.0.1:8000/tasks/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: e.target.value })
        }).then(() => onUpdate())
    }

    return (
        <div>
            <p>{task.description}</p>

            <select value={task.status} onChange={handleStatusChange}>
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
            </select>

            <button onClick={handleDelete}>Delete</button>
        </div>
    )
}

export default TaskCard 