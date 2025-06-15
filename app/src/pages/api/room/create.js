import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { code, profID } = req.body;

  try {
    if (!code || !profID) {
      return res.status(400).json({ message: 'Tous les champs obligatoires ne sont pas remplis' });
    }

    const [existingRooms] = await db.execute(
      'SELECT * FROM rooms WHERE code = ?',
      [code]
    );

    if (existingRooms.length > 0) {
      return res.status(400).json({ message: 'Un code similaire existe déjà' });
    }

    const [result] = await db.execute(
      'INSERT INTO rooms (code, profID) VALUES (?, ?)',
      [code, profID]
    );

    const [newRoom] = await db.execute(
      'SELECT * FROM rooms WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newRoom[0]);
  } catch (error) {
    console.error('Erreur lors de la création de la salle:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}