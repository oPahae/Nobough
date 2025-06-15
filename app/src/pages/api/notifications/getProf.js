import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { profID } = req.query

  try {
    const [notifications] = await db.execute(`SELECT * FROM NotificationsProf WHERE profID = ? ORDER BY created_At DESC`, [profID]);
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}