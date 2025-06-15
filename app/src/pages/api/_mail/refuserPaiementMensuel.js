import nodemailer from 'nodemailer';
import db from '../_lib/connect';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, raison } = req.body;
        if (!email || !raison) return res.status(400).json({ message: 'Infos Manquantes' });

        try {
            const [etudiant] = await db.execute('SELECT * FROM Etudiants WHERE email=?', [email]);
            const type = "refus"
            const msg = `Votre paiement mensuel a été refusé: ${raison} `

            await db.execute('INSERT INTO NotificationsEtud (etudiantID, type, msg) VALUES (?, ?, ?)', [etudiant[0].id, type, msg]);
            res.status(201).json({ message: 'Notification envoyée' });
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la notification:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.BREVO_SMTP,
            port: 587,
            auth: {
                user: process.env.BREVO_USER,
                pass: process.env.BREVO_API,
            },
        });

        try {
            await transporter.verify();
            await transporter.sendMail({
                from: process.env.BREVO_SENDER,
                to: email,
                subject: 'Inscription Validée',
                text: `Votre paiement est incorrecte`,
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #4CAF50; text-align: center;">Paiement refusé</h2>
                        <p style="font-size: 16px; line-height: 1.5; text-align: center;">
                            Bonjour,
                        </p>
                        <p style="font-size: 16px; line-height: 1.5; text-align: center;">
                            On vous informe que votre paiement est non valide pour cette raison :
                        </p>
                        <p style="font-size: 24px; font-weight: bold; color: #4CAF50; text-align: center;">
                            ${raison}
                        </p>
                        <p style="font-size: 14px; line-height: 1.5; text-align: center; color: #777;">
                            Veuillez corriger vos données et réssayer de nouveau.
                        </p>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        <p style="font-size: 12px; text-align: center; color: #aaa;">
                            Cet email a été envoyé automatiquement, ce n'est pas la peine d'y répendre.
                        </p>
                    </div>
                `
            });

            return res.status(200).json({ message: 'Email code sent!' });
        } catch (message) {
            console.log('Erreur lors de l\'envoi de l\'email :', message);
            return res.status(500).json({ message: 'Failed to send email', details: message.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}