import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { formationID } = req.query;

  try {
    const [inscriptions] = await db.execute(`
      SELECT e.*, i.created_At as dateInscr
      FROM Etudiants e, Inscriptions i
      WHERE e.id = i.etudiantID
      AND i.formationID = ?
    `, [formationID]);

    const formattedEtudiants = inscriptions.map(etudiant => ({
      id: etudiant.id,
      img: etudiant.img,
      nom: etudiant.nom,
      prenom: etudiant.prenom,
      tel: etudiant.tel,
      email: etudiant.email,
      birth: etudiant.birth,
      bio: etudiant.bio,
      genre: etudiant.genre,
      dateInscr: etudiant.dateInscr
    }));

    res.status(200).json(formattedEtudiants);
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}