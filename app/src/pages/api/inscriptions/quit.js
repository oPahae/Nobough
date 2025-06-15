import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' })
  }
  const { etudiantID, formationID } = req.body
  console.log(etudiantID)
  console.log(formationID)
  try {
    await db.execute('DELETE FROM Inscriptions WHERE etudiantID = ? AND formationID = ?', [etudiantID, formationID])

    const [formation] = await db.execute('SELECT * FROM Formations WHERE id = ?', [formationID])
    const [etudiant] = await db.execute('SELECT * FROM Etudiants WHERE id = ?', [etudiantID])
    const [prof] = await db.execute(`
      SELECT p.*
      FROM Professeurs p, Formations f
      WHERE p.id = f.profID
      AND f.id = ?
    `, [formationID])

    console.log(formation)
    console.log(etudiant)
    console.log(prof)

    await db.execute('INSERT INTO NotificationsProf (profID, type, msg) VALUES (?, ?, ?)',
      [prof[0].id, 'abandon', `${etudiant[0].nom} ${etudiant[0].prenom} a quitté la formation <${formation[0].titre}>`])

    res.status(201).json({ message: 'Demande d\'inscription annulée avec succès' })
  } catch (error) {
    console.error('Erreur: ', error);
    res.status(500).json({ message: 'Erreur serveur' })
  }
}