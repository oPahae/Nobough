import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { etudiantID } = req.query;

  try {
    const [formationRows] = await db.execute(`
        SELECT f.*, i.created_At as dateJoigne
        FROM Formations f, Inscriptions i
        WHERE f.id = i.formationID
        AND i.etudiantID = ?
    `, [etudiantID]);

    res.status(200).json(formationRows);
  } catch (error) {
    console.error('Erreur lors de la récupération de la formation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}