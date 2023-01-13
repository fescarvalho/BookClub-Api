"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }var _models = require('../models');
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

class UserBookController {
  async create(req, res) {
    try {
      const schema = Yup.object().shape({
        book_id: Yup.number().required("Id of book is mandatory."),
      });

      await schema.validate(req.body);

      const user = await _models.User.findByPk(req.userId);
      if (!user) return res.status(404).json({ error: "User not found." });

      const book = await _models.Book.findByPk(req.body.book_id);
      if (!book) return res.status(404).json({ error: "Book not found." });

      const alreadyExists = await _models.UserBook.findOne({
        where: {
          user_id: req.userId,
          book_id: req.body.book_id,
        },
      });

      if (alreadyExists) return res.status(400).json({ error: "Book already exists." });

      const userBook = new (0, _models.UserBook)({
        user_id: user.id,
        book_id: req.body.book_id,
      });
      await userBook.save();

      return res.status(200).json(userBook);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const userBooks = await _models.UserBook.findAll({
        where: {
          user_id: req.userId,
        },
        include: [
          {
            model: _models.Book,
            as: "book",
            include: [
              {
                model: _models.Author,
                as: "author",
                attributes: ["name"],
              },
            ],
          },
        ],
      });

      return res.json(userBooks);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      if (!req.params.id) return res.status(400).json({ error: "Id of book is mandatory." });
      const userbook = await _models.UserBook.findByPk(req.params.id);

      if (!userbook) return res.status(400).json({ error: "Book not found." });
      if (userbook.user_id !== req.userId)
        return res.status(400).json({ error: "Registration does not belong to this user." });

      await userbook.destroy();
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

exports. default = new UserBookController();
