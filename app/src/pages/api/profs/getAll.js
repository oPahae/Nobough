import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const [professeurs] = await db.execute('SELECT * FROM Professeurs');
    res.status(200).json(professeurs);
  } catch (error) {
    console.error('Erreur lors de la récupération des professeurs:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}