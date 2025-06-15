import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const [rows] = await db.execute(`
      SELECT a.*, f.titre as formationTitre, f.prix formationPrix, f.id as formationID, e.nom, e.prenom, e.email, e.tel, e.img, e.cin, e.birth
      FROM Attentes a, Etudiants e, Formations f
      WHERE a.etudiantID = e.id
      AND a.formationID = f.id
      AND a.paye = true
      ORDER BY a.created_At DESC
    `);

    // img blob to base64
    const paiements = rows.map(paiement => {
      return {
        ...paiement,
        img: paiement.img ? `data:image/jpeg;base64,${Buffer.from(paiement.img).toString('base64')}` : null,
        preuve: paiement.preuve ? `data:image/jpeg;base64,${Buffer.from(paiement.preuve).toString('base64')}` : null
      };
    });

    res.status(200).json(paiements);
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}