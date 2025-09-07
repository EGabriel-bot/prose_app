import { Context } from 'hono';
import { getAllUsers, createUser } from "../models/user";

export async function listUsers(c: Context) {
  const users = await getAllUsers();
  return c.json(users);
}

export async function addUser(c: Context) {
  const body = await c.req.json<{ name: string }>();
  const [newUser] = await createUser(body.name);
  return c.json(newUser, 201);
}
