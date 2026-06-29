import { Injectable } from "@nestjs/common";

type EmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

@Injectable()
export class EmailService {
  getStatus() {
    const provider = process.env.EMAIL_PROVIDER ?? "preview";
    const from = process.env.EMAIL_FROM ?? "";
    const resendReady = provider === "resend" && Boolean(process.env.RESEND_API_KEY && from);

    return {
      provider,
      configured: resendReady,
      from: from || "not configured",
      mode: resendReady ? "send" : "preview"
    };
  }

  async send(input: EmailInput) {
    const status = this.getStatus();

    if (status.provider === "resend" && status.configured) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM,
          to: input.to,
          subject: input.subject,
          html: input.html,
          text: input.text
        })
      });

      if (!response.ok) {
        return {
          ok: false,
          mode: "send",
          provider: "resend",
          error: `Email provider returned ${response.status}`
        };
      }

      const data = await response.json().catch(() => null);
      return { ok: true, mode: "send", provider: "resend", data };
    }

    return {
      ok: true,
      mode: "preview",
      provider: status.provider,
      preview: input
    };
  }
}
