import { verifyJwt } from '../helpers/auth.helper.js';

export const authenticateUser = (req, res, next) => {
	const { token } = req.cookies;
	console.log('token in midleware = > ', token);

	if (!token) {
		return res
			.status(401)
			.json({ message: 'No token, authorization denied' });
	}

	try {
		const decoded = verifyJwt(token);
		req.user = decoded.userId;
		next();
	} catch (err) {
		res.status(401).json({ message: 'Token is not valid' });
	}
};
