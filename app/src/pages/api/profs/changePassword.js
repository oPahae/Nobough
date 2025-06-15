import db from '../_lib/connect';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { professeurID, currentPassword, newPassword } = req.body;

  try {
    // Récupérer le mot de passe actuel du professeur
    const [professeur] = await db.execute(
      'SELECT password FROM Professeurs WHERE id = ?',
      [professeurID]
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
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    const [result] = await db.execute(
      'UPDATE Professeurs SET password = ? WHERE id = ?',
      [hashedPassword, professeurID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Professeur non trouvé' });
    }

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}