import express from "express";
import db from "./src/models";
import UserControllers from "./src/controllers/user";

const app = express();

app.post("/", UserControllers.create);
app.listen(3333, async () => {
  try {
    await db.sequelize.authenticate();
    console.log("API Runing and db connected.");
  } catch (error) {
    console.error(error.message);
  }
});
