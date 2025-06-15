import db from '../_lib/connect';
import ExcelJS from 'exceljs';

export default async function handler(req, res) {
  try {
    const [etudiants] = await db.query('SELECT * FROM Etudiants ORDER BY created_At');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Étudiants');

    // En-têtes de colonnes
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nom', key: 'nom', width: 32 },
      { header: 'Prénom', key: 'prenom', width: 32 },
      { header: 'Email', key: 'email', width: 32 },
      { header: 'Téléphone', key: 'tel', width: 15 },
      { header: 'CIN', key: 'cin', width: 20 },
      { header: 'Bio', key: 'bio', width: 50 },
      { header: 'Date de naissance', key: 'birth', width: 20 },
      { header: 'Rabais', key: 'rabais', width: 10 },
      { header: 'Créé le', key: 'created_At', width: 20 },
    ];

    // Données des étudiants
    etudiants.forEach(etudiant => {
      worksheet.addRow(etudiant);
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