import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { id } = req.body;

  try {
    const [result] = await db.execute('UPDATE Utilisateurs SET valide = TRUE WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Inscription validée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la validation de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}