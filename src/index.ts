import './utils/db';
import { Hono } from "hono";
import { userCreate} from './controllers/usersController';

const app = new Hono();

// Route de status
app.get("/", (c) => {
  return c.text("Ready");
});

//Partie utilisateur
app.post("/user", ...userCreate);

//https://hono.dev/docs/getting-started/bun
//https://bun.sh/guides/runtime/read-env
export default {
  port: Bun.env.API_PORT,
  fetch: app.fetch
}
