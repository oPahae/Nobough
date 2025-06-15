import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { etudiantID, ...etudiantData } = req.body;

  try {
    if (!etudiantID) {
      return res.status(400).json({ message: 'ID étudiant manquant' });
    }

    const [result] = await db.execute(
      'UPDATE etudiants SET nom = ?, prenom = ?, email = ?, tel = ?, cin = ?, birth = ?, bio = ?, img = ? WHERE id = ?',
      [
        etudiantData.nom,
        etudiantData.prenom,
        etudiantData.email,
        etudiantData.tel,
        etudiantData.cin,
        etudiantData.dateNaissance,
        etudiantData.bio,
        etudiantData.img || null,
        etudiantID
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }

    res.status(200).json({ message: 'Informations mises à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des informations:', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
}