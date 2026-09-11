/**
 * Unmounts anything a test rendered, so state does not leak between tests.
 */
import { afterEach } from "bun:test";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});
