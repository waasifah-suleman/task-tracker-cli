function TaskCard({ task, onDelete }) {

    function handleDelete() {
        fetch(`http://127.0.0.1:8000/tasks/${task.id}`, {
            method: "DELETE"
        }).then(() => onDelete())
    }

    return (
        <div>
            <p>{task.description}</p>
            <p>{task.status}</p>
            <button onClick={handleDelete}>Delete</button>
        </div>
    )
}

export default TaskCard 