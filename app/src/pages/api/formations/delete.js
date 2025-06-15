import db from '../_lib/connect'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' })
  }

  const { id } = req.body

  try {
    await db.execute('DELETE FROM Tags WHERE formationsID = ?', [id])
    await db.execute('DELETE FROM Seances WHERE formationID = ?', [id])
    await db.execute('DELETE FROM Formations WHERE id = ?', [id])
    res.status(200).json({ message: 'Formation supprimée avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression de la formation:', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}
