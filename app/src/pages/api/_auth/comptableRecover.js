import db from '../_lib/connect';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    const { action, email, code, password } = req.body;

    try {
        if (action === 'getCode') {
            const [rows] = await db.execute('SELECT * FROM Comptables WHERE email = ?', [email]);
            if (rows.length === 0) {
                return res.status(400).json({ message: 'Ce compte n\'existe pas.' });
            }
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            await db.execute('INSERT INTO VerifCodes (email, code) VALUES (?, ?)', [email, verificationCode]);
            setTimeout(async () => {
                await db.execute('DELETE FROM VerifCodes WHERE email = ?', [email]);
            }, 5 * 60 * 1000);
            sendCode(email, verificationCode);
            return res.status(200).json({ message: 'Code envoyé avec succès' });
        }

        if (action === 'verifyCode') {
            const [rows] = await db.execute('SELECT * FROM VerifCodes WHERE email = ? AND code = ?', [email, code]);
            if (rows.length === 0) {
                return res.status(400).json({ message: 'Code invalide' });
            }
            return res.status(200).json({ message: 'Code vérifié avec succès' });
        }

        if (action === 'resetPassword') {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.execute('UPDATE Comptables SET password = ? WHERE email = ?', [hashedPassword, email]);
            return res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
        }

        return res.status(400).json({ message: 'Action invalide' });
    } catch (error) {
        console.error('Erreur lors de la récupération du mot de passe:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

async function sendCode(email, code) {
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
            subject: `Code de vérification ${code}`,
            text: `Votre code de vérification est: ${code}`,
            html: `
                    <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #4CAF50; text-align: center;">Code de vérification</h2>
                        <p style="font-size: 16px; line-height: 1.5; text-align: center;">
                            Bonjour,
                        </p>
                        <p style="font-size: 16px; line-height: 1.5; text-align: center;">
                            Utilisez ce code pour récupérer votre mot de passe :
                        </p>
                        <p style="font-size: 24px; font-weight: bold; color: #4CAF50; text-align: center;">
                            ${code}
                        </p>
                        <p style="font-size: 14px; line-height: 1.5; text-align: center; color: #777;">
                            Ne communiquez ce code à personne. Ce code est valable pour 5 minutes.
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
}