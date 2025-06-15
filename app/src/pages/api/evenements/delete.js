import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    try {
      await db.query('DELETE FROM Evenements WHERE id = ?', [id]);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Failed to delete event' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}