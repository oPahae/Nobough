import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { profID, date, isPaid } = req.body;
  console.log(profID)
  console.log(date)
  console.log(isPaid)

  try {
    if (!profID || !date) {
      return res.status(400).json({ message: 'Données manquantes' });
    }

    if(isPaid == false)
      await db.execute('INSERT INTO Salaires (profID, datePaiement) VALUES (?, ?)', [profID, date]);

    if(isPaid == true)
      await db.execute('DELETE FROM Salaires WHERE profID = ? AND datePaiement = ?', [profID, date]);

    res.status(200).json({ message: 'Statut de paiement mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du paiement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}