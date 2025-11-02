const mysql = require("mysql2/promise");

let connection;

const init_db = async () => {
	connection = await mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE
	});

	let [results, fields] = await connection.query("CREATE TABLE IF NOT EXISTS Service (id_num int auto_increment primary key, name varchar(256), description text);");

	[results, fields] = await connection.query("CREATE TABLE IF NOT EXISTS Url (id_num int auto_increment primary key, url text);");

	[results, fields] = await connection.query("CREATE TABLE IF NOT EXISTS RelSUrl (id_num int auto_increment primary key, url_id int, service_id int, FOREIGN KEY (url_id) REFERENCES Url(id_num), FOREIGN KEY (service_id) REFERENCES Service(id_num));");

	console.log("tables created");
}

const add_service = async (name, description, urls) => {
	console.log(`Adding service ${name}`);

	let [results, fields] = await connection.query("INSERT INTO Service (name, description) VALUES (?, ?)", [name, description]);

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

	let [results, fields] = await connection.query("SELECT * from Service WHERE id_num=?", [id]);

	if (results.length != 1) {
		throw new Error("Could not find service");
	}

	return results[0];
}

module.exports = {
	init_db,
	add_service,
	get_service
};
