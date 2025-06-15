import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { id } = req.body;

  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // status = paye
      await connection.execute(
        'UPDATE Paiements SET status = ?, datePaiement = ? WHERE id = ?',
        ['paye', new Date().toISOString().split('T')[0], id]
      );

      // get les infos
      const [paiement] = await connection.execute(
        'SELECT p.*, e.nom, e.prenom FROM Paiements p JOIN Etudiants e ON p.etudiantID = e.id WHERE p.id = ?',
        [id]
      );

      if (paiement.length === 0) {
        throw new Error('Paiement non trouvé');
      }

      const paiementInfo = paiement[0];

      // ajouter revenu
      await connection.execute(
        'INSERT INTO Revenus (label, type, descr, montant, created_At) VALUES (?, ?, ?, ?, ?)',
        [
          `Paiement de ${paiementInfo.prenom} ${paiementInfo.nom}`,
          'Paiement mensuel',
          `Paiement pour le mois de ${new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}`,
          paiementInfo.total,
          new Date().toISOString().split('T')[0]
        ]
      );

      await connection.commit();

      res.status(200).json({ message: 'Paiement validé avec succès' });
    } catch (error) {
      await connection.rollback();
      console.error('Erreur lors de la validation du paiement:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Erreur lors de l\'obtention de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}