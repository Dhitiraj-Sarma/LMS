import express from "express";
import { registerUser, loginUser } from "../controllers/auth-controller.js";
import { authenticate } from "../middleware/auth-middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/check-auth", authenticate, (req, res) => {
  const user = req.user;

  if (user) {
    return res.status(200).json({
      success: true,
      message: "Authenticated user",
      data: {
        user,
      },
    });
  }
});

export default router;
