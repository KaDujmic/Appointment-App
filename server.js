const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
const cron = require('node-cron');

const expired_appointment = require('./service/expired_appointment');
const notification_email = require('./service/notification_email');

dotenv.config({ path: './config.env' });

// Connection to the DB, using the variables from the config.env file
const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD
);
mongoose
	.connect(DB, {
		useNewUrlParser: true,
		// useCreateIndex: true,
		// useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => console.log('DB connection established'));

const port = 3000 || process.env.PORT;

// Cron job for u
cron.schedule('0 * * * * *', function () {
	expired_appointment.expired_appointment();
});

cron.schedule('*/10 * * * * *', function () {
	notification_email.notification_email();
});

app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});
