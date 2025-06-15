import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { id, label, type, montant, descr, created_At } = req.body;

  try {
    if (!id || !label || !type || !montant || !created_At) {
      return res.status(400).json({ message: 'Tous les champs obligatoires ne sont pas remplis' });
    }

    await db.execute(
      'UPDATE Revenus SET label = ?, type = ?, montant = ?, descr = ?, created_At = ? WHERE id = ?',
      [label, type, montant, descr || null, created_At, id]
    );

    const [updatedRevenu] = await db.execute(
      'SELECT * FROM Revenus WHERE id = ?',
      [id]
    );

    res.status(200).json(updatedRevenu[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du revenu:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Ce revenu existe déjà' });
    }

    res.status(500).json({ message: 'Erreur serveur' });
  }
}