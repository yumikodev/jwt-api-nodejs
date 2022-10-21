import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET } from "../config";
import User from "../models/User";
import Role from "../models/Role";
import Ctrl from "../utils/Ctrl";

export const verifyToken = Ctrl(async (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    // @ts-ignore
    const decoded: JwtPayload = jwt.verify(<string>token, SECRET);
    // @ts-ignore
    req.userId = decoded.id;

    const user = await User.findById(decoded.id, { password: 0 });
    if (!user) return res.status(404).json({ message: "No user found" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
});

export const isModerator = Ctrl(async (req, res, next) => {
  try {
    // @ts-ignore
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user?.roles } });
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator") {
        next();
        return;
      }
    }
    return res.status(403).json({ message: "Require Moderator Role!" });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
});

export const isAdmin = Ctrl(async (req, res, next) => {
  try {
    // @ts-ignore
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user?.roles } });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
    }

    return res.status(403).json({ message: "Require Admin Role!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
});
