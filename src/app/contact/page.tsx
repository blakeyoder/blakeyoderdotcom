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
    honeypot: "",
  });

  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [linkedInPreview, setLinkedInPreview] = useState<{
    name?: string;
    headline?: string;
    imageUrl?: string;
    isLoading: boolean;
  }>({ isLoading: false });

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const linkedinRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    const linkedInPattern =
      /^https?:\/\/(www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)\/?$/;
    const match = formData.linkedin.trim().match(linkedInPattern);

    if (!match) {
      setLinkedInPreview({ isLoading: false });
      return;
    }

    const username = match[2];

    const fetchPreview = async () => {
      setLinkedInPreview({ isLoading: true });

      try {
        const response = await fetch(
          `/api/linkedin-preview?url=${encodeURIComponent(formData.linkedin)}`,
        );

        if (response.ok) {
          const data = await response.json();

          if (data.name || data.headline || data.imageUrl) {
            setLinkedInPreview({
              name: data.name,
              headline: data.headline,
              imageUrl: data.imageUrl,
              isLoading: false,
            });
          } else {
            setLinkedInPreview({
              name: username,
              headline: "LinkedIn Profile",
              imageUrl: undefined,
              isLoading: false,
            });
          }
        } else {
          setLinkedInPreview({
            name: username,
            headline: "LinkedIn Profile",
            imageUrl: undefined,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Failed to fetch LinkedIn preview:", error);
        setLinkedInPreview({
          name: username,
          headline: "LinkedIn Profile",
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
          setErrors(data.errors);
          setSubmitStatus("error");
        } else {
          setErrorMessage(
            data.message || "Something went wrong. Please try again.",
          );
          setSubmitStatus("error");
        }
      } else {
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
      <header style={{ marginBottom: "2rem" }}>
        <p className="small-caps" style={{ marginBottom: "0.75rem" }}>
          <Link href="/" className="nav-link">
            Blake Yoder
          </Link>
        </p>
        <h1>Get in touch</h1>
      </header>

      <hr className="rule-thick" />

      <main>
        {submitStatus === "success" ? (
          <div
            style={{
              padding: "2rem",
              border: "2px solid var(--ink)",
              marginBottom: "2rem",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
              Message sent
            </h2>
            <p style={{ marginBottom: 0, color: "var(--text-secondary)" }}>
              Thanks for reaching out. I&apos;ll get back to you soon.
            </p>
          </div>
        ) : (
          <>
            <p style={{ marginBottom: "2.5rem" }}>
              If you&apos;re in the NYC area and want to meet up for coffee or a
              beer, feel free to reach out.
            </p>

            {errorMessage && (
              <div
                style={{
                  padding: "1rem",
                  border: "1px solid var(--accent)",
                  color: "var(--accent)",
                  marginBottom: "2rem",
                }}
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Honeypot field */}
              <div
                style={{ position: "absolute", left: "-9999px" }}
                aria-hidden="true"
              >
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

              <div style={{ marginBottom: "2rem" }}>
                <label htmlFor="name">Name</label>
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
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p
                    id="name-error"
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.875rem",
                      color: "var(--accent)",
                      marginBottom: 0,
                    }}
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label htmlFor="email">Email</label>
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
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.875rem",
                      color: "var(--accent)",
                      marginBottom: 0,
                    }}
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label htmlFor="linkedin">LinkedIn Profile URL</label>
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
                  aria-invalid={errors.linkedin ? "true" : "false"}
                  aria-describedby={
                    errors.linkedin ? "linkedin-error" : undefined
                  }
                />
                {errors.linkedin && (
                  <p
                    id="linkedin-error"
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.875rem",
                      color: "var(--accent)",
                      marginBottom: 0,
                    }}
                  >
                    {errors.linkedin}
                  </p>
                )}

                {linkedInPreview.isLoading && (
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "1rem",
                      border: "1px solid var(--rule)",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "var(--text-tertiary)",
                        fontSize: "0.875rem",
                      }}
                    >
                      Loading preview...
                    </p>
                  </div>
                )}

                {!linkedInPreview.isLoading &&
                  (linkedInPreview.name || linkedInPreview.headline) && (
                    <div
                      style={{
                        marginTop: "1rem",
                        padding: "1rem",
                        border: "1px solid var(--rule)",
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
                            backgroundColor: "var(--rule)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--text-tertiary)",
                            fontSize: "1.25rem",
                          }}
                        >
                          ?
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        {linkedInPreview.name && (
                          <p
                            style={{
                              margin: 0,
                              fontWeight: 500,
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

              <div style={{ marginBottom: "2rem" }}>
                <label htmlFor="message">Message</label>
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
                  style={{ resize: "vertical" }}
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-describedby={
                    errors.message ? "message-error" : undefined
                  }
                />
                {errors.message && (
                  <p
                    id="message-error"
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.875rem",
                      color: "var(--accent)",
                      marginBottom: 0,
                    }}
                  >
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-accent"
                style={{
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
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
