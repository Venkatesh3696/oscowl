import express, { urlencoded } from 'express';
import morgan from 'morgan';
import { configDotenv } from 'dotenv';
import {
	loginController,
	signupController,
} from './controllers/auth.controller.js';
import { connectDbAndServer } from './config/db.js';
import todoRouter from './routes/todo.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

configDotenv();

connectDbAndServer();

app.use(morgan('dev'));
app.use(express.json());
app.use(express({ urlencoded: true }));
app.use(cookieParser());

app.post('/signup', signupController);
app.post('/login', loginController);

app.use('/todos', todoRouter);

app.get('/', (req, res) => {
	res.json({ message: 'hello world' });
});

app.listen(5000, () => {
	console.log(`app is listening at port 5000`);
});
