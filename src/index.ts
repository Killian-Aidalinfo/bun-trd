import './utils/db';
import { Hono } from "hono";
import { userCreate, userLogin } from './controllers/usersController';
import { viewMatch } from './controllers/matchController';

const app = new Hono();

// Route de status
app.get("/", (c) => {
  return c.text("Ready");
});

//Partie utilisateur
app.post("/user", ...userCreate);
app.post("/login", ...userLogin);
app.get("/matchs", ...viewMatch);
//https://hono.dev/docs/getting-started/bun
//https://bun.sh/guides/runtime/read-env
export default {
  port: Bun.env.API_PORT,
  fetch: app.fetch
}
