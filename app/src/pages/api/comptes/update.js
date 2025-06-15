import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { id, email, role } = req.body;
  console.log(email)

  try {
    if (role === 'Secrétaire') {
      await db.execute(
        'UPDATE Secretaires SET email = ? WHERE id = ?',
        [email, id]
      );
    } else if (role === 'Comptable') {
      await db.execute(
        'UPDATE Comptables SET email = ? WHERE id = ?',
        [email, id]
      );
    } else {
      return res.status(400).json({ message: 'Rôle non valide' });
    }

    res.status(200).json({ id, email, role });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du compte:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}