import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyAuth(req, res) {
  const token = req.cookies?.secretaireToken;

  if (!token) {
    return null;
  }

  try {
    const secretaire = jwt.verify(token, JWT_SECRET);
    return {
      id: secretaire.id,
      email: secretaire.email,
      created_At: secretaire.created_At,
    };
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}