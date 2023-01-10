import { User } from "../models";

class UserControllers {
  async create(req, res) {
    const user = new User({
      name: "Fernando",
      email: "fernando@teste.com",
      password: "teste123",
      password_hash: "teste123",
    });

    await user.save();

    return res.json({ user });
  }
}

export default new UserControllers();
