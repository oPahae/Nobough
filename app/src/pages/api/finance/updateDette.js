import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { id, label, montant, descr, created_At, deadline, status } = req.body;

  try {
    if (!id || !label || !montant || !created_At || !deadline || !status) {
      return res.status(400).json({ message: 'Tous les champs obligatoires ne sont pas remplis' });
    }

    await db.execute(
      'UPDATE Dettes SET label = ?, montant = ?, descr = ?, created_At = ?, deadline = ?, status = ? WHERE id = ?',
      [label, montant, descr || null, created_At, deadline, status, id]
    );

    const [updatedDette] = await db.execute(
      'SELECT * FROM Dettes WHERE id = ?',
      [id]
    );

    res.status(200).json(updatedDette[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la dette:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Cette dette existe déjà' });
    }

    res.status(500).json({ message: 'Erreur serveur' });
  }
}