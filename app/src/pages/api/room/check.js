import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { code } = req.body;

  try {
    if (!code) {
      return res.status(400).json({ message: 'Le code est requis' });
    }

    const [rooms] = await db.execute(
      'SELECT * FROM rooms WHERE code = ?',
      [code]
    );

    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Code de séance invalide' });
    }

    res.status(200).json({ message: 'Code valide' });
  } catch (error) {
    console.error('Erreur lors de la vérification du code:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}