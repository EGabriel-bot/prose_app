import { Hono } from 'hono'
import { initDbClient } from './db/DbClient';
import { addUser } from './controllers/userController';
import { getBooks } from './controllers/bookController';

type Bindings = {
      DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();
app.use('*', async (c, next) => {
  initDbClient(c.env.DATABASE_URL);
  await next();
});

app.post('/createUser', addUser);
app.get('/getBooks/:bookName', getBooks);

export default app
