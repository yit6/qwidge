const mysql = require("mysql2/promise");

let connection;

const init_db = async () => {
	connection = await mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE
	});

	let [results, fields] = await connection.query("CREATE TABLE IF NOT EXISTS Service (id_num int auto_increment primary key, name varchar(256), description text, organization varchar(256));");

	[results, fields] = await connection.query("CREATE TABLE IF NOT EXISTS Url (id_num int auto_increment primary key, url text);");

	[results, fields] = await connection.query("CREATE TABLE IF NOT EXISTS RelSUrl (id_num int auto_increment primary key, url_id int, service_id int, FOREIGN KEY (url_id) REFERENCES Url(id_num) ON DELETE CASCADE, FOREIGN KEY (service_id) REFERENCES Service(id_num) ON DELETE CASCADE);");

	console.log("tables created");
}

const add_service = async (name, description, organization, urls) => {
	console.log(`Adding service ${name}`);

	let [results, fields] = await connection.query("INSERT INTO Service (name, description, organization) VALUES (?, ?, ?)", [name, description, organization]);

	if (!results.insertId) {
		console.error("Failed to insert service");

		throw new Error("Failed to insert service");
	}

	let insert_id = results.insertId;

	urls.forEach(async (url) => {
		let [results, fields] = await connection.query("INSERT INTO Url (url) VALUES (?)", [url]);

		if (!results.insertId) {
			console.error("Failed to insert Url");

			throw new Error("Failed to insert Url");
		}

		[results, fields] = await connection.query("INSERT INTO RelSUrl (url_id, service_id) VALUES (?, ?)", [results.insertId, insert_id]);

		if (!results.insertId) {
			console.error("Failed to insert Service-Url relation");

			throw new Error("Failed to insert Service-Url relation");
		}
	});
};

const get_service = async (id) => {
	console.log(`getting service ${id}`);

	let [results, fields] = await connection.query("SELECT * FROM Service WHERE id_num=?", [id]);

	if (results.length != 1) {
		let e = new Error("Could not find service", 404);
		e.status = 404;
		throw e;
	}

	return {
		id: results[0].id_num,
		title: results[0].name,
		description: results[0].description,
		organization: results[0].organization,
		sources: await get_service_urls(id),
		imageURL: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.0aRkG7SSk6ziGRrjkgPRfwHaHa%3Fpid%3DApi&f=1&ipt=90e3f2ed0f81c2f5dbcd5c0e704bf5418ed838286b1d3437290f9bdc23cd8501&ipo=images",
		rating: 3,
	};
}

const get_url = async (id) => {
	console.log(`getting url ${id}`);

	let [results, fields] = await connection.query("SELECT url FROM Url WHERE id_num=?", [id]);

	if (results.length != 1) {
		throw new Error("Could not find url");
	}

	return results[0].url;
}

const get_service_urls = async (service_id) => {
	console.log(`getting urls for service ${service_id}`);
	
	let [results, fields] = await connection.query("SELECT url_id FROM RelSUrl WHERE service_id=?", [service_id]);

	return Promise.all(results.map(result => get_url(result.url_id)));
}

const get_all_service_ids = async () => {
	console.log(`getting service ids`);

	let [results, fields] = await connection.query("SELECT id_num FROM Service");

	return results.map(result => result.id_num);
}

const get_org_names = async () => {
	console.log(`getting org names`);

	let [results, fields] = await connection.query("SELECT DISTINCT organization FROM Service");

	return results.map(result => result.organization);
}

const merge_org_into = async (org_to_be_removed, org_to_consume_other) => {
	console.log(`renaming org ${org_to_be_removed} to ${org_to_consume_other}`);

	let [results, fields] = await connection.query("UPDATE Service SET organization=? WHERE organization=?", [org_to_consume_other, org_to_be_removed]);
}

const delete_service = async (id) => {
	console.log(`deleting service ${id}`);

	let [results, fields] = await connection.query("DELETE FROM Service WHERE id_num=?", [id]);
}

const get_services_light = async () => {
	console.log(`getting a bare minimum of info from each service`);

	let [results, fields] = await connection.query("SELECT id_num, name, description FROM Service");

	return results;
}

module.exports = {
	init_db,
	add_service,
	get_service,
	get_url,
	get_service_urls,
	get_all_service_ids,
	get_org_names,
	merge_org_into,
	delete_service,
	get_services_light,
};
