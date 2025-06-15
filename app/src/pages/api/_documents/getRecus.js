import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { etudiantID } = req.query;

  try {
    const [paiements] = await db.execute(
      `SELECT * FROM paiements p
       WHERE p.etudiantID = ? AND status = 'paye'`,
      [etudiantID]
    );

    const formattedPaiements = paiements.map(paiement => ({
      id: paiement.id,
      formationID: paiement.formationID,
      formationTitre: paiement.formationTitre,
      total: paiement.total,
      created_At: paiement.created_At
    }));

    res.status(200).json(formattedPaiements);
  } catch (error) {
    console.error('Erreur lors de la récupération des reçus:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}