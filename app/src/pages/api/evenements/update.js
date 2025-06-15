import db from '../_lib/connect';
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id, titre, descr, lieu, type, participants, img, depenses } = req.body;

    await db.query(
      'UPDATE Evenements SET titre = ?, participants = ?, type = ?, lieu = ?, descr = ?, img = ? WHERE id = ?',
      [titre, participants, type, lieu, descr, img, id]
    );

    await db.query('DELETE FROM Depenses WHERE evenementID = ?', [id]);

    if (depenses && depenses.length > 0) {
      for (const depense of depenses) {
        await db.query(
          'INSERT INTO Depenses (label, descr, montant, evenementID) VALUES (?, ?, ?, ?)',
          [depense.label, depense.descr, depense.montant, id]
        );
      }
    }

    res.status(200).json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}