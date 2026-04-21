function TaskCard({ task }) {
    
    return (
        <div>
            <p>{task.description}</p>
            <p>{task.status}</p>
        </div>
    )
}

export default TaskCard 