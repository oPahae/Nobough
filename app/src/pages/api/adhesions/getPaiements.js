import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const [rows] = await db.execute(`
      SELECT f.*, u.nom, u.prenom, u.email, u.tel, u.img, u.cin, u.bio, u.created_At
      FROM Frais f, Utilisateurs u
      WHERE f.userID = u.id
      ORDER BY f.created_At DESC
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