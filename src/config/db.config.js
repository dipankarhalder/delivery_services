const mongoose = require('mongoose');

const { MONGOURI } = require('./env.config');
const { msg } = require('../constant');

const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(MONGOURI);
    console.log(`${msg.db_msg.db_success}`);
    return connect;
  } catch (err) {
    console.log(`${msg.db_msg.db_failed} ${err.message}`);
    process.exit(1);
  }
};

module.exports = {
  dbConnect,
};
