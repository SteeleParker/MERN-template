//environment variables
require('dotenv').config();

//create the server
const express = require('express');
const app = express();
const server = require('http').Server(app);

//libraries used here
const path = require('path');
const formidable = require('express-formidable');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const SequelizeStore = require("connect-session-sequelize")(session.Store);

//database connection
const database = require('./database');
const models = require('./database/models'); //invoke all models

app.use(formidable());
app.use(cookieParser());
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	store: new SequelizeStore({
		db: database
	})
}));

//account management
app.use('/api/accounts', require('./accounts'));

//administration
app.use('/api/admin', require('./admin'));
require('./admin/bookkeeper')(); //BUGFIX

//send static files
app.use('/', express.static(path.resolve(__dirname, '..', 'public')));

//fallback to the index file
app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '..', 'public' , 'index.html'));
});

//startup
server.listen(process.env.WEB_PORT || 3000, (err) => {
	console.log(`listening to localhost:${process.env.WEB_PORT || 3000}`);
});
