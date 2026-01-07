"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Image from "next/image";
import type { ContactFormErrors } from "@/lib/validation";
import { PageShell } from "@/components/PageShell";

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
    <PageShell title="Get in touch">
      {submitStatus === "success" ? (
        <div className="p-8 border-2 border-border-strong mb-8">
          <h2 className="text-xl mb-2">Message sent</h2>
          <p className="mb-0 text-text-secondary">
            Thanks for reaching out. I&apos;ll get back to you soon.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-10">
            If you&apos;re in the NYC area and want to meet up for coffee or a
            beer, feel free to reach out.
          </p>

          {errorMessage && (
            <div className="p-4 border border-accent text-accent mb-8">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Honeypot field */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
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

            <div className="mb-8">
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
                <p id="name-error" className="mt-2 text-sm text-accent mb-0">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="mb-8">
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
                <p id="email-error" className="mt-2 text-sm text-accent mb-0">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="mb-8">
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
                  className="mt-2 text-sm text-accent mb-0"
                >
                  {errors.linkedin}
                </p>
              )}

              {linkedInPreview.isLoading && (
                <div className="mt-4 p-4 border border-border">
                  <p className="m-0 text-text-tertiary text-sm">
                    Loading preview...
                  </p>
                </div>
              )}

              {!linkedInPreview.isLoading &&
                (linkedInPreview.name || linkedInPreview.headline) && (
                  <div className="mt-4 p-4 border border-border flex gap-4 items-center">
                    {linkedInPreview.imageUrl ? (
                      <Image
                        src={linkedInPreview.imageUrl}
                        alt={linkedInPreview.name || "Profile"}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-border flex items-center justify-center text-text-tertiary text-xl">
                        ?
                      </div>
                    )}
                    <div className="flex-1">
                      {linkedInPreview.name && (
                        <p className="m-0 font-medium text-sm">
                          {linkedInPreview.name}
                        </p>
                      )}
                      {linkedInPreview.headline && (
                        <p className="mt-1 mb-0 text-text-secondary text-xs">
                          {linkedInPreview.headline}
                        </p>
                      )}
                    </div>
                  </div>
                )}
            </div>

            <div className="mb-8">
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
                className="resize-y"
                aria-invalid={errors.message ? "true" : "false"}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <p id="message-error" className="mt-2 text-sm text-accent mb-0">
                  {errors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn btn-accent ${isSubmitting ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {isSubmitting ? "Sending..." : "Send message"}
            </button>
          </form>
        </>
      )}
    </PageShell>
  );
}
