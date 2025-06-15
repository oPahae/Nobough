export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

import db from '../_lib/connect';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { nom, prenom, email, tel, img, password, cin, birth, rabais } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO Etudiants (nom, prenom, email, tel, img, password, cin, birth, rabais) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nom, prenom, email, tel, img, hashedPassword, cin, birth, rabais]
    );

    res.status(200).json({ message: 'Student added successfully', id: result.insertId });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}