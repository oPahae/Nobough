import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { label, type, montant, descr, created_At } = req.body;

  try {
    if (!label || !type || !montant || !created_At) {
      return res.status(400).json({ message: 'Tous les champs obligatoires ne sont pas remplis' });
    }

    const [result] = await db.execute(
      'INSERT INTO Depenses (label, type, montant, descr, created_At) VALUES (?, ?, ?, ?, ?)',
      [label, type, montant, descr || null, created_At]
    );

    const [newDepense] = await db.execute(
      'SELECT * FROM Depenses WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newDepense[0]);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la dépense:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Cette dépense existe déjà' });
    }

    res.status(500).json({ message: 'Erreur serveur' });
  }
}