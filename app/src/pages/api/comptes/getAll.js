import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const [comptes] = await db.execute(
      'SELECT * FROM (SELECT id, email, "Secrétaire" as role, created_At FROM Secretaires UNION ALL SELECT id, email, "Comptable" as role, created_At FROM Comptables) AS combined'
    );

    res.status(200).json(comptes);
  } catch (error) {
    console.error('Erreur lors de la récupération des comptes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}