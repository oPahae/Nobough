import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { professeurID } = req.body;

  try {
    // Supprimer le professeur
    const [result] = await db.execute(
      'DELETE FROM Professeurs WHERE id = ?',
      [professeurID]
    );

    // Vérifier si la suppression a réussi
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Professeur non trouvé' });
    }

    res.status(200).json({ message: 'Compte supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}