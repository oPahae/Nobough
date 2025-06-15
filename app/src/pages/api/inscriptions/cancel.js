import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' })
  }
  const { etudiantID, formationID } = req.body
  try {
    await db.execute('DELETE FROM Attentes WHERE etudiantID = ? and formationID = ?', [etudiantID, formationID])
    res.status(201).json({ message: 'Demande d\'inscription annulée avec succès' })
  } catch (error) {
    console.error('Erreur: ', error);
    res.status(500).json({ message: 'Erreur serveur' })
  }
}