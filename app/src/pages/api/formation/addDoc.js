import db from '../_lib/connect';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 
  }
});

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error('Erreur lors du téléchargement du fichier:', err);
        return res.status(400).json({ message: 'Erreur lors du téléchargement du fichier' });
      }

      const { titre, descr, formationID } = req.body;
      const file = req.file;

      if (!titre || !file || !formationID) {
        return res.status(400).json({ message: 'Tous les champs obligatoires ne sont pas remplis' });
      }

      const fileType = file.mimetype.split('/')[1] || 'autre';

      const [result] = await db.execute(
        'INSERT INTO Docs (titre, descr, type, taille, contenu, formationID) VALUES (?, ?, ?, ?, ?, ?)',
        [
          titre,
          descr || '',
          fileType,
          file.size,
          file.buffer,
          formationID
        ]
      );

      const [newDoc] = await db.execute(
        'SELECT * FROM Docs WHERE id = ?',
        [result.insertId]
      );

      res.status(201).json(newDoc[0]);
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du document:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}