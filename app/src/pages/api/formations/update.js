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
    id,
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
      await connection.execute(
        'UPDATE Formations SET titre = ?, img = ?, descr = ?, prix = ?, genre = ?, type = ?, categorie = ?, duree = ?, salle = ?, profID = ? WHERE id = ?',
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
          formateur,
          id
        ]
      );

      await connection.execute('DELETE FROM Tags WHERE formationsID = ?', [id]);
      for (const tag of tags) {
        await connection.execute(
          'INSERT INTO Tags (nom, formationsID) VALUES (?, ?)',
          [tag, id]
        );
      }

      await connection.execute('DELETE FROM Seances WHERE formationID = ?', [id]);
      for (const seance of seances) {
        await connection.execute(
          'INSERT INTO Seances (jour, horaire, formationID) VALUES (?, ?, ?)',
          [seance.jour, seance.horaire, id]
        );
      }

      await connection.commit();

      res.status(200).json({ message: 'Formation modifiée avec succès' });
    } catch (error) {
      await connection.rollback();
      console.error('Erreur lors de la modification de la formation:', error);
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Erreur lors de l\'obtention de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}