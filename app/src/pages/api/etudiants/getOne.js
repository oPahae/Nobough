import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { etudiantID } = req.query;

  try {
    const [etudiant] = await db.execute(
      'SELECT * FROM etudiants WHERE id = ?',
      [etudiantID]
    );

    if (etudiant.length === 0) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }

    const formattedEtudiant = {
      id: etudiant[0].id,
      nom: etudiant[0].nom,
      prenom: etudiant[0].prenom,
      email: etudiant[0].email,
      tel: etudiant[0].tel,
      cin: etudiant[0].cin,
      dateNaissance: etudiant[0].birth,
      bio: etudiant[0].bio,
      img: etudiant[0].img || null,
      rabais: etudiant[0].rabais
    };

    res.status(200).json(formattedEtudiant);
  } catch (error) {
    console.error('Erreur lors de la récupération des informations:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}