import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { formationID } = req.query;

  try {
    const [formations] = await db.execute(
      'SELECT * FROM Formations WHERE id = ?',
      [formationID]
    );
    if (formations.length === 0) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }
    const formation = formations[0];

    const [professeurs] = await db.execute(
      'SELECT * FROM Professeurs WHERE id = ?',
      [formation.profID]
    );

    const [tags] = await db.execute(
      'SELECT * FROM Tags WHERE formationsID = ?',
      [formationID]
    );

    const [seances] = await db.execute(
      'SELECT * FROM Seances WHERE formationID = ?',
      [formationID]
    );

    const [inscriptions] = await db.execute(
      'SELECT COUNT(*) as count FROM Inscriptions WHERE formationID = ?',
      [formationID]
    );

    const formattedFormation = {
      id: formation.id,
      titre: formation.titre,
      description: formation.description,
      img: formation.img,
      formateur: professeurs.length > 0 ? `${professeurs[0].prenom} ${professeurs[0].nom}` : 'Non attribué',
      duree: formation.duree,
      etudiants: inscriptions[0].count,
      prix: formation.prix,
      categorie: formation.categorie,
      type: formation.type,
      tags: tags.map(tag => tag.nom),
      genre: formation.genre,
      created_At: formation.created_At,
      salle: formation.salle,
      programme: seances.map(seance => ({
        jour: seance.jour,
        heure: seance.horaire,
        salle: formation.salle
      }))
    };

    res.status(200).json(formattedFormation);
  } catch (error) {
    console.error('Erreur lors de la récupération de la formation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}