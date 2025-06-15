import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyAuth(req, res) {
  const token = req.cookies?.comptableToken;

  if (!token) {
    return null;
  }

  try {
    const comptable = jwt.verify(token, JWT_SECRET);
    return {
      id: comptable.id,
      email: comptable.email,
      created_At: comptable.created_At,
    };
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}