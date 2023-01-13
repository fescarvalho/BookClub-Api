"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _auth = require('../middlewares/auth'); var _auth2 = _interopRequireDefault(_auth);
var _user = require('../controllers/user'); var _user2 = _interopRequireDefault(_user);
var _category = require('../controllers/category'); var _category2 = _interopRequireDefault(_category);
var _author = require('../controllers/author'); var _author2 = _interopRequireDefault(_author);
var _book = require('../controllers/book'); var _book2 = _interopRequireDefault(_book);
var _userbook = require('../controllers/userbook'); var _userbook2 = _interopRequireDefault(_userbook);
var _search = require('../controllers/search'); var _search2 = _interopRequireDefault(_search);
const routes = new (0, _express.Router)();

//unauthenticated routes--------------------
routes.post("/user", _user2.default.create);
routes.post("/login", _user2.default.login);
routes.post("/forgot-password", _user2.default.forgotPassword);
routes.post("/reset-password", _user2.default.resetPassword);

//Authenticated routes----------------------
routes.use(_auth2.default);
routes.get("/user", _user2.default.get);
routes.put("/user", _user2.default.update);
routes.put("/user/avatar", _user2.default.updateAvatar);

routes.get("/category", _category2.default.getAll);

routes.post("/author", _author2.default.create);
routes.get("/author", _author2.default.getAll);
routes.get("/author/:id", _author2.default.get);

routes.post("/book", _book2.default.create);
routes.get("/book", _book2.default.findAll);

routes.post("/userbook", _userbook2.default.create);
routes.get("/userbook", _userbook2.default.getAll);
routes.delete("/userbook/:id", _userbook2.default.delete);

routes.get("/search", _search2.default.get);
exports. default = routes;
