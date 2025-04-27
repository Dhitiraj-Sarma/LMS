import jwt from "jsonwebtoken";

const verifyToken = (token, secret) => {
  // return the decoded payload, or let it throw
  return jwt.verify(token, secret);
};

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1) Check that we have a Bearer token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2) Verify & decode, using your real secret
    const payload = verifyToken(token, "JWT_SECRET");

    // 3) Attach the decoded payload to req.user
    req.user = payload;

    // 4) Pass control to the next middleware/handler
    return next();
  } catch (err) {
    // 5) If verification failed, send a 403
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
