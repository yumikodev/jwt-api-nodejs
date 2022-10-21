import { Router } from "express";
import { signinHandler, signupHandler } from "../controllers/auth.controller";
import {
  checkExistingRole,
  checkExistingUser,
} from "../middlewares/verifySignup";

const router = Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, Content-Type, Accept"
  );
  next();
});

router.post("/signup", [checkExistingUser, checkExistingRole], signupHandler);

router.post("/signin", signinHandler);

export default router;
