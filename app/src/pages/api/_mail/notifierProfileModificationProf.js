import nodemailer from 'nodemailer';
import db from '../_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { emailOld, personalInfo } = req.body;
    console.log(emailOld)
    console.log(personalInfo)

    if (
      !personalInfo?.nom ||
      !personalInfo?.prenom ||
      !personalInfo?.email ||
      !emailOld
    ) {
      return res.status(400).json({ error: 'Paramètres manquants.' });
    }

    const [secretaires] = await db.execute('SELECT * FROM Secretaires');

    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_SMTP,
      port: 587,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_API,
      },
    });

    for (const secretaire of secretaires) {
      const mailOptions = {
        from: process.env.BREVO_SENDER,
        to: secretaire.email,
        subject: 'Changement d’email professeur',
        html: `
          <p>Bonjour,</p>
          <p>Le professeur suivant a modifié son adresse e-mail :</p>
          <ul>
            <li><strong>Nom :</strong> ${personalInfo.nom}</li>
            <li><strong>Prénom :</strong> ${personalInfo.prenom}</li>
            <li><strong>Email précédent :</strong> ${emailOld}</li>
            <li><strong>Nouvel email :</strong> ${personalInfo.email}</li>
          </ul>
          <p>Merci de mettre à jour vos dossiers si nécessaire.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    return res.status(200).json({ message: 'Emails envoyés avec succès.' });

  } catch (error) {
    console.error('Erreur lors de l’envoi des emails :', error);
    return res.status(500).json({ error: 'Erreur serveur lors de l’envoi des emails.' });
  }
}