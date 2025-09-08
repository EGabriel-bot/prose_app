import { Hono } from "hono";
import { initDbClient } from "./db/DbClient";
import { addUser } from "./controllers/userController";
import {
  getBooks,
  saveBooks,
  listStoredBooks,
} from "./controllers/bookController";
type Bindings = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", async (c, next) => {
  initDbClient(c.env.DATABASE_URL);
  await next();
});

//User
app.post("/createUser", addUser);

//Books
app.get("/getBooks/:bookName", getBooks);
app.get("/books", listStoredBooks);
app.post("/books", saveBooks);

export default app;
