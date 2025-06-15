import db from '../_lib/connect';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    const { etudiantID, year, month } = req.query;

    try {
        // Récupérer les informations de l'étudiant
        const [etudiant] = await db.execute(
            'SELECT * FROM etudiants WHERE id = ?',
            [etudiantID]
        );

        if (etudiant.length === 0) {
            return res.status(404).json({ message: 'Étudiant non trouvé' });
        }

        // Récupérer les paiements de l'étudiant pour l'année spécifiée
        const [paiements] = await db.execute(`
            SELECT p.*, e.nom, e.prenom, e.tel, e.email, e.cin
            FROM paiements p, etudiants e
            WHERE p.etudiantID = e.id
            AND p.etudiantID = ?
            AND YEAR(p.created_At) = ?
            AND MONTH(p.created_At) = ?
            AND p.status = 'paye'
            `, [etudiantID, year, month]
        );

        if (paiements.length === 0) {
            return res.status(404).json({ message: 'Paiement non trouvé' });
        }

        const paiementData = paiements[0];

        // Créer le PDF
        const pdfDoc = await PDFDocument.create();

        // Charger une police standard (évite les problèmes de caractères)
        const customFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Ajouter une page A4 en paysage (landscape)
        const page = pdfDoc.addPage([842, 842]); // A4 landscape
        const { width, height } = page.getSize();

        // Charger et insérer l'image de fond (attestation template)
        const attestationImagePath = path.join(process.cwd(), 'public', 'recu.png');
        const attestationImageBytes = fs.readFileSync(attestationImagePath);
        const attestationImage = await pdfDoc.embedPng(attestationImageBytes);

        // Dessiner l'image de fond pour couvrir toute la page
        page.drawImage(attestationImage, {
            x: 0,
            y: 0,
            width: width,
            height: height,
        });

        // 1. Nom et prénom de l'étudiant - centrée horizontalement, 48% verticalement
        const nomComplet = `${paiementData.nom} ${paiementData.prenom}`;
        const nomWidth = customFont.widthOfTextAtSize(nomComplet, 44);
        page.drawText(nomComplet, {
            x: (width - nomWidth) / 2,
            y: height * 0.52, // 30% du haut = 70% du bas
            size: 44,
            font: customFont,
            color: rgb(1, 0.84, 0) // Couleur or
        });

        // 2. Montant - 80% horizontalement, 55% verticalement
        const montant = paiementData.total + ' DH';
        const montantWidth = customFont.widthOfTextAtSize(nomComplet, 44);
        page.drawText(montant, {
            x: width * 0.8 - (montantWidth / 2),
            y: height * 0.45, // 45% du haut = 70% du bas
            size: 44,
            font: customFont,
            color: rgb(0, 0, 0) // Couleur or
        });

        // 2. Date de paiement - centrée horizontalement, 72% verticalement
        const datePaiement = new Date(paiementData.created_At).toLocaleDateString('Fr-fr');
        const datePaiementWidth = customFont.widthOfTextAtSize(nomComplet, 38);
        page.drawText(datePaiement, {
            x: (width - datePaiementWidth) / 2,
            y: height * 0.28, // 66% du haut = 34% du bas
            size: 38,
            font: customFont,
            color: rgb(0.1, 0.84, 0.1) // Couleur or
        });

        // 2. Informations de l'étudiant - centré horizontalement et 80% verticalement avec retours à la ligne
        const infosPaiement = [
            `${paiementData.tel || 'Non renseigne'}`,
            `${paiementData.email || 'Non renseigne'}`,
            `${paiementData.cin || 'Non renseigne'}`
        ];

        const startY = height * 0.12; // Centre vertical
        const lineHeight = 24;
        const totalTextHeight = infosPaiement.length * lineHeight;
        let currentY = startY + (totalTextHeight / 2);

        infosPaiement.forEach((info) => {
            const textWidth = customFont.widthOfTextAtSize(info, 20);
            page.drawText(info, {
                x: width * 0.3 - (textWidth / 2),
                y: currentY,
                size: 20,
                font: customFont,
                color: rgb(0, 0, 0) // Couleur vert foncé
            });
            currentY -= lineHeight;
        });

        // 4. Image timbre - 76% horizontalement et 86% verticalement
        try {
            const timbreImagePath = path.join(process.cwd(), 'public', 'timbre.png');
            const timbreImageBytes = fs.readFileSync(timbreImagePath);
            const timbreImage = await pdfDoc.embedPng(timbreImageBytes);

            const timbreSize = 80;
            page.drawImage(timbreImage, {
                x: width * 0.76 - (timbreSize / 2),
                y: height * 0.14 - (timbreSize / 2),
                width: timbreSize,
                height: timbreSize,
            });
        } catch (error) {
            console.error('Erreur lors du chargement de l\'image timbre:', error);
        }

        // 5. Image signature - 80% horizontalement et 86% verticalement
        try {
            const signatureImagePath = path.join(process.cwd(), 'public', 'signature.png');
            const signatureImageBytes = fs.readFileSync(signatureImagePath);
            const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

            const signatureWidth = 150;
            const signatureHeight = 80;
            page.drawImage(signatureImage, {
                x: width * 0.8 - (signatureWidth / 2),
                y: height * 0.14 - (signatureHeight / 2),
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