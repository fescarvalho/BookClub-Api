import { Router } from "express";
import authMiddlewares from "../middlewares/auth";
import UserControllers from "../controllers/user";
const routes = new Router();

//unauthenticated routes--------------------
routes.post("/user", UserControllers.create);
routes.post("/login", UserControllers.login);
routes.post("/forgot-password", UserControllers.forgotPassword);

//Authenticated routes----------------------
routes.use(authMiddlewares);
routes.get("/user", UserControllers.get);

export default routes;
