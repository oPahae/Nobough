import db from '../_lib/connect';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    const { profID } = req.query;

    try {
        // Récupérer les informations de l'étudiant
        const [professeur] = await db.execute(
            'SELECT * FROM professeurs WHERE id = ?',
            [profID]
        );

        if (professeur.length === 0) {
            return res.status(404).json({ message: 'Professeur non trouvé' });
        }

        const professeurData = professeur[0];

        // Créer le PDF
        const pdfDoc = await PDFDocument.create();

        // Charger une police standard (évite les problèmes de caractères)
        const customFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Ajouter une page A4 en paysage (landscape)
        const page = pdfDoc.addPage([842, 595]); // A4 landscape
        const { width, height } = page.getSize();

        // Charger et insérer l'image de fond (attestation template)
        const attestationImagePath = path.join(process.cwd(), 'public', 'attestationProf.png');
        const attestationImageBytes = fs.readFileSync(attestationImagePath);
        const attestationImage = await pdfDoc.embedPng(attestationImageBytes);

        // Dessiner l'image de fond pour couvrir toute la page
        page.drawImage(attestationImage, {
            x: 0,
            y: 0,
            width: width,
            height: height,
        });

        // 1. Nom et prénom de l'étudiant - centrée horizontalement, 50% verticalement
        const nomComplet = `${professeurData.nom} ${professeurData.prenom}`;
        const nomWidth = customFont.widthOfTextAtSize(nomComplet, 38);
        page.drawText(nomComplet, {
            x: (width - nomWidth) / 2,
            y: height * 0.5, // 50% du haut = 50% du bas
            size: 38,
            font: customFont,
            color: rgb(1, 0.84, 0) // Couleur or
        });

        // 4. Image timbre - 70% horizontalement et 88% verticalement
        try {
            const timbreImagePath = path.join(process.cwd(), 'public', 'timbre.png');
            const timbreImageBytes = fs.readFileSync(timbreImagePath);
            const timbreImage = await pdfDoc.embedPng(timbreImageBytes);

            const timbreSize = 60;
            page.drawImage(timbreImage, {
                x: width * 0.7 - (timbreSize / 2),
                y: height * 0.12 - (timbreSize / 2),
                width: timbreSize,
                height: timbreSize,
            });
        } catch (error) {
            console.error('Erreur lors du chargement de l\'image timbre:', error);
        }

        // 5. Image signature - 74% horizontalement et 84% verticalement
        try {
            const signatureImagePath = path.join(process.cwd(), 'public', 'signature.png');
            const signatureImageBytes = fs.readFileSync(signatureImagePath);
            const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

            const signatureWidth = 120;
            const signatureHeight = 60;
            page.drawImage(signatureImage, {
                x: width * 0.74 - (signatureWidth / 2),
                y: height * 0.16 - (signatureHeight / 2),
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