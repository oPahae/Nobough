import db from './connect';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    try {
        const [inscriptions] = await db.execute('SELECT i.*, f.montant FROM Inscription i, Formations f WHERE f.id = i.formationID');

        for (const inscription of inscriptions) {
            const { etudiantID, formationID, created_At, montant } = inscription;
            const dateInscriptionObj = new Date(created_At);
            const currentDate = new Date();

            for (let mois = 1; ; mois++) {
                const datePaiement = new Date(dateInscriptionObj);
                datePaiement.setMonth(dateInscriptionObj.getMonth() + mois);

                if (datePaiement > currentDate) {
                    break;
                }

                const [paiements] = await db.execute(
                    'SELECT * FROM Paiements WHERE etudiantID = ? AND formationID = ? AND created_At = ?',
                    [etudiantID, formationID, datePaiement]
                );

                if (paiements.length === 0) {
                    await db.execute(
                        'INSERT INTO Paiements (etudiantID, formationID, total, status, created_At) VALUES (?, ?, ?, "nonpaye", ?)',
                        [etudiantID, formationID, montant, datePaiement]
                    );
                }
            }
        }

        ////////////////////////////////////////////////////////////////////

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        await db.execute(
            'DELETE FROM msgs WHERE created_At < ?',
            [sevenDaysAgo]
        );

        res.status(200).json({ message: 'Vérification et insertion des paiements effectuées avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la vérification et de l\'insertion des paiements:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}