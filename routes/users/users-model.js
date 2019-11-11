const db = require('../../data/db-config.js');

module.exports = {
  find,
  findBy,
  findById,
  add,
  remove
};

function find() {
  return db('users')
    .select('id', 'username');
};

function findBy(filter) {
  return db('users')
    .where(filter);
};

function findById(id) {
  return db('users')
    .where({ id })
    .first();
};

async function add(user) {
  const [id] = await db('users').insert(user);

  return findById(id);
};

function remove(id) {
  const [id] = req.params;

  return db('users')
    .where({ id })
    .delete();
};