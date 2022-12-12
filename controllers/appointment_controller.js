const Appointment = require('../models/appointment_model');

// Get all appointments, needs more filtration options.
exports.get_all_appointments = async (req, res, next) => {
	try {
		const appointments = await Appointment.find();

		// Filter out all appointments where doctor or patient do not exist
		const filtered_appointments = appointments.filter(
			(el) => el.patient !== null || el.doctor !== null
		);

		res.status(200).json({
			status: 'success',
			results: filtered_appointments.length,
			data: {
				filtered_appointments,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			msg: err.message,
		});
	}
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
};

// Update appointment with no restrictions at the moment
exports.update_appointment = async (req, res, next) => {
	try {
		// Only doctor or admin can update the appointment
		if (
			req.user.role === 'admin' ||
			req.user.role === 'doctor'
		) {
			// Then we pull the status from req.body and store it in a variable so no other value can be updated
			const new_body = {
				status: req.body.status,
			};
			const appointment =
				await Appointment.findByIdAndUpdate(
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
			throw new Error(
				'You do not have permission to update an appointment!'
			);
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			msg: err.message,
		});
	}
};

// Delete appointment with no restrictions at the moment
exports.delete_appointment = async (req, res, next) => {
	try {
		if (req.user.role === 'admin') {
			const appointment =
				await Appointment.findByIdAndDelete(req.params.id);

			res.status(201).json({
				status: 'success',
				data: null,
			});
		} else
			throw new Error(
				'You do not have permission to delete an appointment!'
			);
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			msg: err.message,
		});
	}
};
