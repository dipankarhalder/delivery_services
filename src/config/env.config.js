const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  MONGOURI: process.env.MONGOURI,
  PLATFORM: process.env.PLATFORM,
  JWTSECRET: process.env.JWTSECRET,
  EXPTIME: process.env.EXPTIME,
  NODEENV: process.env.NODEENV,
  CLIENTURL: process.env.CLIENTURL,
};
