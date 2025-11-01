const mysql = require("mysql");

const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE
});

connection.connect((err) => {
	if (err) { throw err; }
	console.log("Connected to database");
});

const init_db = () => {
	connection.query("CREATE TABLE IF NOT EXISTS Service (id_num int auto_increment primary key, name varchar(256), description text);", (err, results) => {
		if (err) {
			console.error("Failed to create table");
			throw err;
		}
	});

	connection.query("CREATE TABLE IF NOT EXISTS Url (id_num int auto_increment primary key, url text);", (err, results) => {
		if (err) {
			console.error("Failed to create table");
			throw err;
		}
	});

	connection.query("CREATE TABLE IF NOT EXISTS RelSUrl (id_num int auto_increment primary key, url_id int, service_id int, FOREIGN KEY (url_id) REFERENCES Url(id_num), FOREIGN KEY (service_id) REFERENCES Service(id_num));", (err, results) => {
		if (err) {
			console.error("Failed to create table");
			throw err;
		}
	});

	console.log("tables created");
}

module.exports = {
	init_db	
};
