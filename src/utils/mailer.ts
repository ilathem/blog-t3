// using node mailer to send an email
import nodemailer from 'nodemailer';

export async function sendLoginEmail(
  {email, url, token}:
  {email:string, url:string, token:string}
) {
  // get a test account
  const testAccount = await nodemailer.createTestAccount();

  // create a transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    }
  });

  // send the email
  const info = await transporter.sendMail({
    from: '"Jane Doe" <j.doe@example.com>',
    to: email,
    subject: 'Login to your account',
    // using a hash (#) for the token so that it doesn't get saved in the browser's history
    html: `Login by clicking <a href="${url}/login#token=${token}">HERE</a>`
  });

  console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
}