import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { formationID, etudiantID } = req.body;

  try {
    // inscrit ?
    const [existingInscriptions] = await db.execute(
      'SELECT * FROM Inscriptions WHERE formationID = ? AND etudiantID = ?',
      [formationID, etudiantID]
    );

    if (existingInscriptions.length > 0) {
      return res.status(400).json({ message: 'Vous êtes déjà inscrit à cette formation' });
    }

    // en attente ?
    const [existingAttentes] = await db.execute(
      'SELECT * FROM Attentes WHERE formationID = ? AND etudiantID = ?',
      [formationID, etudiantID]
    );

    if (existingAttentes.length > 0) {
      return res.status(400).json({ message: 'Vous êtes déjà en attente pour cette formation' });
    }

    // Ajouter
    await db.execute(
      'INSERT INTO Attentes (formationID, etudiantID) VALUES (?, ?)',
      [formationID, etudiantID]
    );

    res.status(201).json({ message: 'Demande d\'inscription enregistrée avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout à la liste d\'attente:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Vous êtes déjà en attente pour cette formation' });
    }

    res.status(500).json({ message: 'Erreur serveur' });
  }
}