import { useEffect, useMemo, useState } from 'react'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'

const emptyForm = { title: '', description: '', priority: 'Medium' }

async function request(path, options = {}) {
    const response = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...options })
    const data = response.status === 204 ? null : await response.json()
    if (!response.ok) throw new Error(data?.message || 'Something went wrong.')
    return data
}

function TaskPage() {
    const [tasks, setTasks] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [editingId, setEditingId] = useState(null)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const [sort, setSort] = useState('newest')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ text: '', type: '' })

    useEffect(() => {
        request('/api/tasks').then(setTasks).catch((error) => setMessage({ text: error.message, type: 'error' })).finally(() => setLoading(false))
    }, [])

    const visibleTasks = useMemo(() => tasks.filter((task) => {
        const matchesSearch = !search.trim() || task.title.toLowerCase().includes(search.trim().toLowerCase())
        const matchesFilter = filter === 'all' || (filter === 'completed' ? task.completed : !task.completed)
        return matchesSearch && matchesFilter
    }).sort((first, second) => sort === 'newest' ? new Date(second.createdAt) - new Date(first.createdAt) : new Date(first.createdAt) - new Date(second.createdAt)), [tasks, search, filter, sort])

    const completedCount = tasks.filter((task) => task.completed).length

    function updateForm(event) {
        setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    }

    async function submitForm(event) {
        event.preventDefault()
        if (!form.title.trim()) return setMessage({ text: 'Task title cannot be empty.', type: 'error' })
        setSaving(true)
        try {
            if (editingId) {
                const updated = await request(`/api/tasks/${editingId}`, { method: 'PATCH', body: JSON.stringify(form) })
                setTasks((current) => current.map((task) => task._id === editingId ? updated : task))
                setMessage({ text: 'Task updated.', type: 'success' })
            } else {
                const created = await request('/api/tasks', { method: 'POST', body: JSON.stringify(form) })
                setTasks((current) => [created, ...current])
                setMessage({ text: 'Task added.', type: 'success' })
            }
            setForm(emptyForm)
            setEditingId(null)
        } catch (error) {
            setMessage({ text: error.message, type: 'error' })
        } finally {
            setSaving(false)
        }
    }

    function editTask(task) {
        setEditingId(task._id)
        setForm({ title: task.title, description: task.description || '', priority: task.priority })
    }

    async function toggleTask(task) {
        try {
            const updated = await request(`/api/tasks/${task._id}`, { method: 'PATCH', body: JSON.stringify({ completed: !task.completed }) })
            setTasks((current) => current.map((item) => item._id === task._id ? updated : item))
            setMessage({ text: updated.completed ? 'Task completed.' : 'Task moved to pending.', type: 'success' })
        } catch (error) { setMessage({ text: error.message, type: 'error' }) }
    }

    async function deleteTask(task) {
        if (!window.confirm(`Delete "${task.title}"?`)) return
        try {
            await request(`/api/tasks/${task._id}`, { method: 'DELETE' })
            setTasks((current) => current.filter((item) => item._id !== task._id))
            setMessage({ text: 'Task deleted.', type: 'success' })
        } catch (error) { setMessage({ text: error.message, type: 'error' }) }
    }

    return (
        <main className="app-shell">
            <header className="topbar"><a className="logo" href="/">TASK<span>LIST</span></a><span className="date-label">Simple daily tasks</span></header>
            <section className="hero"><div><p className="eyebrow">To-do list</p><h1>Get things<br /><em>done.</em></h1></div><p className="hero-note">Add a task, finish it,<br />move on to the next.</p></section>
            {message.text && <div className={`feedback feedback-${message.type}`} role="status"><span>{message.text}</span><button type="button" onClick={() => setMessage({ text: '', type: '' })}>×</button></div>}
            <section className="workspace"><TaskForm form={form} editingId={editingId} saving={saving} onChange={updateForm} onSubmit={submitForm} onCancel={() => { setForm(emptyForm); setEditingId(null) }} /><TaskList tasks={visibleTasks} loading={loading} totalCount={tasks.length} completedCount={completedCount} search={search} filter={filter} sort={sort} onSearch={setSearch} onFilter={setFilter} onSort={setSort} onToggle={toggleTask} onEdit={editTask} onDelete={deleteTask} /></section>
            <footer><span>Task list</span><span>{tasks.length - completedCount} pending</span></footer>
        </main>
    )
}

export default TaskPage
