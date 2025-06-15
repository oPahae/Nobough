import db from '../_lib/connect';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { email, password } = req.body;

  try {
    // Email existe ?
    const [secretaireRows] = await db.execute('SELECT * FROM secretaires WHERE email = ?', [email]);

    if (secretaireRows.length === 0) {
      return res.status(400).json({ message: "Compte n'existe pas" });
    }

    // Auth
    else {
      const secretaire = secretaireRows[0];
      const isPasswordValid = await bcrypt.compare(password, secretaire.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Mot de passe incorrect' });
      }

      const token = jwt.sign({
        id: secretaire.id,
        email: secretaire.email,
        created_At: secretaire.created_At,
      }, process.env.JWT_SECRET || "1111", {
        expiresIn: "7d",
      });
  
      const serialized = serialize("secretaireToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
  
      res.setHeader("Set-Cookie", serialized);

      return res.status(200).json({ message: 'Connexion réussie', user: secretaire });
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}