import { Router } from "express";
import authMiddlewares from "../middlewares/auth";
import UserControllers from "../controllers/user";
import CategoryController from "../controllers/category";
import AuthorController from "../controllers/author";
import BookController from "../controllers/book";
import UserBookController from "../controllers/userbook";
import SearchController from "../controllers/search";
const routes = new Router();

//unauthenticated routes--------------------
routes.post("/user", UserControllers.create);
routes.post("/login", UserControllers.login);
routes.post("/forgot-password", UserControllers.forgotPassword);
routes.post("/reset-password", UserControllers.resetPassword);

//Authenticated routes----------------------
routes.use(authMiddlewares);
routes.get("/user", UserControllers.get);
routes.put("/user", UserControllers.update);
routes.put("/user/avatar", UserControllers.updateAvatar);

routes.get("/category", CategoryController.getAll);

routes.post("/author", AuthorController.create);
routes.get("/author", AuthorController.getAll);
routes.get("/author/:id", AuthorController.get);

routes.post("/book", BookController.create);
routes.get("/book", BookController.findAll);

routes.post("/userbook", UserBookController.create);
routes.get("/userbook", UserBookController.getAll);
routes.delete("/userbook/:id", UserBookController.delete);

routes.get("/search", SearchController.get);
export default routes;
