import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const [salaires] = await db.execute('SELECT * FROM Salaires');
    res.status(200).json(salaires);
  } catch (error) {
    console.error('Erreur lors de la récupération des salaires:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}