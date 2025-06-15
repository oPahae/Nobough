import db from '../_lib/connect';
import ExcelJS from 'exceljs';

export default async function handler(req, res) {
  try {
    const [professeurs] = await db.query('SELECT * FROM Professeurs ORDER BY created_At');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Professeurs');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nom', key: 'nom', width: 32 },
      { header: 'Prénom', key: 'prenom', width: 32 },
      { header: 'Email', key: 'email', width: 32 },
      { header: 'Téléphone', key: 'tel', width: 15 },
      { header: 'CIN', key: 'cin', width: 20 },
      { header: 'Bio', key: 'bio', width: 50 },
      { header: 'Date de naissance', key: 'birth', width: 20 },
      { header: 'Salaire', key: 'salaire', width: 20 },
      { header: 'Nombre de Formations', key: 'nombreFormations', width: 20 },
      { header: 'Nombre d\'Étudiants', key: 'nombreEtudiants', width: 20 },
      { header: 'Créé le', key: 'created_At', width: 20 },
    ];

    for (const professeur of professeurs) {
      const [formations] = await db.query('SELECT COUNT(*) AS count FROM Formations WHERE profID = ?', [professeur.id]);
      const nombreFormations = formations[0].count;
      const [etudiants] = await db.query(`
        SELECT COUNT(*) AS count
        FROM Etudiants e, Inscriptions i, Formations f
        WHERE e.id = i.etudiantID
        AND f.id = i.formationID
        AND f.profID = ?
      `, [professeur.id]);
      const nombreEtudiants = etudiants[0].count;

      worksheet.addRow({
        ...professeur,
        nombreFormations,
        nombreEtudiants,
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=professeurs.xlsx');

    res.send(buffer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}