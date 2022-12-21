const Role = require('../models/role_model');


exports.get_all_roles = async (req, res) => {
  try {
		const roles = await Role.find();
		res.status(200).json({
			status: 'success',
			results: roles.length,
			data: {
				roles,
			},
		});
	} catch {
		// err removed, breaks code when user not logged in. Protect function throws error and sends a response
	}
}

exports.get_role = async (req, res) => {
  try {
		const role = await Role.findById(req.params.id);
		res.status(200).json({
			status: 'success',
			data: {
				role,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			msg: err.message,
		});
	}
}

exports.create_role = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      // const role_id = await Role.find({name: req.body.role})._id;
      req.body.role = await Role.find({name: req.body.role})._id;
      const role = await Role.create(req.body);
      res.status(200).json({
        status: 'success',
				data: {
					role,
				},
      })
    }
  } catch (err) {
    res.status(404).json({
			status: 'fail',
			msg: err.message,
		});
  }
}