import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { depenseID } = req.query;

  try {
    const [depenses] = await db.execute(
      'SELECT * FROM Depenses WHERE id = ?',
      [depenseID]
    );

    if (depenses.length === 0) {
      return res.status(404).json({ message: 'Dépense non trouvée' });
    }

    res.status(200).json(depenses[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération de la dépense:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}