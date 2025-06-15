import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { etudiantID } = req.query;

  try {
    const [certificats] = await db.execute(
      `SELECT c.*, f.titre as formationTitre
       FROM certificats c
       JOIN formations f ON c.formationID = f.id
       WHERE c.etudiantID = ?`,
      [etudiantID]
    );

    const formattedCertificats = certificats.map(certificat => ({
      id: certificat.id,
      formationID: certificat.formationID,
      formationTitre: certificat.formationTitre,
      descr: certificat.descr,
      mention: certificat.mention,
      code: certificat.code,
      created_At: certificat.created_At
    }));

    res.status(200).json(formattedCertificats);
  } catch (error) {
    console.error('Erreur lors de la récupération des certificats:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}