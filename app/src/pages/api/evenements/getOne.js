import db from '../_lib/connect';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { id } = req.query;
        const [event] = await db.query('SELECT * FROM Evenements WHERE id = ?', [id]);

        if (event.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const [expenses] = await db.query('SELECT * FROM Depenses WHERE evenementID = ?', [id]);
        const eventWithExpenses = {
            ...event[0],
            img: event[0].img ? `data:image/jpeg;base64,${Buffer.from(event[0].img).toString('base64')}` : null,
            depenses: expenses
        };

        res.status(200).json(eventWithExpenses);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}