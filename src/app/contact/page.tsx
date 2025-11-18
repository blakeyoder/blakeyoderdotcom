"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ContactFormErrors } from "@/lib/validation";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    linkedin: "",
    message: "",
    honeypot: "", // Hidden field for spam prevention
  });

  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [linkedInPreview, setLinkedInPreview] = useState<{
    name?: string;
    headline?: string;
    imageUrl?: string;
    isLoading: boolean;
  }>({ isLoading: false });

  // Refs for focus management
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const linkedinRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Focus on first error field when errors change
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      if (errors.name) {
        nameRef.current?.focus();
      } else if (errors.email) {
        emailRef.current?.focus();
      } else if (errors.linkedin) {
        linkedinRef.current?.focus();
      } else if (errors.message) {
        messageRef.current?.focus();
      }
    }
  }, [errors]);

  // Fetch LinkedIn preview when URL changes
  useEffect(() => {
    const linkedInPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)\/?$/;
    const match = formData.linkedin.trim().match(linkedInPattern);

    if (!match) {
      setLinkedInPreview({ isLoading: false });
      return;
    }

    const username = match[2];

    const fetchPreview = async () => {
      setLinkedInPreview({ isLoading: true });

      try {
        const response = await fetch(`/api/linkedin-preview?url=${encodeURIComponent(formData.linkedin)}`);

        if (response.ok) {
          const data = await response.json();

          // If we got data, use it. Otherwise, create a fallback preview
          if (data.name || data.headline || data.imageUrl) {
            setLinkedInPreview({
              name: data.name,
              headline: data.headline,
              imageUrl: data.imageUrl,
              isLoading: false,
            });
          } else {
            // Fallback: Create a basic preview with username
            setLinkedInPreview({
              name: username,
              headline: 'LinkedIn Profile',
              imageUrl: undefined,
              isLoading: false,
            });
          }
        } else {
          // On error, still show basic info
          setLinkedInPreview({
            name: username,
            headline: 'LinkedIn Profile',
            imageUrl: undefined,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Failed to fetch LinkedIn preview:', error);
        // Show basic preview even on error
        setLinkedInPreview({
          name: username,
          headline: 'LinkedIn Profile',
          imageUrl: undefined,
          isLoading: false,
        });
      }
    };

    const debounceTimer = setTimeout(fetchPreview, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData.linkedin]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          // Field-specific validation errors
          setErrors(data.errors);
          setSubmitStatus("error");
        } else {
          // General error (rate limit, spam, server error)
          setErrorMessage(data.message || "Something went wrong. Please try again.");
          setSubmitStatus("error");
        }
      } else {
        // Success
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          linkedin: "",
          message: "",
          honeypot: "",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setErrorMessage("Failed to send message. Please try again.");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <header className="mb-8">
        <h1 className="mb-4">Get in touch</h1>
        <p className="text-base text-secondary mb-0">
          <Link href="/" className="hover:text-primary transition-colors">
            ← Back to home
          </Link>
        </p>
      </header>

      <main style={{ maxWidth: "65ch" }}>
        {submitStatus === "success" ? (
          <div
            style={{
              padding: "1.5rem",
              borderRadius: "4px",
              border: "2px solid var(--border-color)",
              backgroundColor: "var(--background)",
              marginBottom: "2rem",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
              Message sent!
            </h2>
            <p style={{ marginBottom: 0, color: "var(--text-secondary)" }}>
              Thanks for reaching out. I&apos;ll get back to you soon.
            </p>
          </div>
        ) : (
          <>
            <p style={{ marginBottom: "2rem", fontSize: "1.125rem", lineHeight: "1.7" }}>
              If you&apos;re in the NYC area and want to meet up for coffee or a beer, feel free to reach out.
            </p>

            {errorMessage && (
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "4px",
                  border: "2px solid var(--border-color)",
                  backgroundColor: "var(--background)",
                  color: "var(--text-primary)",
                  marginBottom: "1.5rem",
                }}
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ marginBottom: "3rem" }}>
              {/* Honeypot field - hidden from humans, visible to bots */}
              <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
                <label htmlFor="honeypot">Leave this field empty</label>
                <input
                  type="text"
                  id="honeypot"
                  name="honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={(e) =>
                    setFormData({ ...formData, honeypot: e.target.value })
                  }
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="name"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 500,
                  }}
                >
                  Name
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    fontSize: "1rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "4px",
                    backgroundColor: "var(--background)",
                    color: "var(--text-primary)",
                  }}
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p
                    id="name-error"
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 500,
                  }}
                >
                  Email
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    fontSize: "1rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "4px",
                    backgroundColor: "var(--background)",
                    color: "var(--text-primary)",
                  }}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="linkedin"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 500,
                  }}
                >
                  LinkedIn Profile URL
                </label>
                <input
                  ref={linkedinRef}
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  required
                  placeholder="https://linkedin.com/in/yourname"
                  value={formData.linkedin}
                  onChange={(e) =>
                    setFormData({ ...formData, linkedin: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    fontSize: "1rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "4px",
                    backgroundColor: "var(--background)",
                    color: "var(--text-primary)",
                  }}
                  aria-invalid={errors.linkedin ? "true" : "false"}
                  aria-describedby={errors.linkedin ? "linkedin-error" : undefined}
                />
                {errors.linkedin && (
                  <p
                    id="linkedin-error"
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {errors.linkedin}
                  </p>
                )}

                {/* LinkedIn Preview */}
                {linkedInPreview.isLoading && (
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "1rem",
                      border: "1px solid var(--border-color)",
                      borderRadius: "4px",
                      backgroundColor: "var(--background)",
                    }}
                  >
                    <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                      Loading preview...
                    </p>
                  </div>
                )}

                {!linkedInPreview.isLoading && (linkedInPreview.name || linkedInPreview.headline) && (
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "1rem",
                      border: "1px solid var(--border-color)",
                      borderRadius: "4px",
                      backgroundColor: "var(--background)",
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                    }}
                  >
                    {linkedInPreview.imageUrl ? (
                      <Image
                        src={linkedInPreview.imageUrl}
                        alt={linkedInPreview.name || "Profile"}
                        width={48}
                        height={48}
                        style={{
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                        unoptimized
                      />
                    ) : (
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          backgroundColor: "var(--border-color)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.5rem",
                        }}
                      >
                        👤
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      {linkedInPreview.name && (
                        <p
                          style={{
                            margin: 0,
                            fontWeight: 500,
                            color: "var(--text-primary)",
                            fontSize: "0.875rem",
                          }}
                        >
                          {linkedInPreview.name}
                        </p>
                      )}
                      {linkedInPreview.headline && (
                        <p
                          style={{
                            margin: "0.25rem 0 0 0",
                            color: "var(--text-secondary)",
                            fontSize: "0.75rem",
                          }}
                        >
                          {linkedInPreview.headline}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="message"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 500,
                  }}
                >
                  Message
                </label>
                <textarea
                  ref={messageRef}
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    fontSize: "1rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "4px",
                    backgroundColor: "var(--background)",
                    color: "var(--text-primary)",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                {errors.message && (
                  <p
                    id="message-error"
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: "0.875rem 2rem",
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "var(--background)",
                  backgroundColor: "var(--text-primary)",
                  border: "none",
                  borderRadius: "4px",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.6 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {isSubmitting ? "Sending..." : "Send message"}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
