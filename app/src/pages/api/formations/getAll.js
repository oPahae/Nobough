import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    // formations + profs
    const [formations] = await db.execute(`
      SELECT f.*, p.nom as formateur_nom, p.prenom as formateur_prenom,
      (SELECT COUNT(*) FROM Inscriptions WHERE formationID = f.id) as etudiants_count
      FROM Formations f
      LEFT JOIN Professeurs p ON f.profID = p.id
    `);

    // tags
    const formationsWithTags = await Promise.all(formations.map(async (formation) => {
      const [tags] = await db.execute('SELECT nom FROM Tags WHERE formationsID = ?', [formation.id]);
      return {
        ...formation,
        etudiants: formation.etudiants_count,
        tags: tags.map(tag => tag.nom),
        formateur: `${formation.formateur_prenom} ${formation.formateur_nom}`
      };
    }));

    // séances
    const formationsWithSeances = await Promise.all(formationsWithTags.map(async (formation) => {
      const [seances] = await db.execute('SELECT * FROM Seances WHERE formationID = ?', [formation.id]);
      return {
        ...formation,
        seances: seances
      };
    }));

    res.status(200).json(formationsWithSeances);
  } catch (error) {
    console.error('Erreur lors de la récupération des formations:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}