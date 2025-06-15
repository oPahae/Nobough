import db from '../_lib/connect'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { id, nom, prenom, email, tel, cin, bio, specialites, salaire, img } = req.body;

  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      let updateFields = [
        nom,
        prenom,
        email,
        tel,
        img,
        cin,
        bio,
        specialites,
        salaire,
        id
      ];

      await connection.execute(
        'UPDATE Professeurs SET nom = ?, prenom = ?, email = ?, tel = ?, img = ?, cin = ?, bio = ?, specialites = ?, salaire = ? WHERE id = ?',
        [nom, prenom, email, tel, img, cin, bio, specialites, salaire, id]
      );
      await connection.commit();

      res.status(200).json({ message: 'Professeur modifié avec succès' });
    } catch (error) {
      await connection.rollback();

      console.error('Erreur lors de la modification du professeur:', error);

      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('email')) {
          return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }
        if (error.message.includes('cin')) {
          return res.status(400).json({ message: 'Ce CIN est déjà utilisé' });
        }
      }

      res.status(500).json({ message: 'Erreur serveur' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Erreur lors de l\'obtention de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}