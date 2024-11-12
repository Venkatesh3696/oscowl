import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));

app.get('/', (req, res) => {
	res.json({ message: 'hello world' });
});

app.listen(5000, () => {
	console.log(`app is listening at port 5000`);
});
