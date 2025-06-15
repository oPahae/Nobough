import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { id } = req.body;

  try {
    // get user
    const [rows] = await db.execute('SELECT u.* FROM Frais f, Utilisateurs u WHERE f.userID = u.id AND f.id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    const user = rows[0];

    // user -> etudiant
    await db.execute(
      'INSERT INTO Etudiants (nom, prenom, email, tel, img, password, cin, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [user.nom, user.prenom, user.email, user.tel, user.img, user.password, user.cin, user.bio]
    );

    // supprimer
    await db.execute('DELETE FROM Frais WHERE id = ?', [id]);
    await db.execute('DELETE FROM Utilisateurs WHERE id = ?', [user.id]);

    res.status(200).json({ message: 'Paiement validé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la validation du paiement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}