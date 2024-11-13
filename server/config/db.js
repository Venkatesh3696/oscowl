import mongoose from 'mongoose';

export const connectDbAndServer = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log('db connected to server');
	} catch (error) {
		console.log(error);
	}
};
