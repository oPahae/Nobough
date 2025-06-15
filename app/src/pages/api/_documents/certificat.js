import db from '../_lib/connect';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    const { certificatID } = req.query;

    try {
        // Récupérer le certificat
        const [certificats] = await db.execute(
            `SELECT c.*, e.prenom as etudiantPrenom, e.nom as etudiantNom, f.titre as formationTitre
                FROM certificats c
                JOIN etudiants e ON c.etudiantID = e.id
                JOIN formations f ON c.formationID = f.id
                WHERE c.id = ?`,
            [certificatID]
        );

        if (certificats.length === 0) {
            return res.status(404).json({ message: 'Certificat non trouvé' });
        }

        const certificatData = certificats[0];

        // Créer le PDF
        const pdfDoc = await PDFDocument.create();

        // Charger une police standard (évite les problèmes de caractères)
        const customFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Ajouter une page A4 en paysage (landscape)
        const page = pdfDoc.addPage([842, 595]); // A4 landscape
        const { width, height } = page.getSize();

        // Charger et insérer l'image de fond (attestation template)
        const attestationImagePath = path.join(process.cwd(), 'public', 'certificat.png');
        const attestationImageBytes = fs.readFileSync(attestationImagePath);
        const attestationImage = await pdfDoc.embedPng(attestationImageBytes);

        // Dessiner l'image de fond pour couvrir toute la page
        page.drawImage(attestationImage, {
            x: 0,
            y: 0,
            width: width,
            height: height,
        });

        // 1. Nom et prénom de l'étudiant - centrée horizontalement, 30% verticalement
        const nomComplet = `${certificatData.etudiantPrenom} ${certificatData.etudiantNom}`;
        const nomWidth = customFont.widthOfTextAtSize(nomComplet, 38);
        page.drawText(nomComplet, {
            x: (width - nomWidth) / 2,
            y: height * 0.7, // 30% du haut = 70% du bas
            size: 38,
            font: customFont,
            color: rgb(1, 0.84, 0) // Couleur or
        });

        // 1. Nom et prénom de l'étudiant - centrée horizontalement, 35.5% verticalement
        const formationTitre = certificatData.formationTitre;
        const formationTitreWidth = customFont.widthOfTextAtSize(formationTitre, 14);
        page.drawText(formationTitre, {
            x: (width - formationTitreWidth) / 2,
            y: height * 0.645, // 30% du haut = 70% du bas
            size: 14,
            font: customFont,
            color: rgb(1, 1, 1) // Couleur or
        });

        // 2. Informations de l'étudiant - centré horizontalement et 67% verticalement avec retours à la ligne
        const infosCertificat = [
            `${certificatData.created_At ? new Date(certificatData.created_At).toLocaleDateString('fr-FR') : 'Non renseigné'}`,
            `${certificatData.mention || 'Non renseigne'}`,
            `${certificatData.descr || 'Non renseigne'}`,
            `${certificatData.code || 'Non renseigne'}`
        ];

        const startY = height * 0.33; // Centre vertical
        const lineHeight = 16;
        const totalTextHeight = infosCertificat.length * lineHeight;
        let currentY = startY + (totalTextHeight / 2);

        infosCertificat.forEach((info) => {
            const textWidth = customFont.widthOfTextAtSize(info, 10);
            page.drawText(info, {
                x: (width - textWidth) / 2,
                y: currentY,
                size: 10,
                font: customFont,
                color: rgb(0, 0.5, 0) // Couleur vert foncé
            });
            currentY -= lineHeight;
        });

        // 4. Image timbre - 60% horizontalement et 82% verticalement
        try {
            const timbreImagePath = path.join(process.cwd(), 'public', 'timbre.png');
            const timbreImageBytes = fs.readFileSync(timbreImagePath);
            const timbreImage = await pdfDoc.embedPng(timbreImageBytes);

            const timbreSize = 60;
            page.drawImage(timbreImage, {
                x: width * 0.6 - (timbreSize / 2),
                y: height * 0.18 - (timbreSize / 2),
                width: timbreSize,
                height: timbreSize,
            });
        } catch (error) {
            console.error('Erreur lors du chargement de l\'image timbre:', error);
        }

        // 5. Image signature - 66% horizontalement et 82% verticalement
        try {
            const signatureImagePath = path.join(process.cwd(), 'public', 'signature.png');
            const signatureImageBytes = fs.readFileSync(signatureImagePath);
            const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

            const signatureWidth = 120;
            const signatureHeight = 60;
            page.drawImage(signatureImage, {
                x: width * 0.66 - (signatureWidth / 2),
                y: height * 0.18 - (signatureHeight / 2),
                width: signatureWidth,
                height: signatureHeight,
            });
        } catch (error) {
            console.error('Erreur lors du chargement de l\'image signature:', error);
        }

        // Générer le PDF
        const pdfBytes = await pdfDoc.save();

        // Envoyer le PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=attestation-inscription.pdf');
        res.send(Buffer.from(pdfBytes));

    } catch (error) {
        console.error('Erreur lors de la génération de l\'attestation:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}