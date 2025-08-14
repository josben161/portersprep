import { Resend } from "resend";
export const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
}) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject,
    react,
  });
}
