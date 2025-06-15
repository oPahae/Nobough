import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { formationID } = req.query;

  try {
    const [docs] = await db.execute(
      'SELECT * FROM Docs WHERE formationID = ? ORDER BY created_At DESC',
      [formationID]
    );

    const formattedDocs = docs.map(doc => ({
      id: doc.id,
      titre: doc.titre,
      descr: doc.descr,
      type: doc.type,
      taille: doc.taille,
      contenu: doc.contenu,
      created_At: doc.created_At,
      formationID: doc.formationID
    }));

    res.status(200).json(formattedDocs);
  } catch (error) {
    console.error('Erreur lors de la récupération des documents:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}