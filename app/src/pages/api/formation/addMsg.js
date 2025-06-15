import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { contenu, role, formationID, sessionID } = req.body;

  try {
    if (!contenu || !formationID || !sessionID) {
      return res.status(400).json({ message: 'Tous les champs obligatoires ne sont pas remplis' });
    }

    const [emetteur] = await db.execute(
      `SELECT id, prenom, nom, img FROM ${role === 'etudiant' ? 'Etudiants' : 'Professeurs'} WHERE id = ?`,
      [sessionID]
    );

    if (emetteur.length === 0) {
      return res.status(404).json({ message: 'Émetteur non trouvé' });
    }

    const emetteurInfo = emetteur[0];
    console.log(emetteur[0].img)

    const [result] = await db.execute(
      'INSERT INTO msgs (contenu, emetteur, emetteurID, img, role, formationID) VALUES (?, ?, ?, ?, ?, ?)',
      [
        contenu,
        `${emetteurInfo.prenom} ${emetteurInfo.nom}`,
        sessionID,
        emetteurInfo.img,
        role,
        formationID
      ]
    );

    const [newMsg] = await db.execute(
      'SELECT * FROM msgs WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newMsg[0]);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du message:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}