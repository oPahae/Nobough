import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { id } = req.query;

  try {
    const [formationRows] = await db.execute('SELECT * FROM Formations WHERE id = ?', [id]);
    if (formationRows.length === 0) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }
    const formation = formationRows[0];

    const [tags] = await db.execute('SELECT nom FROM Tags WHERE formationsID = ?', [id]);
    const [seances] = await db.execute('SELECT * FROM Seances WHERE formationID = ?', [id]);
    const [formateurRows] = await db.execute('SELECT nom, prenom FROM Professeurs WHERE id = ?', [formation.profID]);
    const formateur = formateurRows[0] || {};

    const result = {
      ...formation,
      tags: tags.map(tag => ({ nom: tag.nom })),
      seances: seances,
      formateur: `${formateur.prenom || ''} ${formateur.nom || ''}`
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Erreur lors de la récupération de la formation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}