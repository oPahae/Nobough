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
    const [userRows] = await db.execute('SELECT * FROM Utilisateurs WHERE email = ?', [email]);
    const [etudiantRows] = await db.execute('SELECT * FROM Etudiants WHERE email = ?', [email]);

    if (userRows.length === 0 && etudiantRows.length === 0) {
      return res.status(400).json({ message: "Compte n'existe pas" });
    }

    // Inscription / Paiement validés ?
    if (userRows.length > 0) {
      const user = userRows[0];
      if (!user.valide)
        return res.status(401).json({ message: "Compte non encore validé, Veuillez ressayez plus tard" });
      else
        return res.status(401).json({ message: "Paiement non encore validé, Veuillez ressayez plus tard" });
    }

    // Auth
    if (etudiantRows.length > 0) {
      const etudiant = etudiantRows[0];
      const isPasswordValid = await bcrypt.compare(password, etudiant.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Mot de passe incorrect' });
      }

      const token = jwt.sign({
        id: etudiant.id,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        email: etudiant.email,
        tel: etudiant.tel,
        cin: etudiant.cin,
        bio: etudiant.bio,
        rabais: etudiant.rabais,
        created_At: etudiant.created_At,
      }, process.env.JWT_SECRET || "1111", {
        expiresIn: "7d",
      });
  
      const serialized = serialize("etudiantToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
  
      res.setHeader("Set-Cookie", serialized);

      return res.status(200).json({ message: 'Connexion réussie', user: etudiant });
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}