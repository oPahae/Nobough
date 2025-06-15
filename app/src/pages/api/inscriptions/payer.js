export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { preuve, msg, id } = req.body;

  try {
    await db.execute(
      'UPDATE Attentes SET paye = TRUE, preuve = ?, msg = ? WHERE id = ?',
      [preuve, msg, id]
    );

    res.status(201).json({ message: 'Paiement enregistré avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du paiement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}