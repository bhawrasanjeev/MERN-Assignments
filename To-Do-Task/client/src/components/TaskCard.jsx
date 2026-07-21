function formatDate(value) {
    return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
}

function TaskCard({ task, onToggle, onEdit, onDelete }) {
    return (
        <article className={`task-card ${task.completed ? 'is-complete' : ''}`}>
            <button className="check-button" type="button" onClick={() => onToggle(task)} aria-label={task.completed ? 'Mark task pending' : 'Mark task complete'}>
                {task.completed ? '✓' : ''}
            </button>
            <div className="task-copy">
                <div className="task-title-row">
                    <h3>{task.title}</h3>
                    <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                </div>
                {task.description && <p>{task.description}</p>}
                <time dateTime={task.createdAt}>{formatDate(task.createdAt)}</time>
            </div>
            <div className="task-actions">
                <button type="button" onClick={() => onEdit(task)}>Edit</button>
                <button className="delete-action" type="button" onClick={() => onDelete(task)}>Delete</button>
            </div>
        </article>
    )
}

export default TaskCard
