import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	googleId: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	profilePicture: { type: String, default: '' },
}, { timestamps: true })

export const User = mongoose.model('User', userSchema)

export async function connectToDatabase() {
	const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/google-oauth'
	await mongoose.connect(mongoUri)
	console.log('Connected to MongoDB')
}
