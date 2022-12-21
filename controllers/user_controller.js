const User = require('../models/user_model');
const Appointment = require('../models/appointment_model');
const Role = require('../models/role_model');

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
		// err removed, breaks code when user not logged in. Protect function throws error and sends a response
	}
};

// Get a certain user, needs more filtration options.
exports.get_user = async (req, res, next) => {
	try {
		const users = await User.findById(req.params.id);
		res.status(200).json({
			status: 'success',
			data: {
				users,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			msg: err.message,
		});
	}
};

// Default way to create a user, no restrictions yet. Simple error handling.
exports.create_user = async (req, res, next) => {
	try {
		// Restrict croation of a USER to Admin or Doctor, in case of INVITE ONLY applicaiton
		if (
			req.user.role.name === 'admin' ||
			req.user.role.name === 'doctor'
		) {
			// Find role by name and set the req.body.role to the role ID
			const role = await Role.find({ name: req.body.role });
			req.body.role = role[0]._id;
			const user = await User.create(req.body);
			res.status(201).json({
				status: 'success',
				data: {
					user,
				},
			});
		} else
			throw new Error('You do not have permission to create a user!');
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			msg: err.message,
		});
	}
};

// Update user with no restrictions at the moment
exports.update_user = async (req, res, next) => {
	try {
		if (req.user.role.name === 'admin') {
			const user = await User.findByIdAndUpdate(
				req.params.id,
				req.body,
				{
					new: true,
					runValidators: true,
				}
			);

			res.status(200).json({
				status: 'success',
				data: {
					user,
				},
			});
		} else
			throw new Error('You do not have permission to update a user!');
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			msg: err.message,
		});
	}
};

// Delete User with no restrictions at the moment
exports.delete_user = async (req, res, next) => {
	try {
		if (req.user.role.name === 'admin') {
			const user = await User.findByIdAndDelete(req.params.id);
			let appointments = await Appointment.find({
				patient: req.params.id,
			});
			appointments = appointments.map((obj) =>
				obj.visit_date.toISOString()
			);
			console.log(appointments);

			res.status(201).json({
				status: 'success',
				data: null,
			});
		} else
			throw new Error('You do not have permission to delete a user!');
	} catch (err) {
		res.status(400).json({
			stats: 'fail',
			msg: err.message,
		});
	}
};

// Get all appointmets for a certain user
exports.get_user_appointments = async (req, res, next) => {
	try {
		const user_role = await User.findById(req.params.id);
		const appointments = await Appointment.find({
			[user_role.role]: req.params.id,
		});

		res.status(200).json({
			status: 'success',
			results: appointments.length,
			data: appointments,
		});
	} catch (err) {
		res.status(400).json({
			stats: 'fail',
			msg: err.message,
		});
	}
};
