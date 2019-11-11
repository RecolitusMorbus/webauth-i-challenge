const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const sessions = require('express-sessions');
const KnexSessionStores = require('connect-session-knex')(sessions);

const Auth = require('../routes/auth/auth-router.js')
const Users = require('../routes/users/users-router.js');

const server = express();
const sessionConfig = { 
  name: "sid",
  secret: "This is a secret. You aren't allowed to know this.",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false,
    httpOnly: true
  },
  store: new KnexSessionStores({
    knex: require('../data/db-config.js'),
    table: 'sessions',
    sidfilename: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 10
  })
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/restricted/auth', Auth);
server.use('/restricted/user', Users);

server.get('/', (req, res) => {
  res.send(`You have reached the root directory.`);
});

module.exports = server;