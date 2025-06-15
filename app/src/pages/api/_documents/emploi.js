import db from '../_lib/connect';
import { jsPDF } from 'jspdf';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { etudiantID } = req.query;

  try {
    // Récupérer les informations de l'étudiant
    const [etudiant] = await db.execute(
      'SELECT * FROM Etudiants WHERE id = ?',
      [etudiantID]
    );

    if (etudiant.length === 0) {
      return res.status(404).json({ message: 'Etudiant non trouvé' });
    }

    // Récupérer les séances du professeur
    const [seances] = await db.execute(
      `SELECT s.jour, s.horaire, f.titre as formationTitre, f.salle
       FROM seances s, Formations f, Inscriptions i
       WHERE f.id = i.formationID
       AND f.id = s.formationID
       AND i.etudiantID = ?
       ORDER BY s.jour, s.horaire`,
      [etudiantID]
    );

    // Organiser les données
    const emploiDuTemps = {};
    const horaires = [
      "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
      "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
      "20:00", "21:00", "22:00"
    ];
    const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    // Initialiser l'emploi du temps
    horaires.forEach(horaire => {
      emploiDuTemps[horaire] = {};
      jours.forEach(jour => {
        emploiDuTemps[horaire][jour] = { titre: '', salle: '' };
      });
    });

    // Fonction pour convertir l'heure TIME en format d'affichage
    function formatTime(timeString) {
      const time = new Date(`1970-01-01T${timeString}Z`);
      return time.getUTCHours().toString().padStart(2, '0') + ':00';
    }

    // Remplir avec les séances
    seances.forEach(seance => {
      const horaireFormate = formatTime(seance.horaire);
      const jour = seance.jour;

      if (emploiDuTemps[horaireFormate] && emploiDuTemps[horaireFormate][jour]) {
        emploiDuTemps[horaireFormate][jour] = {
          titre: seance.formationTitre,
          salle: seance.salle || ''
        };
      }
    });

    // Créer le PDF avec jsPDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [290, 290]
    });

    // Configuration des couleurs
    const colors = {
      primary: [30, 27, 75], // Bleu foncé
      secondary: [88, 28, 135], // Violet
      accent: [251, 191, 36], // Amber
      text: [255, 255, 255], // Blanc
      lightBg: [255, 255, 255, 0.1], // Blanc transparent
      courseBg: [34, 197, 94, 0.3] // Vert transparent
    };

    // En-tête
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, 297, 60, 'F');

    // Titre principal
    doc.setTextColor(...colors.text);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Emploi du Temps', 148.5, 25, { align: 'center' });

    // Sous-titre Académie
    doc.setFontSize(18);
    doc.setTextColor(251, 191, 36); // Couleur ambre
    doc.text('Académie Nobough', 148.5, 35, { align: 'center' });

    // Informations etudiant
    doc.setFontSize(12);
    doc.setTextColor(...colors.text);
    doc.text(`Etudiant: ${etudiant[0].prenom} ${etudiant[0].nom}`, 148.5, 45, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Email: ${etudiant[0].email || 'Non renseigné'} | Tél: ${etudiant[0].tel || 'Non renseigné'} | CIN: ${etudiant[0].cin || 'Non renseigné'}`, 148.5, 52, { align: 'center' });

    // Tableau - Configuration pour le centrage
    const totalCols = 8; // 1 pour heure + 7 jours
    const cellWidth = 30; // Largeur réduite pour un meilleur centrage
    const cellHeight = 12;
    const headerHeight = 15;
    const tableWidth = totalCols * cellWidth;
    const startX = (297 - tableWidth) / 2; // Centrer horizontalement
    const startY = 70;

    // En-tête du tableau
    doc.setFillColor(88, 28, 135); // Violet
    doc.rect(startX, startY, cellWidth, headerHeight, 'F'); // Colonne Heure

    doc.setTextColor(...colors.text);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Heure', startX + cellWidth/2, startY + 10, { align: 'center' });

    // En-têtes des jours
    const joursAbrev = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    jours.forEach((jour, index) => {
      const x = startX + cellWidth * (index + 1);
      doc.setFillColor(49, 46, 129); // Bleu moyen
      doc.rect(x, startY, cellWidth, headerHeight, 'F');

      doc.setFontSize(9);
      doc.text(jour, x + cellWidth/2, startY + 7, { align: 'center' });
      doc.setFontSize(7);
    });

    // Lignes du tableau
    let currentY = startY + headerHeight;

    horaires.forEach((horaire, horaireIndex) => {
      // Colonne horaire
      doc.setFillColor(255, 255, 255, 0.1);
      doc.rect(startX, currentY, cellWidth, cellHeight, 'F');
      doc.setDrawColor(99, 102, 241); // Bordure indigo
      doc.rect(startX, currentY, cellWidth, cellHeight);

      doc.setTextColor(...colors.text);
      doc.setFont(undefined, 'bold');
      doc.setFontSize(9);
      const horaireAffiche = horaire.replace(':', 'h');
      doc.text(horaireAffiche, startX + cellWidth/2, currentY + 8, { align: 'center' });

      // Cellules des jours
      jours.forEach((jour, jourIndex) => {
        const x = startX + cellWidth * (jourIndex + 1);
        const cours = emploiDuTemps[horaire][jour];
        const hasCours = cours.titre !== '';

        // Couleur de fond selon s'il y a un cours
        if (hasCours) {
          doc.setFillColor(34, 197, 94, 0.3); // Vert transparent pour les cours
        } else {
          doc.setFillColor(255, 255, 255, 0.05); // Très légèrement blanc
        }

        doc.rect(x, currentY, cellWidth, cellHeight, 'F');
        doc.setDrawColor(99, 102, 241);
        doc.rect(x, currentY, cellWidth, cellHeight);

        // Contenu de la cellule
        if (hasCours) {
          doc.setTextColor(...colors.text);
          doc.setFont(undefined, 'bold');
          doc.setFontSize(7);

          // Titre du cours
          const maxWidth = cellWidth - 4;
          const splitTitle = doc.splitTextToSize(cours.titre, maxWidth);
          doc.text(splitTitle[0] || cours.titre, x + cellWidth/2, currentY + 5, { align: 'center' });

          // Salle si disponible
          if (cours.salle) {
            doc.setFont(undefined, 'normal');
            doc.setFontSize(6);
            doc.setTextColor(...colors.accent);
            doc.text(`Salle: ${cours.salle}`, x + cellWidth/2, currentY + 9, { align: 'center' });
          }
        }
      });

      currentY += cellHeight;
    });

    // Générer le PDF
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    // Envoyer le PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=emploi-du-temps-${etudiant[0].prenom}-${etudiant[0].nom}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Erreur lors de la génération de l\'emploi du temps:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
}