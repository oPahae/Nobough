import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const [professeurs] = await db.execute('SELECT * FROM Professeurs');

    const profs = await Promise.all(professeurs.map(async (prof) => {
      const [[{ count: formationsCount }]] = await db.execute(
        'SELECT COUNT(*) as count FROM Formations WHERE profID = ?',
        [prof.id]
      );

      const [[{ count: etudiantsCount }]] = await db.execute(`
        SELECT COUNT(DISTINCT etudiantID) as count
        FROM Inscriptions
        WHERE formationID IN (SELECT id FROM Formations WHERE profID = ?)
      `, [prof.id]);

      return {
        ...prof,
        formationsCount,
        etudiantsCount
      };
    }));

    res.status(200).json(profs);
  } catch (error) {
    console.error('Erreur lors de la récupération des professeurs:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}