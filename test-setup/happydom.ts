/**
 * Registers a DOM before anything else loads.
 *
 * Kept free of other imports on purpose: @testing-library/dom binds `screen`
 * to document.body at import time, so the DOM has to exist first.
 */
import { GlobalRegistrator } from "@happy-dom/global-registrator";

if (!(globalThis as { document?: unknown }).document) {
  GlobalRegistrator.register();
}
