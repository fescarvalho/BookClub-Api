import { Router } from "express";
import authMiddlewares from "../middlewares/auth";
import UserControllers from "../controllers/user";
import CategoryController from "../controllers/category";
import AuthorController from "../controllers/author";
import BookController from "../controllers/book";
const routes = new Router();

//unauthenticated routes--------------------
routes.post("/user", UserControllers.create);
routes.post("/login", UserControllers.login);
routes.post("/forgot-password", UserControllers.forgotPassword);
routes.post("/reset-password", UserControllers.resetPassword);

//Authenticated routes----------------------
routes.use(authMiddlewares);
routes.get("/user", UserControllers.get);
routes.get("/category", CategoryController.getAll);
routes.post("/author", AuthorController.create);
routes.get("/author", AuthorController.getAll);
routes.post("/book", BookController.create);
routes.get("/book", BookController.findAll);

export default routes;
