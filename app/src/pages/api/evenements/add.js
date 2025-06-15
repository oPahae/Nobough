export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { titre, descr, lieu, type, participants, img, depenses } = req.body;
    console.log(depenses.length)

    const [eventResult] = await db.query(
      'INSERT INTO Evenements (titre, participants, type, lieu, descr, img) VALUES (?, ?, ?, ?, ?, ?)',
      [titre, participants, type, lieu, descr, img]
    );

    const eventId = eventResult.insertId;
    console.log(eventId)

    if (depenses && depenses.length > 0) {
      for (const depense of depenses) {
        await db.query(
          'INSERT INTO Depenses (label, descr, montant, evenementID, type) VALUES (?, ?, ?, ?, "evenement")',
          [depense.label, depense.descr, depense.montant, eventId]
        );
      }
    }

    res.status(200).json({ message: 'Event added successfully' });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}