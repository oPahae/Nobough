import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { id } = req.body;

  try {
    // get user
    const [rows] = await db.execute('SELECT e.*, a.formationID FROM Attentes a, Etudiants e WHERE a.etudiantID = e.id AND a.id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    const etudiant = rows[0];

    // etudiant -> formation
    await db.execute(
      'INSERT INTO Inscriptions (etudiantID, formationID) VALUES (?, ?)',
      [etudiant.id, etudiant.formationID]
    );

    // supprimer
    await db.execute('DELETE FROM Attentes WHERE id = ?', [id]);

    res.status(200).json({ message: 'Paiement validé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la validation du paiement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}