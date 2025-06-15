import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const [annonces] = await db.execute('SELECT * FROM Annonces ORDER BY date DESC');

    const formattedAnnonces = annonces.map(annonce => {
      const date = new Date(annonce.date);
      const formattedDate = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      return {
        ...annonce,
        date: formattedDate
      };
    });

    res.status(200).json(formattedAnnonces);
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}