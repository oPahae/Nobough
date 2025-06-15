import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const [etudiants] = await db.execute(`
      SELECT
        e.*,
        (SELECT COUNT(*) FROM Paiements WHERE etudiantID = e.id AND status = "nonpaye") as moisNonPayes
      FROM Etudiants e
      ORDER BY e.nom, e.prenom
    `);

    const formattedEtudiants = etudiants.map(etudiant => ({
      ...etudiant,
      birth: etudiant.birth ? new Date(etudiant.birth).toISOString().split('T')[0] : null,
      img: etudiant.img ? `data:image/jpeg;base64,${Buffer.from(etudiant.img).toString('base64')}` : null
    }));

    res.status(200).json(formattedEtudiants);
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}