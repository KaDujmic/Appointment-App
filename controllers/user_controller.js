const User = require('../models/user_model');
const Appointment = require('../models/appointment_model');

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
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			msg: err.message,
		});
	}
	next();
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
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			msg: err.message,
		});
	}
	next();
};

// Update user with no restrictions at the moment
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
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			msg: err.message,
		});
	}
	next();
};

// Delete User with no restrictions at the moment
exports.delete_user = async (req, res, next) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		let appointments = await Appointment.find({
			patient: req.params.id,
		});
		appointments = appointments.map((obj) => obj.visit_date.toISOString());
		console.log(appointments);

		res.status(201).json({
			status: 'success',
			data: null,
		});
	} catch (err) {
		res.status(400).json({
			stats: 'fail',
			msg: err.message,
		});
	}
	next();
};

// Get appointments available for a certain doctor
exports.get_doctor_appointments = async (req, res, next) => {
	try {
		let appointments = await Appointment.find({
			doctor: req.params.id,
		});
		appointments = appointments.map((obj) => obj.visit_date.toISOString());

		let hour = 1;
		let day = new Date().getDate() + 1;
		let month = new Date().getMonth();
		let year = new Date().getFullYear();
		const array_appointments = [];

		console.log(appointments);

		// For loop where we go through all days in a month !!! THERE IS AND ISSUE ON 11/29 FOR SOME REASON AND INCLUDES 12/01
		for (let m = month; m <= month; m++) {
			if (m === month + 1) break;
			let max_days = new Date(year, month, 0).getDate();
			for (let d = day; d <= max_days; d++) {
				for (let h = hour; h <= 24; h++) {
					// console.log({ d, h }); // BUT THE OUTPUT HERE SHOWS 11/29 OKAY AND NO 12/01
					const date = new Date(year, m, d, h).toISOString();
					const mon_or_tue = new Date(year, m, d, h).getDay();

					// If statment where we check if there is an appointment booked or is it Monday or Tuesday
					if (
						!appointments.includes(date) &&
						mon_or_tue !== 1 &&
						mon_or_tue !== 2
					) {
						console.log({ d, h });
						array_appointments.push(date);
					}
					if (h === 24) hour = 1;
				}
				if (d === max_days) day = 1;
			}
		}

		res.status(200).json({
			status: 'success',
			results: array_appointments.length,
			data: array_appointments,
		});
	} catch (err) {
		res.status(400).json({
			stats: 'fail',
			msg: err.message,
		});
	}
	next();
};
