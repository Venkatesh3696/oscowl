import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const todoSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			default: uuidv4,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'User ID is required'],
		},
		title: {
			type: String,
			required: [true, 'Title is required'],
			trim: true,
			minlength: [1, 'Title must be at least 1 character long'],
			maxlength: [100, 'Title cannot exceed 100 characters'],
		},
		description: {
			type: String,
			trim: true,
			maxlength: [500, 'Description cannot exceed 500 characters'],
		},
		status: {
			type: String,
			enum: {
				values: ['pending', 'in progress', 'completed'],
				message: '{VALUE} is not a valid status',
			},
			default: 'pending',
		},
		priority: {
			type: String,
			enum: {
				values: ['low', 'medium', 'high'],
				message: '{VALUE} is not a valid priority level',
			},
			default: 'medium',
		},
		dueDate: {
			type: Date,
			validate: {
				validator: function (v) {
					return v && v.getTime() >= new Date().getTime();
				},
				message: 'Due date cannot be in the past',
			},
		},
		tags: [
			{
				type: String,
				trim: true,
			},
		],
		completed: {
			type: Boolean,
			default: false,
		},
		completedAt: {
			type: Date,
		},
		createdAt: {
			type: Date,
			default: Date.now,
			immutable: true,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	},
);

// Middleware to update completedAt when todo is marked as completed
todoSchema.pre('save', function (next) {
	if (this.isModified('completed') && this.completed) {
		this.completedAt = new Date();
	} else if (this.isModified('completed') && !this.completed) {
		this.completedAt = null;
	}
	next();
});

// Virtual for remaining time until due date
todoSchema.virtual('timeRemaining').get(function () {
	if (!this.dueDate) return null;
	return this.dueDate.getTime() - new Date().getTime();
});

// Instance method to check if todo is overdue
todoSchema.methods.isOverdue = function () {
	if (!this.dueDate || this.completed) return false;
	return new Date() > this.dueDate;
};

// Static method to find todos by status
todoSchema.statics.findByStatus = function (status) {
	return this.find({ status: status });
};

// Query helper to find urgent todos
todoSchema.query.urgent = function () {
	return this.where('priority')
		.equals('high')
		.where('completed')
		.equals(false)
		.where('dueDate')
		.lte(new Date(Date.now() + 24 * 60 * 60 * 1000));
};

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
