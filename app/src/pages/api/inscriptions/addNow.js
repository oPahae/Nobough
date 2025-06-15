import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { formationID, etudiantID } = req.body;

  try {
    const [deja] = await db.execute(
      'SELECT * FROM Inscriptions WHERE formationID = ? AND etudiantID = ?',
      [formationID, etudiantID]
    );

    if(deja.length > 0) {
      res.status(404).json({ message: 'Déja inscrit' });
    }

    await db.execute(
      'INSERT INTO Inscriptions (formationID, etudiantID) VALUES (?, ?)',
      [formationID, etudiantID]
    );

    res.status(201).json({ message: 'Inscription enregistrée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}