import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { revenuID } = req.query;

  try {
    const [revenus] = await db.execute(
      'SELECT * FROM Revenus WHERE id = ?',
      [revenuID]
    );

    if (revenus.length === 0) {
      return res.status(404).json({ message: 'Revenu non trouvé' });
    }

    res.status(200).json(revenus[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération du revenu:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}