"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _models = require('../models');
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

class AuthorController {
  async create(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string()
          .required("Name is mandatory.")
          .min(3, "Name must be at least 3 characters."),
        avatar_url: Yup.string().url("Avatar url must be in url format."),
      });
      await schema.validate(req.body);
      const createdAuthor = await new (0, _models.Author)({
        ...req.body,
      });

      await createdAuthor.save();
      return res.status(200).json(createdAuthor);
    } catch (error) {
      return res.status(400).json({ error: _optionalChain([error, 'optionalAccess', _ => _.message]) });
    }
  }

  async getAll(req, res) {
    try {
      const authors = await _models.Author.findAll({
        order: [["name", "ASC"]],
      });
      return res.json(authors);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async get(req, res) {
    try {
      const { id } = req.params;

      if (!id) return res.status(404).json({ error: "Id of author is mandatory." });

      const author = await _models.Author.findByPk(Number(id), {
        include: [
          {
            model: _models.Book,
            as: "book",
          },
        ],
      });

      if (!author) return res.status(404).json({ error: "Author not found." });

      return res.json(author);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
exports. default = new AuthorController();
