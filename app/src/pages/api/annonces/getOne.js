import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { id } = req.query;

  try {
    const [annonceRows] = await db.execute('SELECT * FROM Annonces WHERE id = ?', [id]);

    if (annonceRows.length === 0) {
      return res.status(404).json({ message: 'Annonce non trouvée' });
    }

    const annonce = annonceRows[0];
    const formattedAnnonce = {
      ...annonce,
      date: annonce.date ? new Date(annonce.date).toISOString().split('T')[0] : null
    };

    res.status(200).json(formattedAnnonce);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'annonce:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}