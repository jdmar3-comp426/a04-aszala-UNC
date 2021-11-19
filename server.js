// Define app using express
var express = require("express")
var app = express()
// Require database SCRIPT file
var db = require("./database.js")

// Require md5 MODULE
var md5 = require("md5")

// Make Express use its own built-in body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set server port
let HTTP_PORT = 5000;

// Start server
app.listen(HTTP_PORT, () => {
    //console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// READ (HTTP method GET) at root endpoint /app/
app.get("/app/", (req, res, next) => {
    res.json({"message":"Your API works! (200)"});
	res.status(200);
});

// Define other CRUD API endpoints using express.js and better-sqlite3
// CREATE a new user (HTTP method POST) at endpoint /app/new/

// READ a list of all users (HTTP method GET) at endpoint /app/users/


// READ a single user (HTTP method GET) at endpoint /app/user/:id

// UPDATE a single user (HTTP method PATCH) at endpoint /app/update/user/:id

// DELETE a single user (HTTP method DELETE) at endpoint /app/delete/user/:id

// Default response for any other request

app.use("/app/new/", (req, res) => {
	const user = req.body.user;
	const pass = md5(req.body.pass);

	const stmt = db.prepare(`INSERT INTO userinfo (user, pass) VALUES (?, ?)`).run(user, pass);

	res.status(201).json({"message": `1 record created: ID ${stmt.lastInsertRowid} (201)`});
});

app.use("/app/users/", (req, res) => {	
	const stmt = db.prepare("SELECT * FROM userinfo").all();
	res.status(200).json(stmt);
});

app.use("/app/user/:id", (req, res) => {
	const id = req.params.id;

	const stmt = db.prepare(`SELECT * FROM userinfo WHERE id = ?`).run(id);
	res.status(200).json(stmt[0]);
});

app.patch("/app/update/:id", (req, res) => {
	const id = req.params.id;
	const user = req.body.user;
	const pass = md5(req.body.pass);

	const stmt = db.prepare(`UPDATE userinfo SET user = COALESCE(?,user), pass = COALESCE(?,pass) WHERE id = ?`).run(user, pass, id);
	res.status(200).json({"message": `1 record updated: ID ${stmt.lastInsertRowid} (200)`});
});

app.delete("/app/delete/user/:id", (req, res) => {
	const id = req.params.id;
	const stmt = db.prepare(`DELETE FROM userinfo WHERE id = ?`).run(id);
	res.status(200).json({"message": `1 record deleted: ID ${stmt.lastInsertRowid} (200)`});
});


app.use(function(req, res){
    res.status(404);
});
