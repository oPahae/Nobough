export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

import db from '../_lib/connect';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    const { prenom, nom, dateNaissance, cin, email, tel, bio, image, password, captcha } = req.body;
    if (!captcha) return res.status(400).json({ message: "CAPTCHA requis." });

    const secretKey = process.env.CAPTCHA_SECRET;
    const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`,
        { method: "POST" }
    );
    const data = await response.json();

    if (!data.success) {
        return res.status(400).json({ message: "Échec CAPTCHA" });
    }

    try {
        // Email existe ?
        const [rows1] = await db.execute('SELECT * FROM Utilisateurs WHERE email = ?', [email]);
        if (rows1.length > 0) {
            return res.status(400).json({ message: 'Compte déjà inscrit' });
        }
        const [rows2] = await db.execute('SELECT * FROM Utilisateurs WHERE email = ?', [email]);
        if (rows2.length > 0) {
            return res.status(400).json({ message: 'Compte déjà inscrit' });
        }

        // Hash pass
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert
        await db.execute(
            'INSERT INTO Utilisateurs (prenom, nom, birth, cin, email, tel, bio, img, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [prenom, nom, dateNaissance, cin, email, tel, bio, image, hashedPassword]
        );

        return res.status(201).json({ message: 'Inscription réussie !' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error });
    }
}