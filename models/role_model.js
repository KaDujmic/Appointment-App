const mongoose = require('mongoose');

const role_schema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Role must have a name!'],
	},
	descriptions: {
		type: String,
		required: [true, 'Role must have a description'],
	}
});

const Role = mongoose.model('Role', role_schema);

module.exports = Role;
