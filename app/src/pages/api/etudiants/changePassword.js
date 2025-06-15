import db from '../_lib/connect';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { profID, currentPassword, newPassword } = req.body;

  try {
    // Vérifier les champs obligatoires
    if (!profID || !currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Tous les champs obligatoires ne sont pas remplis' });
    }

    // Récupérer l'étudiant
    const [professeur] = await db.execute(
      'SELECT * FROM professeurs WHERE id = ?',
      [profID]
    );

    if (professeur.length === 0) {
      return res.status(404).json({ message: 'Professeur non trouvé' });
    }

    // Vérifier le mot de passe actuel
    const isMatch = await bcrypt.compare(currentPassword, professeur[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
    }

    // Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Mettre à jour le mot de passe
    const [result] = await db.execute(
      'UPDATE professeurs SET password = ? WHERE id = ?',
      [hashedPassword, profID]
    );

    // Vérifier si la mise à jour a réussi
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}