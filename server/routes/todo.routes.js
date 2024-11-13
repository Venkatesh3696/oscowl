import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import {
	createNewTodo,
	deleteTodo,
	getAllTodos,
	getTodoById,
	updateTodo,
} from '../controllers/todo.controller.js';

const router = express.Router();

router.get('/', authenticateUser, getAllTodos);
router.post('/', authenticateUser, createNewTodo);
router.get('/:id', authenticateUser, getTodoById);
router.put('/:id', authenticateUser, updateTodo);
router.delete('/:id', authenticateUser, deleteTodo);

export default router;
