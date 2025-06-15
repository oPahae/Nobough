import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const [paiements] = await db.execute(`
      SELECT
        p.id,
        p.etudiantID,
        p.total,
        p.preuve,
        p.datePaiement,
        p.formationID,
        e.nom,
        e.prenom,
        e.email,
        e.tel,
        e.cin,
        e.birth,
        e.img,
        f.titre as formationTitre
      FROM Paiements p
      JOIN Etudiants e ON p.etudiantID = e.id
      JOIN Formations f ON p.formationID = f.id
      WHERE p.status = 'enattente'
      ORDER BY p.datePaiement DESC
    `);

    res.status(200).json(paiements);
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}