import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { docID } = req.body;

  try {
    if (!docID) {
      return res.status(400).json({ message: 'ID du document manquant' });
    }

    const [result] = await db.execute(
      'DELETE FROM Docs WHERE id = ?',
      [docID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Document non trouvé' });
    }

    res.status(200).json({ message: 'Document supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du document:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}