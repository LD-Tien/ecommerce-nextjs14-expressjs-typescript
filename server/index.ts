import express from "express";
import next from "next";
import dotenv from 'dotenv';
import routes from "./routes";

dotenv.config();

const port: number = parseInt(process.env.PORT as string, 10) || 3000;
const dev: boolean = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use("/api", routes);

  server.all("*", (req: any, res: any) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });

  server.on('error', e => console.error("Server Error", e));
});
