import db from '../_lib/connect';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { email, password } = req.body;
  console.log(email)

  try {
    // Email existe ?
    const [professeurRows] = await db.execute('SELECT * FROM Professeurs WHERE email = ?', [email]);

    if (professeurRows.length === 0) {
      return res.status(400).json({ message: "Compte n'existe pas" });
    }

    // Auth
    else {
      const professeur = professeurRows[0];
      const isPasswordValid = await bcrypt.compare(password, professeur.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Mot de passe incorrect' });
      }

      const token = jwt.sign({
        id: professeur.id,
        nom: professeur.nom,
        prenom: professeur.prenom,
        email: professeur.email,
        tel: professeur.tel,
        cin: professeur.cin,
        bio: professeur.bio,
        created_At: professeur.created_At,
      }, process.env.JWT_SECRET || "1111", {
        expiresIn: "7d",
      });
  
      const serialized = serialize("professeurToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
  
      res.setHeader("Set-Cookie", serialized);

      return res.status(200).json({ message: 'Connexion réussie', user: professeur });
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}