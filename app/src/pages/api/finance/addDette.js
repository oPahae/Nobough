import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { titre, montant, remarque, date, deadline, status } = req.body;

  try {
    if (!titre || !montant || !date || !deadline) {
      return res.status(400).json({ message: 'Tous les champs obligatoires ne sont pas remplis' });
    }

    const [result] = await db.execute(
      'INSERT INTO Dettes (label, montant, descr, created_At, deadline, status) VALUES (?, ?, ?, ?, ?, ?)',
      [titre, montant, remarque || null, date, deadline, status]
    );

    const [newDette] = await db.execute(
      'SELECT * FROM Dettes WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newDette[0]);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la dette:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Cette dette existe déjà' });
    }

    res.status(500).json({ message: 'Erreur serveur' });
  }
}