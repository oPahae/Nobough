import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyAuth(req, res) {
  const token = req.cookies?.professeurToken;

  if (!token) {
    return null;
  }

  try {
    const professeur = jwt.verify(token, JWT_SECRET);
    return {
      id: professeur.id,
      nom: professeur.nom,
      prenom: professeur.prenom,
      email: professeur.email,
      tel: professeur.tel,
      cin: professeur.cin,
      bio: professeur.bio,
      specialites: professeur.specialites,
      created_At: professeur.created_At,
    };
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}