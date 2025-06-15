import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyAuth(req, res) {
  const token = req.cookies?.adminToken;

  if (!token) {
    return null;
  }

  try {
    const admin = jwt.verify(token, JWT_SECRET);
    return {
      id: 1,
    };
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}