import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const [revenus] = await db.execute('SELECT * FROM Revenus ORDER BY created_At DESC');
    const [depenses] = await db.execute('SELECT * FROM Depenses ORDER BY created_At DESC');
    const [dettes] = await db.execute('SELECT * FROM Dettes ORDER BY deadline ASC');

    const [professeurs] = await db.query('SELECT id, created_At, salaire FROM Professeurs');
    let totalNonPaye = 0;

    for (const professeur of professeurs) {
      const { id, created_At, salaire } = professeur;
      const dateDebut = new Date(created_At);
      dateDebut.setMonth(dateDebut.getMonth() + 1);
      const dateFin = new Date();

      let nombreDeMois = (dateFin.getFullYear() - dateDebut.getFullYear()) * 12;
      nombreDeMois += dateFin.getMonth() - dateDebut.getMonth();
      nombreDeMois += dateFin.getDate() >= dateDebut.getDate() ? 0 : -1;

      const [moisPayes] = await db.query(
        'SELECT DISTINCT YEAR(datePaiement) as year, MONTH(datePaiement) as month FROM Salaires WHERE profID = ?',
        [id]
      );

      const moisPayesSet = new Set(moisPayes.map(m => `${m.year}-${m.month}`));
      let moisNonPayes = 0;

      for (let date = new Date(dateDebut); date <= dateFin; date.setMonth(date.getMonth() + 1)) {
        const mois = `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (!moisPayesSet.has(mois)) {
          moisNonPayes++;
        }
      }

      totalNonPaye += moisNonPayes * salaire;
    }

    res.status(200).json({
      revenus: revenus,
      depenses: depenses,
      dettes: dettes,
      totalNonPaye: totalNonPaye,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}