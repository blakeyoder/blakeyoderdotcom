/**
 * Tests for the email content builders.
 *
 * sendContactEmail itself talks to Resend, so these cover the pure pieces that
 * decide what actually lands in the message: HTML escaping and the subject.
 */

import { describe, it, expect } from "bun:test";
import { buildSubject, escapeHtml } from "@/lib/email";

describe("escapeHtml", () => {
  it("escapes the characters that could break out of the markup", () => {
    expect(escapeHtml(`<script>alert("x")</script>`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
    );
  });

  it("escapes single quotes and ampersands", () => {
    expect(escapeHtml("Tom & Jerry's")).toBe("Tom &amp; Jerry&#39;s");
  });

  it("escapes the ampersand of an entity so it cannot be double-decoded", () => {
    expect(escapeHtml("&lt;img&gt;")).toBe("&amp;lt;img&amp;gt;");
  });

  it("leaves ordinary text untouched", () => {
    expect(escapeHtml("Hello there")).toBe("Hello there");
  });

  it("neutralises an image onerror payload", () => {
    const escaped = escapeHtml(`<img src=x onerror=alert(1)>`);
    expect(escaped).not.toContain("<img");
    expect(escaped).toContain("&lt;img");
  });
});

describe("buildSubject", () => {
  it("includes the sender name", () => {
    expect(buildSubject("Blake")).toBe("Contact Form: Blake");
  });

  it("strips CRLF so the subject cannot span lines", () => {
    const subject = buildSubject("Evil\r\nBcc: victim@example.com");
    expect(subject).not.toContain("\r");
    expect(subject).not.toContain("\n");
  });

  it("strips other control characters", () => {
    expect(buildSubject("A\u0007B\u0000C")).toBe("Contact Form: A B C");
  });

  it("truncates an unreasonably long name", () => {
    const subject = buildSubject("a".repeat(500));
    expect(subject.length).toBeLessThanOrEqual("Contact Form: ".length + 78);
  });

  it("leaves a normal-length name intact", () => {
    const name = "Alexandra Featherstonehaugh-Wellington";
    expect(buildSubject(name)).toBe(`Contact Form: ${name}`);
  });
});
