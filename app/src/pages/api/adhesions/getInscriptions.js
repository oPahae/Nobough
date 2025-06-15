import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM Utilisateurs WHERE valide = FALSE ORDER BY created_At DESC');

    const users = rows.map(user => {
      return {
        ...user,
        img: user.img ? `data:image/jpeg;base64,${Buffer.from(user.img).toString('base64')}` : null
      };
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des inscriptions:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}