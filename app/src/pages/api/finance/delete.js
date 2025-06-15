import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { table, id } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ message: 'ID du revenu manquant' });
    }

    const [result] = await db.execute(
      `DELETE FROM ${table} WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Revenu non trouvé' });
    }

    res.status(200).json({ message: 'Revenu supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du revenu:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}