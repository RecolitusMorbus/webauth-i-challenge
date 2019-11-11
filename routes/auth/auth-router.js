const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash;

  Users
    .add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(err => {
      res.status(500).json({ err: "An error prevented a successful user registration." });
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users
    .findBy({ username })
    .first()
    .then(user => {
      if(user && bcrypt.compareSync(password, user.password)) {
        req.session.username = user.username;
        res.status(200).json({ message: `Welcome, ${user.username}. You have been issued a cookie for a faster login experience. Please enjoy.`});
      } else {
        res.status(401).json({ message: "Denied: Invalid Credentials." });
      };
    })
    .catch(err => {
      res.status(500).json({ err: "An error prevented a successful login." })
    });
});

router.delete('/', (req, res) => {
  if(req.session) {
    req.session.destroy();
  };

  res.status(200).json({ message: "Thank you for using our service. Goodbye." });
});

module.exports = router;