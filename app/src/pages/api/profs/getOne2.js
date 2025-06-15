import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { professeurID } = req.query;

  try {
    const [professeur] = await db.execute(
      'SELECT * FROM Professeurs WHERE id = ?',
      [professeurID]
    );

    if (professeur.length === 0) {
      return res.status(404).json({ message: 'Professeur non trouvé' });
    }

    const formattedProfesseur = {
      id: professeur[0].id,
      nom: professeur[0].nom,
      prenom: professeur[0].prenom,
      email: professeur[0].email,
      tel: professeur[0].tel,
      cin: professeur[0].cin,
      birth: formatDateForInput(new Date(professeur[0].birth).toLocaleDateString('FR-fr')),
      bio: professeur[0].bio,
      specialites: professeur[0].specialites,
      img: professeur[0].img ? `data:image/jpeg;base64,${Buffer.from(professeur[0].img).toString('base64')}` : null
    };

    res.status(200).json(formattedProfesseur);
  } catch (error) {
    console.error('Erreur lors de la récupération des informations:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

const formatDateForInput = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};