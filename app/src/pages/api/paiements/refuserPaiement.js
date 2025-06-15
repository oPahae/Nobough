import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { id } = req.body;

  try {
    await db.execute(
      'UPDATE Paiements SET status = ? WHERE id = ?',
      ['nonpaye', id]
    );

    res.status(200).json({ message: 'Paiement refusé avec succès' });
  } catch (error) {
    console.error('Erreur lors du refus du paiement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}