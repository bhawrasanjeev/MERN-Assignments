import TaskCard from './TaskCard'

function TaskList({ tasks, loading, totalCount, completedCount, search, filter, sort, onSearch, onFilter, onSort, onToggle, onEdit, onDelete }) {
  return (
    <section className="task-section">
      <div className="section-heading">
        <h2>Your tasks</h2>
        <div className="stats"><strong>{totalCount}</strong> total <strong className="green-text">{completedCount}</strong> done</div>
      </div>
      <div className="controls">
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search tasks" aria-label="Search tasks" />
        </label>
        <select value={filter} onChange={(event) => onFilter(event.target.value)} aria-label="Filter tasks">
          <option value="all">All tasks</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <select value={sort} onChange={(event) => onSort(event.target.value)} aria-label="Sort tasks">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      {loading ? <div className="empty-state">Loading your tasks...</div> : tasks.length === 0 ? <div className="empty-state"><h3>{totalCount ? 'No matching tasks' : 'Nothing on the list yet'}</h3><p>{totalCount ? 'Try a different search or filter.' : 'Add your first task to get started.'}</p></div> : (
        <div className="task-list">
          {tasks.map((task) => <TaskCard key={task._id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />)}
        </div>
      )}
    </section>
  )
}

export default TaskList
