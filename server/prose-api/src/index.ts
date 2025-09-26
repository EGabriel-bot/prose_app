import { Hono } from "hono";
import { initDbClient } from "./db/DbClient";
import { addUser } from "./controllers/userController";
import {
  getBooks,
  saveBooks,
  listStoredBooks,
} from "./controllers/bookController";
import {
  getUserShelf,
  createUserBook,
} from "./controllers/userBooksController";
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
app.post("/user-books", createUserBook);

//Books
app.get("/getBooks/:bookName", getBooks);
app.get("/books", listStoredBooks);
app.post("/books", saveBooks);

app.get("/users/:userId/books", getUserShelf);

export default app;
