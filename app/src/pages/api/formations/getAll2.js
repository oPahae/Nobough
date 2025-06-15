import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { etudiantID } = req.query;

  try {
    const [formations] = await db.execute(`
      SELECT
        f.*,
        GROUP_CONCAT(t.nom SEPARATOR ',') as tags,
        p.id as formateur_id,
        p.nom as formateur_nom,
        p.prenom as formateur_prenom,
        (SELECT COUNT(*) FROM Inscriptions WHERE formationID = f.id) as etudiants_count
      FROM Formations f
      LEFT JOIN Tags t ON f.id = t.formationsID
      LEFT JOIN Professeurs p ON f.profID = p.id
      GROUP BY f.id
    `);

    const formationsWithInscriptions = await Promise.all(
      formations.map(async (formation) => {
        const [inscriptions] = await db.execute(
          'SELECT * FROM Inscriptions WHERE formationID = ? AND etudiantID = ?',
          [formation.id, etudiantID]
        );

        return {
          ...formation,
          tags: formation.tags ? formation.tags.split(',') : [],
          formateur: `${formation.formateur_prenom} ${formation.formateur_nom}`,
          etudiants: formation.etudiants_count || 0,
          inscrit: inscriptions.length > 0
        };
      })
    );

    res.status(200).json(formationsWithInscriptions);
  } catch (error) {
    console.error('Erreur lors de la récupération des formations:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}