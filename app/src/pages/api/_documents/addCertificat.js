import db from '../_lib/connect';

function generateCertificatCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    const { etudiantID, formationID, mention, descr } = req.body;

    try {
        if (!etudiantID || !formationID) {
            return res.status(400).json({ message: 'Tous les champs obligatoires ne sont pas remplis' });
        }

        const code = generateCertificatCode();
        const [result] = await db.execute(
            'INSERT INTO certificats (etudiantID, formationID, descr, mention, code) VALUES (?, ?, ?, ?, ?)',
            [etudiantID, formationID, descr || '', mention || '', code]
        );

        const [newCertificat] = await db.execute(
            'SELECT * FROM certificats WHERE id = ?',
            [result.insertId]
        );

        const type = "validation"
        const msg = `Vous avez un nouveau certificat, verifiez l'espace documents`
        await db.execute('INSERT INTO NotificationsEtud (etudiantID, type, msg) VALUES (?, ?, ?)', [etudiantID, type, msg]);

        res.status(201).json(newCertificat[0]);
    } catch (error) {
        console.error('Erreur lors de l\'ajout du certificat:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}