import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { password } = req.body;

  try {
    if (password != process.env.NOT_TELLING)
      return res.status(400).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({
      id: 1,
    }, process.env.JWT_SECRET || "1111", {
      expiresIn: "7d",
    });

    const serialized = serialize("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    res.setHeader("Set-Cookie", serialized);

    return res.status(200).json({ message: 'Connexion réussie' });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}