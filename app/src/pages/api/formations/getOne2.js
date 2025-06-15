import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { formationID, etudiantID } = req.query;

  try {
    // inscrit ?
    const [inscriptionRows] = await db.execute(
      'SELECT * FROM Inscriptions WHERE formationID = ? AND etudiantID = ?',
      [formationID, etudiantID]
    );
    const [attenteRows] = await db.execute(
      'SELECT * FROM Attentes WHERE formationID = ? AND etudiantID = ?',
      [formationID, etudiantID]
    );

    // formation
    const [formationRows] = await db.execute(
      'SELECT * FROM Formations WHERE id = ?',
      [formationID]
    );
    const [tags] = await db.execute('SELECT nom FROM Tags WHERE formationsID = ?', [formationID]);

    if (formationRows.length === 0) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    const formation = formationRows[0];

    // formateur
    const [formateurRows] = await db.execute(`
      SELECT 
      p.*,
      (SELECT COUNT(*) FROM Formations f WHERE f.profID = p.id) AS formations,
      (SELECT COUNT(*) 
      FROM Inscriptions i 
      JOIN Formations f ON f.id = i.formationID 
      WHERE f.profID = p.id) AS totalEtudiants
      FROM Professeurs p
      WHERE p.id = ?
    `, [formation.profID]);

    const formateur = formateurRows[0] || null;

    // etudiants
    const [etudiantsRows] = await db.execute(`
      SELECT e.*
      FROM Etudiants e
      JOIN Inscriptions i ON e.id = i.etudiantID
      WHERE i.formationID = ?
    `, [formationID]);

    // result
    const result = {
      formation: {
        ...formation,
        inscrit: inscriptionRows.length > 0 ? 'inscrit' : attenteRows.length > 0 ? 'enattente' : 'noninscrit'
      },
      tags,
      formateur,
      etudiants: etudiantsRows
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}