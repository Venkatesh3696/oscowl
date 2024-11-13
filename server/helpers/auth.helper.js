import bcrypt from 'bcryptjs';
import Jwt, { decode } from 'jsonwebtoken';

export const hashPassword = (password) => {
	const salt = bcrypt.genSaltSync(10);
	const hashedPassword = bcrypt.hashSync(password, salt);
	return hashedPassword;
};

export const comparePassword = (password, dbPassword) => {
	return bcrypt.compareSync(password, dbPassword);
};

export const createJWTToken = (payload) => {
	console.log({ payload });
	const token = Jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: '1h',
	});
	return token;
};

export const verifyJwt = (token) => {
	try {
		const decoded = Jwt.verify(token, process.env.JWT_SECRET);
		console.log({ decoded });
		return decoded;
	} catch (error) {
		return null;
	}
};
