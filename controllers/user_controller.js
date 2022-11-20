const User = require('../models/user_model');

// Get all users, needs more filtration options.
exports.get_all_users = async (req, res, next) => {
	try {
		const users = await User.find();
		res.status(200).json({
			status: 'success',
			results: users.length,
			data: {
				users,
			},
		});
	} catch {
		res.status(400).json({
			msg: 'Not Found',
		});
	}
	next();
};

// Default way to create a user, no restrictions yet. Simple error handling.
exports.create_user = async (req, res, next) => {
	try {
		const user = await User.create(req.body);
		res.status(201).json({
			status: 'success',
			data: {
				user,
			},
		});
	} catch {
		console.log(res);
		res.status(401).json({
			msg: 'Unable to create a user',
		});
	}
	next();
};

exports.update_user = async (req, res, next) => {
	try {
		const user = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			status: 'success',
			data: {
				user,
			},
		});
	} catch {
		console.log(res);
		res.status(401).json({
			msg: 'Unable to update the user',
		});
	}
	next();
};

exports.delete_user = async (req, res, next) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);

		res.status(201).json({
			status: 'success',
			data: null,
		});
	} catch {
		console.log(res);
		res.status(401).json({
			msg: 'Unable to delete the user',
		});
	}
	next();
};
