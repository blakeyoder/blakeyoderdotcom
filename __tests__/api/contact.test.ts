/**
 * Tests for POST /api/contact.
 *
 * These drive the real route handler with a stubbed email sender, so they fail
 * if the validation, rate-limit ordering, or method guards regress.
 */

import { describe, it, expect, beforeEach, mock } from "bun:test";
import { NextRequest } from "next/server";
import { resetRateLimits } from "@/lib/rate-limit";

process.env.RESEND_API_KEY ??= "re_test_key";
process.env.CONTACT_EMAIL_TO ??= "test@example.com";

const sendContactEmail = mock(() => Promise.resolve());

mock.module("@/lib/email", () => ({
  sendContactEmail,
  buildSubject: (name: string) => `Contact Form: ${name}`,
  escapeHtml: (s: string) => s,
}));

const { POST, GET, PUT, DELETE, PATCH } =
  await import("@/app/api/contact/route");

const VALID = {
  name: "Blake",
  email: "visitor@example.com",
  linkedin: "https://www.linkedin.com/in/someone",
  message: "Hello, this is a message of a reasonable length.",
};

function post(body: unknown, ip = "203.0.113.1") {
  return new NextRequest("https://blakeyoder.com/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-real-ip": ip,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(() => {
  resetRateLimits();
  sendContactEmail.mockClear();
});

describe("POST /api/contact", () => {
  it("sends the email and returns 200 for a valid submission", async () => {
    const response = await POST(post(VALID));

    expect(response.status).toBe(200);
    expect(sendContactEmail).toHaveBeenCalledTimes(1);
  });

  it("returns 400 with field errors when required fields are missing", async () => {
    const response = await POST(post({}));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.errors.name).toBeDefined();
    expect(data.errors.email).toBeDefined();
    expect(data.errors.message).toBeDefined();
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("returns 400 when the email format is invalid", async () => {
    const response = await POST(post({ ...VALID, email: "not-an-email" }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.errors.email).toBeDefined();
  });

  it("returns 400 rather than 500 when a field is not a string", async () => {
    const response = await POST(post({ ...VALID, name: 12345 }));

    expect(response.status).toBe(400);
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("returns 400 rather than 500 for a malformed body", async () => {
    const response = await POST(post("{ not json", "203.0.113.2"));

    expect(response.status).toBe(400);
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("does not spend rate-limit quota on a rejected submission", async () => {
    const ip = "203.0.113.50";

    // Three failed attempts, then a corrected one.
    await POST(post({ ...VALID, email: "bad" }, ip));
    await POST(post({ ...VALID, email: "still-bad" }, ip));
    await POST(post({ ...VALID, email: "nope" }, ip));

    const response = await POST(post(VALID, ip));

    expect(response.status).toBe(200);
    expect(sendContactEmail).toHaveBeenCalledTimes(1);
  });

  it("rate limits a second successful submission from the same client", async () => {
    const ip = "203.0.113.60";

    expect((await POST(post(VALID, ip))).status).toBe(200);

    const second = await POST(post(VALID, ip));
    expect(second.status).toBe(429);
  });

  it("does not rate limit a different client", async () => {
    await POST(post(VALID, "203.0.113.70"));

    expect((await POST(post(VALID, "203.0.113.71"))).status).toBe(200);
  });

  it("accepts the honeypot silently without sending anything", async () => {
    const response = await POST(post({ ...VALID, honeypot: "i am a bot" }));

    expect(response.status).toBe(200);
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("normalises values before handing them to the mailer", async () => {
    await POST(
      post({
        ...VALID,
        name: "  Blake  ",
        email: "  visitor@example.com  ",
      }),
    );

    expect(sendContactEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Blake",
        email: "visitor@example.com",
      }),
    );
  });

  it("returns 500 when the mailer fails", async () => {
    sendContactEmail.mockImplementationOnce(() =>
      Promise.reject(new Error("resend is down")),
    );

    const response = await POST(post(VALID, "203.0.113.80"));

    expect(response.status).toBe(500);
  });

  it("leaves quota intact when the mailer fails, so a retry is possible", async () => {
    const ip = "203.0.113.90";
    sendContactEmail.mockImplementationOnce(() =>
      Promise.reject(new Error("resend is down")),
    );

    expect((await POST(post(VALID, ip))).status).toBe(500);
    expect((await POST(post(VALID, ip))).status).toBe(200);
  });

  it("rejects a body larger than the ceiling", async () => {
    const huge = { ...VALID, message: "a".repeat(200_000) };
    const request = new NextRequest("https://blakeyoder.com/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-real-ip": "203.0.113.99",
      },
      body: JSON.stringify(huge),
    });

    const response = await POST(request);

    // Either the length guard trips (413) or validation rejects it (400);
    // what must not happen is the oversized message reaching the mailer.
    expect([400, 413]).toContain(response.status);
    expect(sendContactEmail).not.toHaveBeenCalled();
  });
});

describe("non-POST methods", () => {
  it.each([
    ["GET", GET],
    ["PUT", PUT],
    ["DELETE", DELETE],
    ["PATCH", PATCH],
  ])("returns 405 with an Allow header for %s", async (_name, handler) => {
    const response = await handler();

    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("POST");
  });
});
