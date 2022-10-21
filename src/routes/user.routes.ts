import { Router } from "express";
import { authJwt } from "../middlewares";
import User from "../models/User";
import Ctrl from "../utils/Ctrl";
const router = Router();

router.get(
  "/me",
  [authJwt.verifyToken],
  Ctrl(async (req, res) => {
    try {
      // @ts-ignore
      const user = await User.findById(req.userId, { password: 0 });

      res.json(user);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  })
);

export default router;
