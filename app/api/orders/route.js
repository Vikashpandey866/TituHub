import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const adminEmail = process.env.ORDER_NOTIFICATION_EMAIL || "pandvikash46@gmail.com";

function formatItems(items = []) {
  return items.map((item) => `${item.name} x ${item.qty} - Rs ${item.price * item.qty}`).join("\n");
}

function formatItemsHtml(items = []) {
  return items.map((item) => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #262626;">${item.name}</td>
      <td style="padding:12px;border-bottom:1px solid #262626;text-align:center;">${item.qty}</td>
      <td style="padding:12px;border-bottom:1px solid #262626;text-align:right;">Rs ${item.price * item.qty}</td>
    </tr>
  `).join("");
}

function orderEmailHtml(order) {
  return `
    <div style="margin:0;background:#0D0D0D;padding:28px;font-family:Arial,sans-serif;color:#F7F7F7;">
      <div style="max-width:680px;margin:0 auto;border:1px solid #262626;border-radius:18px;background:#151515;overflow:hidden;">
        <div style="padding:24px;background:linear-gradient(135deg,#FF6B00,#FF3D00);">
          <div style="font-size:28px;font-weight:800;">TituHub</div>
          <div style="margin-top:6px;font-size:14px;">New order notification</div>
        </div>
        <div style="padding:24px;">
          <h1 style="margin:0 0 12px;font-size:22px;">Order ${order.id}</h1>
          <p style="margin:0 0 18px;color:#B8B8B8;">A customer has placed a new order on TituHub.</p>
          <div style="display:grid;gap:10px;margin-bottom:20px;">
            <div><b>Customer:</b> ${order.customer || order.customerDetails?.fullName || "TituHub Customer"}</div>
            <div><b>Phone:</b> ${order.phone || order.customerDetails?.phone || "Not provided"}</div>
            <div><b>Email:</b> ${order.email || order.customerDetails?.email || "Not provided"}</div>
            <div><b>Address:</b> ${order.address || "Not provided"}</div>
            <div><b>Payment:</b> ${order.paymentMethod || "Not provided"}</div>
          </div>
          <table style="width:100%;border-collapse:collapse;border:1px solid #262626;border-radius:12px;overflow:hidden;">
            <thead>
              <tr style="background:#1F1F1F;color:#FFB347;">
                <th style="padding:12px;text-align:left;">Product</th>
                <th style="padding:12px;text-align:center;">Qty</th>
                <th style="padding:12px;text-align:right;">Amount</th>
              </tr>
            </thead>
            <tbody>${formatItemsHtml(order.items)}</tbody>
          </table>
          <div style="margin-top:20px;padding:16px;border-radius:12px;background:#1F1F1F;text-align:right;">
            <div style="color:#B8B8B8;">Total Amount</div>
            <div style="font-size:24px;font-weight:800;color:#FF6B00;">Rs ${order.total}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function POST(request) {
  try {
    const order = await request.json();
    const user = process.env.GMAIL_SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.GMAIL_SMTP_PASS || process.env.EMAIL_APP_PASSWORD;

    if (!user || !pass) {
      return NextResponse.json({ ok: true, emailSent: false, reason: "SMTP env vars missing" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass }
    });

    await transporter.sendMail({
      from: `"TituHub Orders" <${user}>`,
      to: adminEmail,
      subject: `New TituHub Order ${order.id}`,
      text: [
        `Order ID: ${order.id}`,
        `Customer Name: ${order.customer || order.customerDetails?.fullName}`,
        `Phone: ${order.phone || order.customerDetails?.phone}`,
        `Address: ${order.address}`,
        `Total Amount: Rs ${order.total}`,
        "",
        "Products Ordered:",
        formatItems(order.items)
      ].join("\n"),
      html: orderEmailHtml(order)
    });

    return NextResponse.json({ ok: true, emailSent: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
