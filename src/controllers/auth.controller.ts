import jwt from "jsonwebtoken";
import User from "../models/User";
import Role from "../models/Role";
import { SECRET } from "../config";
import Ctrl from "../utils/Ctrl";

export const signupHandler = Ctrl(async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    // Creating a new User Object
    const newUser = new User({
      username,
      email,
      password,
    });

    // checking for roles
    if (roles) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      // @ts-ignore
      newUser.roles = foundRoles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "user" });
      // @ts-ignore
      newUser.roles = [role._id];
    }

    // Saving the User Object in Mongodb
    const savedUser = await newUser.save();

    // Create a token
    const token = jwt.sign({ id: savedUser._id }, <string>SECRET);

    return res.status(200).json({ token });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

export const signinHandler = Ctrl(async (req, res) => {
  try {
    // Request body email can be an email or username
    const userFound = await User.findOne({ email: req.body.email }).populate(
      "roles"
    );

    if (!userFound) return res.status(400).json({ message: "User Not Found" });

    // @ts-ignore
    const matchPassword = await User.comparePass(
      req.body.password,
      userFound.password
    );

    if (!matchPassword)
      return res.status(401).json({
        message: "Invalid Password",
      });

    const token = jwt.sign({ id: userFound._id }, <string>SECRET);
    // {
    //  expiresIn: 86400, // 24 hours
    // }

    res.json({ token });
  } catch (error) {
    console.log(error);
  }
});
