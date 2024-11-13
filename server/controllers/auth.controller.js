import {
	comparePassword,
	createJWTToken,
	hashPassword,
} from '../helpers/auth.helper.js';
import User from '../models/user.model.js';

export const signupController = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		console.log(user);

		if (user) {
			return res.json({
				success: false,
				message: 'Email already exists',
			});
		}

		const hashedPassword = hashPassword(password);
		const newUser = await User.create({
			name,
			email,
			password: hashedPassword,
		});

		await newUser.save();

		return res.json({
			success: true,
			message: 'user created successfully',
			user: newUser,
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const loginController = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	if (!user) {
		return res.json({
			success: false,
			message: 'Email not registered! please register first.',
		});
	}

	const matchPassword = comparePassword(password, user.password);

	if (!matchPassword) {
		return res.json({
			success: false,
			message: 'Invalid credentials',
		});
	}

	const userId = user._id.toString();
	const payload = { userId };

	const token = createJWTToken(payload);

	res.cookie('token', token, {
		httpOnly: true,
		expires: new Date(Date.now() + 60 * 60 * 1000),
		secure: true,
	});

	return res.json({
		success: true,
		message: 'logged in successfully',
		user,
	});
};
