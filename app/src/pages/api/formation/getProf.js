import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { formationID } = req.query;

  try {
    const [formations] = await db.execute(
      'SELECT profID FROM Formations WHERE id = ?',
      [formationID]
    );

    if (formations.length === 0) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    const profID = formations[0].profID;

    const [professeurs] = await db.execute(
      'SELECT * FROM Professeurs WHERE id = ?',
      [profID]
    );

    if (professeurs.length === 0) {
      return res.status(404).json({ message: 'Formateur non trouvé' });
    }

    const formateur = professeurs[0];

    const [formationsCount] = await db.execute(
      'SELECT COUNT(*) as count FROM Formations WHERE profID = ?',
      [profID]
    );

    const [etudiantsCount] = await db.execute(`
      SELECT COUNT(DISTINCT etudiantID) as count
      FROM Inscriptions
      WHERE formationID IN (SELECT id FROM Formations WHERE profID = ?)
    `, [profID]);

    const formattedFormateur = {
      id: formateur.id,
      img: formateur.img,
      nom: formateur.nom,
      prenom: formateur.prenom,
      tel: formateur.tel,
      email: formateur.email,
      birth: formateur.birth,
      bio: formateur.bio,
      specialites: formateur.specialites,
      formations: formationsCount[0].count,
      totalEtudiants: etudiantsCount[0].count
    };

    res.status(200).json(formattedFormateur);
  } catch (error) {
    console.error('Erreur lors de la récupération du formateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}