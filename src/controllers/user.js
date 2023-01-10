import { User } from "../models";

class UserController {
  async create(req, res) {
    const user = new User({
      name: "Fernando",
      email: "fescarv@teste.com",
      password: "teste123",
      password_hash: "",
      reset_password_token: "teste",
      reset_password_token_sent_at: new Date(),
      avatar_url: "testeURl",
    });
    await user.save();

    return res.json({ user });
  }
}

export default new UserController();
