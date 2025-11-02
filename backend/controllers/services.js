const db = require('../db');

const get_all = async (req, res) => {
	ids = await db.get_all_service_ids();

	services = Promise.all(ids.map(db.get_service));

	res.send(JSON.stringify(await services));
}

const get = async (req, res) => {
	try {
		res.send(JSON.stringify(await db.get_service(req.params.id)));
	} catch {
		res.send("404!");
	}
}

module.exports = {
	get_all,
	get,
}
