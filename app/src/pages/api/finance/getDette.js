import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { detteID } = req.query;

  try {
    const [dettes] = await db.execute(
      'SELECT * FROM Dettes WHERE id = ?',
      [detteID]
    );

    if (dettes.length === 0) {
      return res.status(404).json({ message: 'Dette non trouvée' });
    }

    res.status(200).json(dettes[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération de la dette:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}