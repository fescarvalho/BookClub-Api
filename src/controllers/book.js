import { Book, Category, Author } from "../models";
import * as Yup from "yup";

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
      const category = await Category.findByPk(category_id);
      const author = await Author.findByPk(author_id);

      if (!category) return res.status(400).json({ "Category not found": category });
      if (!author) return res.status(400).json({ "Author not found": author });

      const book = await new Book({
        ...req.body,
      });

      await book.save();
      return res.status(200).json({ book });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findAll(req, res) {
    try {
      const books = await Book.findAll({
        include: [
          {
            model: Author,
            as: "author",
          },
          {
            model: Category,
            as: "category",
          },
        ],
      });
      return res.status(200).json({ books });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
export default new BookController();
