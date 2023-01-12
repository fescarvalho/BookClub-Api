import { Author, Book } from "../models";
import * as Yup from "yup";

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
      const createdAuthor = await new Author({
        ...req.body,
      });

      await createdAuthor.save();
      return res.status(200).json(createdAuthor);
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }
  }

  async getAll(req, res) {
    try {
      const authors = await Author.findAll({
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

      const author = await Author.findByPk(Number(id), {
        include: [
          {
            model: Book,
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
export default new AuthorController();
