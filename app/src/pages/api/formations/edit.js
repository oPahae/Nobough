import db from '../_lib/connect';

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    const { id, titre, description, img, formateur, prix, categorie, type, genre, salle, seances } = req.body;

    try {
        await db.execute('UPDATE Formations SET titre = ?, description = ?, img = ?, prix = ?, genre = ?, type = ?, categorie = ?, salle = ? WHERE id = ?',
            [titre, description, img, prix, genre, type, categorie, salle, id]);

        if (seances && seances.length > 0) {
            await db.execute('DELETE FROM Seances WHERE formationID = ?', [id]);
            const values = seances.map(seance => [id, seance.jour, seance.horaire]);
            await db.execute('INSERT INTO Seances (formationID, jour, horaire) VALUES ?', [values]);
        }

        res.status(200).json({ id, titre, description, img, formateur, prix, categorie, type, genre, salle, seances });
    } catch (error) {
        console.error('Erreur lors de la modification de la formation:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}