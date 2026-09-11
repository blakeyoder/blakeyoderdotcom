"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  FormEvent,
  ReactNode,
} from "react";
import Image from "next/image";
import { FIELD_LIMITS, type ContactFormErrors } from "@/lib/validation";
import { PageShell } from "@/components/PageShell";

type FieldName = "name" | "email" | "linkedin" | "message";

interface LinkedInPreview {
  status: "idle" | "loading" | "resolved" | "unavailable";
  name?: string;
  headline?: string;
  imageUrl?: string;
}

function Field({
  id,
  label,
  error,
  children,
  hint,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div className="mb-8">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-accent mb-0">
          {error}
        </p>
      )}
      {hint}
    </div>
  );
}

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
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [linkedInPreview, setLinkedInPreview] = useState<LinkedInPreview>({
    status: "idle",
  });

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const linkedinRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const errorBannerRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const updateField = useCallback((field: FieldName, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear the error as soon as the user starts correcting the field,
    // rather than leaving it marked invalid until the next submit.
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length === 0) return;
    if (errors.name) nameRef.current?.focus();
    else if (errors.email) emailRef.current?.focus();
    else if (errors.linkedin) linkedinRef.current?.focus();
    else if (errors.message) messageRef.current?.focus();
  }, [errors]);

  // Move focus to the form-level failure so it is not silently missed.
  useEffect(() => {
    if (errorMessage) errorBannerRef.current?.focus();
  }, [errorMessage]);

  useEffect(() => {
    if (isSent) successRef.current?.focus();
  }, [isSent]);

  useEffect(() => {
    const linkedInPattern =
      /^https?:\/\/(www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)\/?$/i;
    const url = formData.linkedin.trim();

    if (!linkedInPattern.test(url)) {
      setLinkedInPreview({ status: "idle" });
      return;
    }

    const controller = new AbortController();

    const debounceTimer = setTimeout(async () => {
      setLinkedInPreview({ status: "loading" });

      try {
        const response = await fetch(
          `/api/linkedin-preview?url=${encodeURIComponent(url)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          setLinkedInPreview({ status: "unavailable" });
          return;
        }

        const data = await response.json();

        if (data.name || data.headline || data.imageUrl) {
          setLinkedInPreview({
            status: "resolved",
            name: data.name,
            headline: data.headline,
            imageUrl: data.imageUrl,
          });
        } else {
          setLinkedInPreview({ status: "unavailable" });
        }
      } catch (error) {
        // An aborted request is the expected path when the user keeps typing.
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        console.error("Failed to fetch LinkedIn preview:", error);
        setLinkedInPreview({ status: "unavailable" });
      }
    }, 500);

    // Cancelling the in-flight request matters as much as the timer: without
    // it, a slow response for an older URL can overwrite a newer one.
    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [formData.linkedin]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrors({});
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrorMessage(
            data.message || "Something went wrong. Please try again.",
          );
        }
      } else {
        setIsSent(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell title="Get in touch">
      {isSent ? (
        <div
          className="p-8 border-2 border-border-strong mb-8"
          role="status"
          aria-live="polite"
        >
          <h2 className="text-xl mb-2" tabIndex={-1} ref={successRef}>
            Message sent
          </h2>
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

          <div role="alert" aria-live="assertive">
            {errorMessage && (
              <div
                ref={errorBannerRef}
                tabIndex={-1}
                className="p-4 border border-accent text-accent mb-8"
              >
                {errorMessage}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate>
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

            <Field id="name" label="Name" error={errors.name}>
              <input
                ref={nameRef}
                type="text"
                id="name"
                name="name"
                required
                autoComplete="name"
                maxLength={FIELD_LIMITS.name}
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
            </Field>

            <Field id="email" label="Email" error={errors.email}>
              <input
                ref={emailRef}
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
                maxLength={FIELD_LIMITS.email}
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </Field>

            <Field
              id="linkedin"
              label="LinkedIn Profile URL"
              error={errors.linkedin}
              hint={
                <div aria-live="polite">
                  {linkedInPreview.status === "loading" && (
                    <div className="mt-4 p-4 border border-border">
                      <p className="m-0 text-text-tertiary text-sm">
                        Loading preview...
                      </p>
                    </div>
                  )}

                  {linkedInPreview.status === "unavailable" && (
                    <div className="mt-4 p-4 border border-border">
                      <p className="m-0 text-text-tertiary text-sm">
                        Couldn&apos;t load a preview for this profile. You can
                        still send the message.
                      </p>
                    </div>
                  )}

                  {linkedInPreview.status === "resolved" && (
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
                        <div
                          aria-hidden="true"
                          className="w-12 h-12 rounded-full bg-border flex items-center justify-center text-text-tertiary text-xl"
                        >
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
              }
            >
              <input
                ref={linkedinRef}
                type="url"
                id="linkedin"
                name="linkedin"
                required
                maxLength={FIELD_LIMITS.linkedin}
                placeholder="https://linkedin.com/in/yourname"
                value={formData.linkedin}
                onChange={(e) => updateField("linkedin", e.target.value)}
                aria-invalid={errors.linkedin ? "true" : "false"}
                aria-describedby={
                  errors.linkedin ? "linkedin-error" : undefined
                }
              />
            </Field>

            <Field id="message" label="Message" error={errors.message}>
              <textarea
                ref={messageRef}
                id="message"
                name="message"
                required
                rows={6}
                maxLength={FIELD_LIMITS.message}
                value={formData.message}
                onChange={(e) => updateField("message", e.target.value)}
                className="resize-y"
                aria-invalid={errors.message ? "true" : "false"}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
            </Field>

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
