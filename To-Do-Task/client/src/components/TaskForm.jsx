function TaskForm({ form, editingId, saving, onChange, onSubmit, onCancel }) {
  return (
    <form className="task-form" onSubmit={onSubmit}>
      <h2>{editingId ? 'Edit task' : 'Add a task'}</h2>
      <label>
        Task title
        <input name="title" value={form.title} onChange={onChange} placeholder="What needs doing?" maxLength="120" />
      </label>
      <label>
        Description
        <textarea name="description" value={form.description} onChange={onChange} placeholder="Optional" rows="3" maxLength="500" />
      </label>
      <label>
        Priority
        <select name="priority" value={form.priority} onChange={onChange}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </label>
      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={saving}>
          {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add task'}
        </button>
        {editingId && <button className="text-button" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}

export default TaskForm
