"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }var _models = require('../models');
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

class BookController {
  async create(req, res) {
    try {
      const schema = Yup.object().shape({
        category_id: Yup.number().required("Category is mandatory."),
        author_id: Yup.number().required("Author is mandatory."),
        name: Yup.string().required("Name is mandatory."),
        cover_url: Yup.string().url("Cover must be url valid."),
        release_date: Yup.date("Date opf lauch must be date format valid."),
        pages: Yup.number(),
        synopsis: Yup.string(),
        highlighted: Yup.boolean(),
      });

      await schema.validate(req.body);

      const { category_id, author_id } = req.body;
      const category = await _models.Category.findByPk(category_id);
      const author = await _models.Author.findByPk(author_id);

      if (!category) return res.status(400).json({ "Category not found": category });
      if (!author) return res.status(400).json({ "Author not found": author });

      const book = await new (0, _models.Book)({
        ...req.body,
      });

      await book.save();
      return res.status(200).json({ book });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findAll(req, res) {
    const { highlighted, category_id } = req.query;
    try {
      const where = {};

      if (highlighted) where.highlighted = true;
      if (category_id) where.category_id = Number(category_id);
      const books = await _models.Book.findAll({
        where,
        include: [
          {
            model: _models.Author,
            as: "author",
            attributes: ["name"],
          },
          {
            model: _models.Category,
            as: "category",
            attributes: ["name"],
          },
        ],
      });
      return res.status(200).json({ books });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
exports. default = new BookController();
