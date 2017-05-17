import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db';
import middleware from './middleware';
import { config } from '../config/application-config';
import { logger } from './log';
import SwaggerExpress from 'swagger-express-mw';
import swaggerUi from 'swagger-ui-express';
import mongoose from 'mongoose';
//import swaggerDocument from '../api/swagger/swagger.yaml'
//import {swaggerDocument} from '../config/application-config';
const swaggerDocument = require('../api/swagger/swagger.json');


const app = express();
const swaggerConfig = {
  appRoot: `${__dirname}/..`
  
};

app.server = http.createServer(app);

// 3rd party middleware
app.use(cors({
  exposedHeaders: ['Link']
}));

app.use(bodyParser.json({
  limit: '100kb'
}));



// connect to db
db(λ => {
  // internal middleware
  app.use(middleware());
  
  mongoose.connect('mongodb://'+config.get('database.mongoDb.url'), (err) => {
      if(err) {
          logger.error('connection error', err);
      } else {
          logger.info('connection successful to the database');
      }
  });

  SwaggerExpress.create(swaggerConfig, (err, swaggerExpress) => {
    if (err) { throw err; }
    swaggerExpress.register(app);

    //swaggerUiMiddleware.hostUI(app, { path: '/api-doc', overrides: __dirname+'/swagger-ui' });

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use(express.static('api/swagger'));

    app.server.listen(config.get('server.port') || 5000);

    logger.info(`Started on port! ${app.server.address().port}`);
  });
});

export default app;
