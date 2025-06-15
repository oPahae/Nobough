export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const {
    titre,
    descr,
    img,
    prix,
    formateur,
    duree,
    categorie,
    type,
    genre,
    salle,
    tags,
    seances
  } = req.body;

  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const [formationResult] = await connection.execute(
        'INSERT INTO Formations (titre, img, descr, prix, genre, type, categorie, duree, salle, profID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          titre,
          Buffer.from(img, 'base64'),
          descr,
          prix,
          genre,
          type,
          categorie,
          duree,
          salle,
          formateur
        ]
      );

      const formationId = formationResult.insertId;

      for (const tag of tags) {
        await connection.execute(
          'INSERT INTO Tags (nom, formationsID) VALUES (?, ?)',
          [tag, formationId]
        );
      }

      for (const seance of seances) {
        await connection.execute(
          'INSERT INTO Seances (jour, horaire, formationID) VALUES (?, ?, ?)',
          [seance.jour, seance.horaire, formationId]
        );
      }

      await connection.commit();

      res.status(201).json({ message: 'Formation ajoutée avec succès' });
    } catch (error) {
      await connection.rollback();
      console.error('Erreur lors de l\'ajout de la formation:', error);
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    } finally {
      // Libérer la connexion
      connection.release();
    }
  } catch (error) {
    console.error('Erreur lors de l\'obtention de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}
