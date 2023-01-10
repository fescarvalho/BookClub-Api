import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import db from "./src/models";
import routes from "./src/routes";

const app = express();

app.use(express.json());
app.use(routes);

app.listen(3333, async () => {
  try {
    await db.sequelize.authenticate();
    console.log("API Runing and db connected.");
  } catch (error) {
    console.error(error.message);
  }
});
