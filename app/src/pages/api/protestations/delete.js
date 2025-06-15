import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { id } = req.body;

  try {
    await db.execute('DELETE FROM Protestations WHERE id=?', [id]);

    res.status(201).json({ message: 'FAQ ajoutée avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout à la FAQ:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}