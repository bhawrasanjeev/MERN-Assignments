import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
	title: { type: String, required: true, trim: true, maxlength: 120 },
	description: { type: String, trim: true, default: '', maxlength: 500 },
	completed: { type: Boolean, default: false },
	priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
}, { timestamps: true })

export const Task = mongoose.model('Task', taskSchema)

export function connectToDatabase() {
	return mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todo-task')
}
