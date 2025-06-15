import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { professeurID, ...professeurData } = req.body;

  try {
    if (!professeurID) {
      return res.status(400).json({ message: 'ID professeur manquant' });
    }

    const [result] = await db.execute(
      'UPDATE Professeurs SET nom = ?, prenom = ?, email = ?, tel = ?, cin = ?, birth = ?, bio = ?, specialites = ?, img = ? WHERE id = ?',
      [
        professeurData.nom,
        professeurData.prenom,
        professeurData.email,
        professeurData.tel,
        professeurData.cin,
        professeurData.birth,
        professeurData.bio,
        professeurData.specialites,
        professeurData.img || null,
        professeurID
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Professeur non trouvé' });
    }

    res.status(200).json({ message: 'Informations mises à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des informations:', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
}