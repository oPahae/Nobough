import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyAuth(req, res) {
  const token = req.cookies?.etudiantToken;

  if (!token) {
    return null;
  }

  try {
    const etudiant = jwt.verify(token, JWT_SECRET);
    return {
      id: etudiant.id,
      nom: etudiant.nom,
      prenom: etudiant.prenom,
      email: etudiant.email,
      tel: etudiant.tel,
      cin: etudiant.cin,
      bio: etudiant.bio,
      rabais: etudiant.rabais,
      created_At: etudiant.created_At,
    };
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}