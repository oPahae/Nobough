import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { profID } = req.query

  try {
    await db.execute(`UPDATE NotificationsProf SET vue = TRUE WHERE profID = ?`, [profID]);
    res.status(200).json({ message: "Succès" });
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}