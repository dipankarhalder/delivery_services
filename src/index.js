const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { StatusCodes } = require('http-status-codes');

const { routers, msg } = require('./constant');
const { envConfig, dbConfig } = require('./config');
const { RootApiRouter } = require('./routes');

/* initial express app */
const app = express();

/* CORS configuration */
const corsOptions = {
  origin: envConfig.CLIENTURL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
};

/* all important middleware */
app.use(morgan(envConfig.PLATFORM));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* application main endpoint */
app.use(routers.endPoints.base, RootApiRouter);

/* handled undefined routes */
app.use((req, res, next) => {
  const error = new Error(msg.app_msg.api_not_found);
  error.status = StatusCodes.NOT_FOUND;
  next(error);
});

/* application global errors handled using middleware */
app.use((error, req, res) => {
  res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR);
  res.json({
    error: {
      message: error.message,
    },
  });
});

/* connect database and started server */
dbConfig
  .dbConnect()
  .then(() => {
    app.listen(envConfig.PORT, () => {
      console.log(`${msg.server.serve_success} ${envConfig.PORT}`);
    });
  })
  .catch((err) => {
    console.error(msg.db_msg.db_failed, err);
    process.exit(1);
  });
