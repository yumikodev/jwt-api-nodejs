import User from "../models/User";
import { ROLES } from "../models/Role";
import Ctrl from "../utils/Ctrl";

export const checkExistingUser = Ctrl(async (req, res, next) => {
  try {
    const userFound = await User.findOne({ username: req.body.username });
    if (userFound)
      return res.status(400).json({ message: "The user already exists" });

    const email = await User.findOne({ email: req.body.email });
    if (email)
      return res.status(400).json({ message: "The email already exists" });

    next();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export const checkExistingRole = Ctrl((req, res, next) => {
  if (!req.body.roles) return res.status(400).json({ message: "No roles" });
  if (!Array.isArray(req.body.roles))
    return res.status(404).json({ message: "Role is not an Array" });

  for (let i = 0; i < req.body.roles.length; i++) {
    if (!ROLES.includes(req.body.roles[i])) {
      return res.status(400).json({
        message: `Role ${req.body.roles[i]} does not exist`,
      });
    }
  }

  next();
});
