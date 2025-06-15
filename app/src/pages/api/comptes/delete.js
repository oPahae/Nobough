import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { id, role } = req.body;
  console.log('supprimer : ' + role)

  try {
    if (role === 'Secrétaire') {
      await db.execute(
        'DELETE FROM Secretaires WHERE id = ?',
        [id]
      );
    } else if (role === 'Comptable') {
      await db.execute(
        'DELETE FROM Comptables WHERE id = ?',
        [id]
      );
    } else {
      return res.status(400).json({ message: 'Rôle non valide' });
    }

    res.status(200).json({ message: 'Compte supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}