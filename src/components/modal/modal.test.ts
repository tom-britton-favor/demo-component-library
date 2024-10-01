import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { registerFvrModal } from "./";

// Extend expect with jest-dom matchers
import "@testing-library/jest-dom";

describe("FvrModal", () => {
  let component;

  beforeEach(() => {
    // Register the custom element before each test
    registerFvrModal();

    // Create a new button instance for each test
    component = document.createElement("fvr-modal");
    document.body.appendChild(component);
  });

  afterEach(() => {
    // Clean up after each test
    document.body.innerHTML = "";
  });
  
 
  it("should render", () => {
    expect(component).toBeInTheDocument();
    expect(component.shadowRoot).not.toBeNull();
    const modalContent = component.shadowRoot.querySelector(".modal");
    expect(modalContent).not.toBeNull();
  });

});
