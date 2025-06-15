import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const [protestations] = await db.execute(`SELECT * FROM Protestations ORDER BY date DESC`);

    res.status(200).json(protestations);
  } catch (error) {
    console.error('Erreur lors de la récupération des protestations:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}