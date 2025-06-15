import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { id } = req.body;

  try {
    const [professeurRows] = await db.execute('SELECT id FROM Professeurs WHERE id = ?', [id]);

    if (professeurRows.length === 0) {
      return res.status(404).json({ message: 'Professeur non trouvé' });
    }

    await db.execute('DELETE FROM Professeurs WHERE id = ?', [id]);

    res.status(200).json({ message: 'Professeur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du professeur:', error);

    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({
        message: 'Impossible de supprimer ce professeur car il est référencé dans d\'autres tables'
      });
    }

    res.status(500).json({ message: 'Erreur serveur' });
  }
}