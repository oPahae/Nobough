import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { etudiantID, formationID } = req.query;

  try {
    let query = 'SELECT * FROM Paiements WHERE etudiantID = ?';
    const params = [etudiantID];

    if (formationID) {
      query += ' AND formationID = ?';
      params.push(formationID);
    }

    query += ' ORDER BY created_At DESC';

    const [paiements] = await db.execute(query, params);

    res.status(200).json(paiements);
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}
