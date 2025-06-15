import db from '../_lib/connect';
import ExcelJS from 'exceljs';

export default async function handler(req, res) {
  try {
    const [formations] = await db.query(`
        SELECT f.titre, CONCAT(p.nom, ' ', p.prenom) AS prof, f.descr, CONCAT(f.prix, ' DHs'), f.genre, f.type, f.categorie, CONCAT(f.duree, ' mois'), f.salle
        FROM Formations f, Professeurs p
        WHERE p.id = f.profID
    `);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Formations');

    // En-têtes de colonnes
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Titre', key: 'titre', width: 32 },
      { header: 'Professeur', key: 'prof', width: 32 },
      { header: 'Description', key: 'descr', width: 32 },
      { header: 'Prix', key: 'prix', width: 32 },
      { header: 'Genre', key: 'genre', width: 15 },
      { header: 'Type', key: 'type', width: 20 },
      { header: 'Catégorie', key: 'categorie', width: 50 },
      { header: 'Durée', key: 'duree', width: 20 },
      { header: 'Salle', key: 'salle', width: 10 },
    ];

    // Données des étudiants
    formations.forEach(formation => {
      worksheet.addRow(formation);
    });

    // Générer
    const buffer = await workbook.xlsx.writeBuffer();

    // Configurer les en-têtes de la réponse pour télécharger le fichier
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=etudiants.xlsx');

    res.send(buffer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}