import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { id } = req.body;

  try {
    await db.execute('DELETE FROM Annonces WHERE id = ?', [id]);

    res.status(200).json({ message: 'Annonce supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'annonce:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}