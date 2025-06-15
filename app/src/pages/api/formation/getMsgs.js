import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { formationID } = req.query;

  try {
    const [messages] = await db.execute(
      'SELECT * FROM msgs WHERE formationID = ? ORDER BY created_At ASC',
      [formationID]
    );

    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      contenu: msg.contenu,
      emetteur: msg.emetteur,
      emetteurID: msg.emetteurID,
      img: msg.img ? atob(Buffer.from(msg.img).toString('base64')) : null,
      role: msg.role,
      created_At: msg.created_At
    }));

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}