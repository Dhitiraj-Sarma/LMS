import jwt from "jsonwebtoken";

const verifyToken = (token, serect) => {
  jwt.verify(token, serect);
};

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "User is not authenticated",
    });
  }

  const token = authHeader.split(" ")[1];

  const payload = verifyToken(token, "JWT_SECRET");

  req.user = payload;

  next();
};
