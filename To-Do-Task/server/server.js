import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { connectToDatabase, Task } from './db.js'

const app = express()
const port = process.env.PORT || 5001

app.use(cors())
app.use(express.json())

app.get('/api/tasks', async (_req, res, next) => {
	try {
		const tasks = await Task.find().sort({ createdAt: -1 })
		res.json(tasks)
	} catch (error) {
		next(error)
	}
})

app.post('/api/tasks', async (req, res, next) => {
	try {
		const title = req.body.title?.trim()
		if (!title) return res.status(400).json({ message: 'Task title cannot be empty.' })

		const task = await Task.create({
			title,
			description: req.body.description?.trim() || '',
			priority: req.body.priority || 'Medium',
		})
		res.status(201).json(task)
	} catch (error) {
		next(error)
	}
})

app.patch('/api/tasks/:id', async (req, res, next) => {
	try {
		const updates = {}
		if (req.body.title !== undefined) {
			updates.title = req.body.title.trim()
			if (!updates.title) return res.status(400).json({ message: 'Task title cannot be empty.' })
		}
		if (req.body.description !== undefined) updates.description = req.body.description.trim()
		if (req.body.completed !== undefined) updates.completed = Boolean(req.body.completed)
		if (req.body.priority !== undefined) updates.priority = req.body.priority

		const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
		if (!task) return res.status(404).json({ message: 'Task not found.' })
		res.json(task)
	} catch (error) {
		next(error)
	}
})

app.delete('/api/tasks/:id', async (req, res, next) => {
	try {
		const task = await Task.findByIdAndDelete(req.params.id)
		if (!task) return res.status(404).json({ message: 'Task not found.' })
		res.status(204).end()
	} catch (error) {
		next(error)
	}
})

app.use((error, _req, res, _next) => {
	console.error(error)
	res.status(500).json({ message: 'Something went wrong. Please try again.' })
})

connectToDatabase()
	.then(() => app.listen(port, () => console.log(`To-Do API running on port ${port}`)))
	.catch((error) => {
		console.error('Unable to connect to MongoDB:', error.message)
		process.exit(1)
	})
