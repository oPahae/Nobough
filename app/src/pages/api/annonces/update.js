import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { id, titre, description, img, date } = req.body;

  try {
    await db.execute(
      'UPDATE Annonces SET titre = ?, descr = ?, img = ?, date = ? WHERE id = ?',
      [
        titre,
        description,
        Buffer.from(img, 'base64'),
        date,
        id
      ]
    );

    res.status(200).json({ message: 'Annonce modifiée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la modification de l\'annonce:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}