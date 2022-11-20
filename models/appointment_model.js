const mongoose = require('mongoose');
const validator = require('validator');

const appointment_schema = new mongoose.Schema({
	status: {
		type: String,
		enum: ['Scheduled', 'Rescheduled', 'Missed', 'Canceled', 'Done'],
		default: 'Scheduled',
		required: true,
	},
	patient: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
	},
	doctor: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
	},
	scheduled_date: {
		type: Date,
		default: Date.now(),
		required: true,
	},
	visit_date: {
		type: Date,
		required: true,
	},
});

const Appointment = mongoose.model('Appointment', appointment_schema);

module.exports = Appointment;
