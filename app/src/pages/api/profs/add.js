import db from '../_lib/connect';
import bcrypt from 'bcryptjs';

function generateRandomPassword(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { nom, prenom, email, tel, cin, bio, specialites, salaire, img } = req.body;

  try {
    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      'INSERT INTO Professeurs (nom, prenom, email, tel, img, password, cin, bio, specialites, salaire) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        nom,
        prenom,
        email,
        tel,
        img || null,
        hashedPassword,
        cin,
        bio,
        specialites,
        salaire
      ]
    );

    res.status(201).json({
      message: 'Professeur ajouté avec succès',
      password: password
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du professeur:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      if (error.message.includes('email')) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }
      if (error.message.includes('cin')) {
        return res.status(400).json({ message: 'Ce CIN est déjà utilisé' });
      }
    }

    res.status(500).json({ message: 'Erreur serveur' });
  }
}