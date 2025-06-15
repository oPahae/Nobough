import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const [evenements] = await db.execute(`SELECT * FROM Evenements`);

    const formattedEvents = await Promise.all(
      evenements.map(async (event) => {
        const [depenses] = await db.execute(
          `SELECT * FROM Depenses WHERE evenementID = ?`,
          [event.id]
        );

        return {
          id: event.id,
          titre: event.titre,
          descr: event.descr,
          lieu: event.lieu,
          type: event.type,
          participants: event.participants,
          created_At: event.created_At,
          img: event.img ? `data:image/jpeg;base64,${Buffer.from(event.img).toString('base64')}` : null,
          depenses: depenses
        };
      })
    );

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}