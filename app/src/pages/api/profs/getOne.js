import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { id } = req.query;

  try {
    const [professeurRows] = await db.execute('SELECT * FROM Professeurs WHERE id = ?', [id]);
    if (professeurRows.length === 0) {
      return res.status(404).json({ message: 'Professeur non trouvé' });
    }

    const professeur = professeurRows[0];
    const formattedProfesseur = {
      ...professeur,
      created_At: professeur.created_At ? new Date(professeur.created_At).toISOString().split('T')[0] : null
    };

    if (professeur.img) {
      try {
        let imageData;
        if (professeur.img.data) {
          imageData = professeur.img.data;
        } else if (Buffer.isBuffer(professeur.img)) {
          imageData = professeur.img;
        }

        if (imageData) {
          const base64Image = Buffer.from(imageData).toString('base64');
          formattedProfesseur.img = `data:image/jpeg;base64,${base64Image}`;
        }
      } catch (error) {
        console.error('Erreur lors du traitement de l\'image:', error);
        formattedProfesseur.img = "/user.jpg";
      }
    } else {
      formattedProfesseur.img = "/user.jpg";
    }

    res.status(200).json(formattedProfesseur);
  } catch (error) {
    console.error('Erreur lors de la récupération du professeur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}