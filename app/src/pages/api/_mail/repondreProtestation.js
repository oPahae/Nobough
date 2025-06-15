import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_SMTP,
      port: 587,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_API,
      },
    });

    await transporter.sendMail({
      from: process.env.BREVO_SENDER,
      to: email,
      subject: 'Réponse à votre protestation',
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #4CAF50; text-align: center;">Réponse à votre protestation</h2>
          <p style="font-size: 16px; line-height: 1.5; text-align: center;">
            Bonjour,
          </p>
          <p style="font-size: 16px; line-height: 1.5; text-align: center;">
            Nous avons bien reçu votre protestation et voici notre réponse :
          </p>
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #4CAF50;">
            <p style="font-size: 16px; line-height: 1.5; text-align: left;">
              ${message}
            </p>
          </div>
          <p style="font-size: 14px; line-height: 1.5; text-align: center; color: #777;">
            Merci de votre compréhension.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; text-align: center; color: #aaa;">
            Cet email a été envoyé automatiquement, merci de ne pas y répondre.
          </p>
        </div>
      `
    });

    res.status(200).json({ message: 'Réponse envoyée avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la réponse:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}