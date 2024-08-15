import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { registerFvrText } from "./";
import "@testing-library/jest-dom";

describe("FvrText", () => {
  let element;

  beforeEach(() => {
    // Register the custom element before each test
    registerFvrText();
    // Create a new FvrText instance for each test
    element = document.createElement("fvr-text");
    document.body.appendChild(element);
  });

  afterEach(() => {
    // Clean up after each test
    document.body.innerHTML = "";
  });

  it("should render with default attributes", () => {
    const shadowElement = element.shadowRoot.querySelector(element.element);
    expect(shadowElement).toBeInTheDocument();
    expect(shadowElement).toHaveClass("fvrText");
    expect(shadowElement).toHaveClass("color-foreground-primary");
    expect(shadowElement).toHaveClass("text-style-body");
  });

  it("should update element when attribute changes", () => {
    element.setAttribute("element", "span");
    const shadowElement = element.shadowRoot.querySelector("span");
    expect(shadowElement).toBeInTheDocument();
  });

  it("should update text-style when attribute changes", () => {
    element.setAttribute("text-style", "heading-1");
    const shadowElement = element.shadowRoot.querySelector(element.element);
    expect(shadowElement).toHaveClass("text-style-heading-1");
  });

  it("should update color when attribute changes", () => {
    element.setAttribute("color", "blue-primary");
    const shadowElement = element.shadowRoot.querySelector(element.element);
    expect(shadowElement).toHaveClass("color-blue-primary");
  });

  it("should render slot content", () => {
    element.innerHTML = "<span>Test content</span>";
    const slotContent = element.querySelector("span");
    expect(slotContent).toBeInTheDocument();
    expect(slotContent).toHaveTextContent("Test content");
    
    // Check if the slotted content is rendered within the shadow DOM
    const slot = element.shadowRoot.querySelector("slot");
    expect(slot).toBeInTheDocument();
    const assignedNodes = slot.assignedNodes();
    expect(assignedNodes).toHaveLength(1);
    expect(assignedNodes[0]).toBe(slotContent);
  });
});