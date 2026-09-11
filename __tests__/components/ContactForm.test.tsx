/**
 * Tests for the contact form component.
 *
 * These cover the behaviour a visitor actually experiences: field errors are
 * surfaced and cleared, failures are announced, and a successful send replaces
 * the form.
 */

import { describe, it, expect, beforeEach, afterEach, mock } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactPage from "@/app/contact/page";

const originalFetch = globalThis.fetch;

function mockFetch(handler: (url: string, init?: RequestInit) => Response) {
  const fn = mock(async (input: RequestInfo | URL, init?: RequestInit) =>
    handler(String(input), init),
  );
  globalThis.fetch = fn as unknown as typeof fetch;
  return fn;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Name"), "Blake");
  await user.type(screen.getByLabelText("Email"), "visitor@example.com");
  await user.type(
    screen.getByLabelText("LinkedIn Profile URL"),
    "https://linkedin.com/in/someone",
  );
  await user.type(screen.getByLabelText("Message"), "Hello there, this is me.");
}

beforeEach(() => {
  mockFetch(() =>
    json({ success: true, message: "Message sent successfully" }),
  );
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("ContactForm", () => {
  it("renders every required field and the submit button", () => {
    render(<ContactPage />);

    expect(screen.getByLabelText("Name")).toBeDefined();
    expect(screen.getByLabelText("Email")).toBeDefined();
    expect(screen.getByLabelText("LinkedIn Profile URL")).toBeDefined();
    expect(screen.getByLabelText("Message")).toBeDefined();
    expect(screen.getByRole("button", { name: /send message/i })).toBeDefined();
  });

  it("caps each field at its server-side length limit", () => {
    render(<ContactPage />);

    expect(screen.getByLabelText("Name").getAttribute("maxlength")).toBe("100");
    expect(screen.getByLabelText("Message").getAttribute("maxlength")).toBe(
      "2000",
    );
  });

  it("shows server-side field errors and marks the input invalid", async () => {
    const user = userEvent.setup();
    mockFetch(() =>
      json(
        {
          success: false,
          message: "Please fix the errors below",
          errors: { email: "Please enter a valid email address" },
        },
        400,
      ),
    );

    render(<ContactPage />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address"),
      ).toBeDefined();
    });
    expect(screen.getByLabelText("Email").getAttribute("aria-invalid")).toBe(
      "true",
    );
  });

  it("clears a field error as soon as the visitor edits that field", async () => {
    const user = userEvent.setup();
    mockFetch(() =>
      json(
        {
          success: false,
          errors: { email: "Please enter a valid email address" },
        },
        400,
      ),
    );

    render(<ContactPage />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address"),
      ).toBeDefined();
    });

    await user.type(screen.getByLabelText("Email"), "x");

    await waitFor(() => {
      expect(screen.queryByText("Please enter a valid email address")).toBe(
        null,
      );
    });
  });

  it("announces a form-level failure in an alert region", async () => {
    const user = userEvent.setup();
    mockFetch(() =>
      json(
        {
          success: false,
          message: "Too many requests. Please wait 5 minutes.",
        },
        429,
      ),
    );

    render(<ContactPage />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert").textContent).toContain(
        "Too many requests",
      );
    });
  });

  it("replaces the form with a confirmation after a successful send", async () => {
    const user = userEvent.setup();

    render(<ContactPage />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText("Message sent")).toBeDefined();
    });
    expect(screen.queryByLabelText("Name")).toBe(null);
  });

  it("posts the collected values to the contact endpoint", async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetch(() => json({ success: true }));

    render(<ContactPage />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    const call = fetchMock.mock.calls.find(([url]) =>
      String(url).includes("/api/contact"),
    );
    expect(call).toBeDefined();
    const body = JSON.parse(String(call?.[1]?.body));
    expect(body.name).toBe("Blake");
    expect(body.email).toBe("visitor@example.com");
  });

  it("keeps a hidden honeypot field out of the tab order", () => {
    render(<ContactPage />);

    const honeypot = document.getElementById("honeypot");
    expect(honeypot?.getAttribute("tabindex")).toBe("-1");
  });

  it("reports that a preview could not be loaded rather than faking one", async () => {
    const user = userEvent.setup();
    mockFetch((url) => {
      if (url.includes("/api/linkedin-preview")) {
        return json({ error: "Failed to fetch profile preview" }, 500);
      }
      return json({ success: true });
    });

    render(<ContactPage />);
    await user.type(
      screen.getByLabelText("LinkedIn Profile URL"),
      "https://linkedin.com/in/someone",
    );

    await waitFor(
      () => {
        expect(screen.getByText(/Couldn't load a preview/i)).toBeDefined();
      },
      { timeout: 3000 },
    );
  });
});
