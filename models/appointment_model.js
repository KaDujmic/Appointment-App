const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./user_model');

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

// This middleware function prevents scheduling an appointment on Monday or Tuesday. Error handling not working properly
appointment_schema.pre('save', function (next) {
	const day = this.visit_date.getDay();
	if (day === 1 || day === 2) {
		throw new Error('You cannot schedule an appointment on Monday or Tuesday');
	}
	next();
});

// This middleware function prevents the doublebook for that doctor. Error handling not working properly
appointment_schema.pre('save', async function (next) {
	let doctor_appointments = await Appointment.find({
		doctor: this.doctor,
	});
	// toISOString function is used, req.body and doctor_appointments are an object, when converted can be compared
	doctor_appointments = doctor_appointments.map((obj) =>
		obj.visit_date.toISOString()
	);
	if (doctor_appointments.includes(this.visit_date.toISOString())) {
		throw new Error('You cannot schedule an appointment doctor is booked then');
	}
	next();
});

// This middleware function prevents booking of an appointment that is not at X:00 (full hour)
appointment_schema.pre('save', function (next) {
	const minutes = this.visit_date.getMinutes();
	if (minutes !== 0) {
		console.log('Minute appointment error');
		throw new Error(
			'You can only schedule an appointment on a full hour e.g. 16:00'
		);
	}
	next();
});

// This middleware function prevents booking of an appointment that is prior than todays date
appointment_schema.pre('save', function (next) {
	const date = this.visit_date.getTime();
	const todays_date = new Date().getTime();
	if (date < todays_date) {
		throw new Error('You cannot schedule an appointment prior to todays date');
	}
	next();
});

// This middleware function will send an email notification to doctor and the patient with the information about their schedule
appointment_schema.post('save', async function (next) {
	const doctor = await User.find(this.doctor);
	const patient = await User.find(this.patient);
	console.log(this, {
		patient,
		doctor,
	});
});

const Appointment = mongoose.model('Appointment', appointment_schema);

module.exports = Appointment;
