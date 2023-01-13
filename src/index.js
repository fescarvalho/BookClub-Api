import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import db from "./models";
import routes from "./routes";

const app = express();

app.use(express.json());
app.use(routes);

app.listen(3333, async () => {
  try {
    await db.sequelize.authenticate();
  } catch (error) {
    console.error(error.message);
  }
});
