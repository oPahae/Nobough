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

  const { id, status, preuve, datePaiement } = req.body;

  try {
    await db.execute(
      'UPDATE Paiements SET status = ?, preuve = ?, datePaiement = ? WHERE id = ?',
      [
        status,
        preuve ? Buffer.from(preuve, 'base64') : null,
        datePaiement,
        id
      ]
    );

    res.status(200).json({ message: 'Paiement mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du paiement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}