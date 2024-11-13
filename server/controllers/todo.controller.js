import Todo from '../models/todo.model.js';

export const getAllTodos = async (req, res) => {
	try {
		const todos = await Todo.find({ user: req.user }).sort({
			createdAt: -1,
		});
		res.json({
			todos,
			message: 'Todos retrieved successfully',
		});
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
};

export const getTodoById = async (req, res) => {
	try {
		const todos = await Todo.find({
			user: req.user,
			_id: req.params.id,
		}).sort({
			createdAt: -1,
		});
		if (!todos) {
			res.status(404).send('Todo not found');
		}
		res.json({
			todos,
			message: 'Todos retrieved successfully',
		});
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
};

export const createNewTodo = async (req, res) => {
	console.log('req, req.user ===>> ', req.user);
	try {
		const newTodo = new Todo({
			title: req.body.title,
			description: req.body.description,
			user: req.user,
		});

		const todo = await newTodo.save();
		res.json(todo);
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
};

export const updateTodo = async (req, res) => {
	try {
		let todo = await Todo.findById(req.params.id);
		if (!todo) return res.status(404).json({ message: 'Todo not found' });

		if (todo.user.toString() !== req.user) {
			return res.status(401).json({ message: 'User not authorized' });
		}

		todo = await Todo.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true },
		);

		res.json(todo);
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
};

export const deleteTodo = async (req, res) => {
	try {
		const todo = await Todo.findById(req.params.id);
		if (!todo) return res.status(404).json({ message: 'Todo not found' });

		if (todo.user.toString() !== req.user) {
			return res.status(401).json({ message: 'User not authorized' });
		}

		await Todo.findByIdAndDelete(req.params.id);
		res.json({ message: 'Todo removed' });
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
};
