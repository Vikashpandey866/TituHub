import nodemailer from "nodemailer";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export function maskEmail(email = "") {
  const [name, domain] = String(email).split("@");
  if (!name || !domain) return email;
  const visible = name.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(2, name.length - 2))}@${domain}`;
}

function htmlTemplate({ otp, label }) {
  return `
    <div style="margin:0;background:#0D0D0D;padding:28px;font-family:Arial,sans-serif;color:#F7F7F7;">
      <div style="max-width:560px;margin:0 auto;border:1px solid #262626;border-radius:18px;background:#151515;overflow:hidden;">
        <div style="padding:22px;background:linear-gradient(135deg,#FF6B00,#FF3D00);">
          <div style="font-size:26px;font-weight:800;">TituHub</div>
          <div style="margin-top:6px;font-size:14px;">${label}</div>
        </div>
        <div style="padding:26px;">
          <p style="margin:0 0 14px;color:#B8B8B8;">Use this secure OTP to continue. It expires in 5 minutes.</p>
          <div style="letter-spacing:8px;font-size:34px;font-weight:800;color:#FF6B00;background:#1F1F1F;border-radius:14px;padding:18px;text-align:center;">${otp}</div>
          <p style="margin:18px 0 0;color:#777;font-size:13px;">If you did not request this, ignore this email.</p>
        </div>
      </div>
    </div>
  `;
}

export async function sendOtpEmail({ email, otp, purpose = "signup" }) {
  const resendKey = process.env.RESEND_API_KEY;
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_SMTP_PASS || process.env.EMAIL_APP_PASSWORD;
  const from = process.env.EMAIL_FROM || (smtpUser ? `"TituHub Security" <${smtpUser}>` : "TituHub Security <onboarding@resend.dev>");
  const label = purpose === "password_reset" ? "Password Reset" : "Account Verification";
  const subject = `TituHub ${label} OTP`;
  const text = `Your TituHub OTP is ${otp}. It expires in 5 minutes.`;
  const html = htmlTemplate({ otp, label });

  if (process.env.NODE_ENV === "development" && !resendKey && (!smtpUser || !smtpPass)) {
    console.info(`[OTP GENERATED]\nEmail: ${email}\nOTP: ${otp}`);
    console.info("[OTP SENT] Development mode: email provider not configured, terminal OTP enabled.");
    return { sent: true, provider: "development-terminal" };
  }

  if (resendKey) {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ from, to: email, subject, text, html })
    });
    const data = await response.json().catch(() => ({}));
    console.info("[Email Provider Response]", { provider: "resend", ok: response.ok, status: response.status, id: data.id });
    if (!response.ok) throw new Error(data.message || "Failed to send verification email. Please try again.");
    console.info("[OTP SENT]", { email, provider: "resend" });
    return { sent: true, provider: "resend", id: data.id };
  }

  if (!smtpUser || !smtpPass) {
    throw new Error("Email service is not configured. Please try again later.");
  }

  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || "gmail",
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: smtpUser, pass: smtpPass }
  });

  const info = await transporter.sendMail({ from, to: email, subject, text, html });
  console.info("[Email Provider Response]", { provider: "smtp", messageId: info.messageId, accepted: info.accepted });
  console.info("[OTP SENT]", { email, provider: "smtp" });

  return { sent: true, provider: "smtp", id: info.messageId };
}
