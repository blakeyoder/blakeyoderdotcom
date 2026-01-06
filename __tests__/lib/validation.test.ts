/**
 * Tests for validation functions
 * These tests are written FIRST (before implementation) per Test-First Development principle
 */

import {
  validateRequired,
  validateEmail,
  validateLength,
  validateContactForm,
} from "@/lib/validation";

describe("validateRequired", () => {
  it("should return valid for non-empty string", () => {
    const result = validateRequired("Blake", "Name");
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("should return invalid for empty string", () => {
    const result = validateRequired("", "Name");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Name is required");
  });

  it("should return invalid for whitespace-only string", () => {
    const result = validateRequired("   ", "Name");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Name is required");
  });

  it("should trim whitespace before validation", () => {
    const result = validateRequired("  Blake  ", "Name");
    expect(result.isValid).toBe(true);
  });
});

describe("validateEmail", () => {
  it("should return valid for proper email format", () => {
    const result = validateEmail("blake@example.com");
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("should return invalid for empty email", () => {
    const result = validateEmail("");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Email is required");
  });

  it("should return invalid for email without @", () => {
    const result = validateEmail("blakeexample.com");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Please enter a valid email address");
  });

  it("should return invalid for email without domain", () => {
    const result = validateEmail("blake@");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Please enter a valid email address");
  });

  it("should return invalid for email without TLD", () => {
    const result = validateEmail("blake@example");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Please enter a valid email address");
  });

  it("should return invalid for email longer than 254 characters", () => {
    const longEmail = "a".repeat(250) + "@example.com";
    const result = validateEmail(longEmail);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Email address is too long");
  });

  it("should trim whitespace before validation", () => {
    const result = validateEmail("  blake@example.com  ");
    expect(result.isValid).toBe(true);
  });
});

describe("validateLength", () => {
  it("should return valid for string within bounds", () => {
    const result = validateLength("Hello", "Message", 1, 100);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("should return invalid for string too short", () => {
    const result = validateLength("Hi", "Message", 3, 100);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Message must be at least 3 characters");
  });

  it("should return invalid for string too long", () => {
    const result = validateLength("Hello World", "Message", 1, 5);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Message must be 5 characters or less");
  });

  it("should trim whitespace before checking length", () => {
    const result = validateLength("  Hi  ", "Message", 2, 100);
    expect(result.isValid).toBe(true);
  });
});

describe("validateContactForm", () => {
  it("should return valid for complete valid form", () => {
    const result = validateContactForm({
      name: "Blake Yoder",
      email: "blake@example.com",
      linkedin: "https://linkedin.com/in/blakeyoder",
      message: "Hi! Let&apos;s grab a beer.",
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("should return errors for all empty fields", () => {
    const result = validateContactForm({
      name: "",
      email: "",
      linkedin: "",
      message: "",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe("Name is required");
    expect(result.errors.email).toBe("Email is required");
    expect(result.errors.linkedin).toBe("LinkedIn URL is required");
    expect(result.errors.message).toBe("Message is required");
  });

  it("should validate name length (max 100 characters)", () => {
    const result = validateContactForm({
      name: "a".repeat(101),
      email: "blake@example.com",
      linkedin: "https://linkedin.com/in/test",
      message: "Hello",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe("Name must be 100 characters or less");
  });

  it("should validate invalid email format", () => {
    const result = validateContactForm({
      name: "Blake",
      email: "not-an-email",
      linkedin: "https://linkedin.com/in/test",
      message: "Hello",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe("Please enter a valid email address");
  });

  it("should validate message length (max 2000 characters)", () => {
    const result = validateContactForm({
      name: "Blake",
      email: "blake@example.com",
      linkedin: "https://linkedin.com/in/test",
      message: "a".repeat(2001),
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.message).toBe(
      "Message must be 2000 characters or less",
    );
  });

  it("should validate invalid LinkedIn URL", () => {
    const result = validateContactForm({
      name: "Blake",
      email: "blake@example.com",
      linkedin: "not-a-linkedin-url",
      message: "Hello",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.linkedin).toBe(
      "Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname)",
    );
  });

  it("should allow honeypot field (ignored in validation)", () => {
    const result = validateContactForm({
      name: "Blake",
      email: "blake@example.com",
      linkedin: "https://linkedin.com/in/test",
      message: "Hello",
      honeypot: "",
    });

    expect(result.isValid).toBe(true);
  });
});
