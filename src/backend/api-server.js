import sirv from 'sirv';
import * as sapper from '@sapper/server';
import express from 'express';
import session from 'express-session';
import sessionFileStore from 'session-file-store';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

async function start() {
  const server = express();

  server.use(express.json());

  server.use(
    getSessionMiddleware(),
    sirv('static', { dev }));

  server.use(
    sapper.middleware({
      session: (req) => ({
        user: req.session && req.session.user,
      }),
    })
  );
  server.listen(PORT);
}

export default start;

function getSessionMiddleware() {
  const FileStore = sessionFileStore(session);
  const fileStore = new FileStore({
    path: dev ? '.sessions' : '/tmp/sessions',
  });

  const sessionInstance = session({
    secret: 'the-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 31536000,
    },
    store: fileStore,
  });

  return sessionInstance;
}
