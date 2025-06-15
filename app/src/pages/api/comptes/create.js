import db from '../_lib/connect';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { email, role } = req.body;

  const generatedPassword = crypto.randomBytes(6).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
  console.log('Mot de passe généré:', generatedPassword);

  try {
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    let result;
    if (role === 'Secrétaire') {
      [result] = await db.execute(
        'INSERT INTO Secretaires (email, password) VALUES (?, ?)',
        [email, hashedPassword]
      );
    } else if (role === 'Comptable') {
      [result] = await db.execute(
        'INSERT INTO Comptables (email, password) VALUES (?, ?)',
        [email, hashedPassword]
      );
    } else {
      return res.status(400).json({ message: 'Rôle non valide' });
    }

    const newAccount = {
      id: result.insertId,
      email,
      role,
      password: generatedPassword,
      created_At: new Date()
    };

    res.status(201).json(newAccount);
  } catch (error) {
    console.error('Erreur lors de la création du compte:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}