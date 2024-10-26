import './utils/db';
import { Hono } from "hono";
import { userCreate, userLogin } from './controllers/usersController';

const app = new Hono();

// Route de status
app.get("/", (c) => {
  return c.text("Ready");
});

//Partie utilisateur
app.post("/user", ...userCreate);
app.post("/login", ...userLogin);

//https://hono.dev/docs/getting-started/bun
//https://bun.sh/guides/runtime/read-env
export default {
  port: Bun.env.API_PORT,
  fetch: app.fetch
}
