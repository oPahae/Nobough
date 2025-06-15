import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { titre, description, img, date } = req.body;

  try {
    await db.execute(
      'INSERT INTO Annonces (titre, descr, img, date) VALUES (?, ?, ?, ?)',
      [
        titre,
        description,
        Buffer.from(img, 'base64'),
        date,
      ]
    );

    res.status(201).json({ message: 'Annonce ajoutée avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'annonce:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}