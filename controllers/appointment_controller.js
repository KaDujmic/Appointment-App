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
		// Only doctor or admin can update the appointment
		if (req.user.role === 'admin' || req.user.role === 'doctor') {
			// Then we pull the status from req.body and store it in a variable so no other value can be updated
			const new_body = { status: req.body.status };
			const appointment = await Appointment.findByIdAndUpdate(
				req.params.id,
				new_body,
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
		} else
			throw new Error('You do not have permission to update an appointment!');
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			msg: err.message,
		});
	}
	next();
};

// Delete appointment with no restrictions at the moment
exports.delete_appointment = async (req, res, next) => {
	try {
		if (req.user.role === 'admin') {
			const appointment = await Appointment.findByIdAndDelete(req.params.id);

			res.status(201).json({
				status: 'success',
				data: null,
			});
		} else
			throw new Error('You do not have permission to delete an appointment!');
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			msg: err.message,
		});
	}
	next();
};
