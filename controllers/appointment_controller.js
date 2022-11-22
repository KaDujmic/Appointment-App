const Appointment = require('../models/appointment_model');

// Get all appointments, needs more filtration options.
exports.get_all_appointments = async (req, res, next) => {
	try {
		const appointments = await Appointment.find();
		res.status(200).json({
			status: 'success',
			results: appointments.length,
			data: {
				appointments,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			msg: err.message,
		});
	}
	next();
};

// Default way to create a appointment, no restrictions yet. Simple error handling.
exports.create_appointment = async (req, res, next) => {
	try {
		const appointment = await Appointment.create(req.body);
		res.status(201).json({
			status: 'success',
			data: {
				appointment,
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

// Update appointment with no restrictions at the moment
exports.update_appointment = async (req, res, next) => {
	try {
		const appointment = await Appointment.findByIdAndUpdate(
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
				appointment,
			},
		});
	} catch {
		res.status(400).json({
			status: 'fail',
			msg: 'Unable to update the appointment',
		});
	}
	next();
};

// Delete appointment with no restrictions at the moment
exports.delete_appointment = async (req, res, next) => {
	try {
		const appointment = await Appointment.findByIdAndDelete(req.params.id);

		res.status(201).json({
			status: 'success',
			data: null,
		});
	} catch {
		console.log(res);
		res.status(400).json({
			status: 'fail',
			msg: 'Unable to delete the appointment',
		});
	}
	next();
};
