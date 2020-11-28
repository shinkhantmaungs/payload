/* eslint-disable no-console */
import express from 'express';
import path from 'path';
import payload from '../src';

const expressApp = express();

expressApp.use('/static', express.static(path.resolve(__dirname, 'client/static')));

payload.init({
  secret: 'SECRET_KEY',
  mongoURL: 'mongodb://localhost/payload',
  express: expressApp,
  onInit: (app) => {
    app.logger.info('Payload Demo Initialized');
  },
});

const externalRouter = express.Router();

externalRouter.use(payload.authenticate);

externalRouter.get('/', (req, res) => {
  if (req.user) {
    return res.send(`Authenticated successfully as ${req.user.email}.`);
  }

  return res.send('Not authenticated');
});

expressApp.use('/external-route', externalRouter);

export const start = (cb) => {
  const server = expressApp.listen(3000, async () => {
    payload.logger.info(`listening on ${3000}...`);

    if (cb) cb();
  });

  return server;
};

// when server.js is launched directly
if (module.id === require.main.id) {
  start();
}