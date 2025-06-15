// import db from '../_lib/connect';

// export default async function handler(req, res) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ message: 'Méthode non autorisée' });
//   }

//   try {
//     const [professeurs] = await db.execute('SELECT * FROM Professeurs');

//     const result = await Promise.all(
//       professeurs.map(async (prof) => {
//         const [salaires] = await db.execute(
//           `SELECT s.*, f.titre as formation
//            FROM Salaires s, Formations f
//            WHERE s.formationID = f.id
//            AND s.profID = ?`,
//           [prof.id]
//         );

//         return {
//           ...prof,
//           salaires: salaires
//         };
//       })
//     );

//     res.status(200).json(result);
//   } catch (error) {
//     console.error('Erreur lors de la récupération des professeurs:', error);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// }