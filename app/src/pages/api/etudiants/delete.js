import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { etudiantID } = req.body;

  try {
    // Vérifier le champ obligatoire
    if (!etudiantID) {
      return res.status(400).json({ message: 'ID étudiant manquant' });
    }

    // Supprimer l'étudiant
    const [result] = await db.execute(
      'DELETE FROM etudiants WHERE id = ?',
      [etudiantID]
    );

    // Vérifier si la suppression a réussi
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }

    res.status(200).json({ message: 'Compte supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}