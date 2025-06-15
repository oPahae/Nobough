import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { nom, prenom, email, tel, message, sujet } = req.body;

  try {
    await db.execute(
      'INSERT INTO Protestations (nom, prenom, email, tel, message) VALUES (?, ?, ?, ?, ?)',
      [nom, prenom, email, tel, message]
    );

    res.status(201).json({ message: 'Protestation ajoutée avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la protestation:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Une protestation similaire existe déjà' });
    }

    res.status(500).json({ message: 'Erreur serveur' });
  }
}