import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { registerFvrButton } from "./";

// Extend expect with jest-dom matchers
import "@testing-library/jest-dom";

describe("FvrButton", () => {
  let button;

  beforeEach(() => {
    // Register the custom element before each test
    registerFvrButton();

    // Create a new button instance for each test
    button = document.createElement("fvr-button");
    document.body.appendChild(button);
  });

  afterEach(() => {
    // Clean up after each test
    document.body.innerHTML = "";
  });

  it("should render with default attributes", () => {
    const shadowButton = button.shadowRoot.querySelector("button");
    expect(shadowButton).toBeInTheDocument();
    expect(shadowButton).toHaveClass("displayType-primary");
    expect(shadowButton).toHaveClass("actionType-default");
    expect(shadowButton).not.toBeDisabled();
    expect(shadowButton).not.toHaveClass("loading");
  });

  it("should update display-type when attribute changes", () => {
    button.setAttribute("display-type", "secondary");
    const shadowButton = button.shadowRoot.querySelector("button");
    expect(shadowButton).toHaveClass("displayType-secondary");
  });

  it("should update action-type when attribute changes", () => {
    button.setAttribute("action-type", "destructive");
    const shadowButton = button.shadowRoot.querySelector("button");
    expect(shadowButton).toHaveClass("actionType-destructive");
  });

  it("should disable button when disabled attribute is set", () => {
    button.setAttribute("disabled", "");
    const shadowButton = button.shadowRoot.querySelector("button");
    expect(shadowButton).toBeDisabled();
  });

  it("should show loading spinner when loading attribute is set", () => {
    button.setAttribute("loading", "");
    const shadowButton = button.shadowRoot.querySelector("button");
    expect(shadowButton).toHaveClass("loading");
    expect(shadowButton.querySelector(".spinner")).toBeInTheDocument();
  });

  it("should disable button when loading", () => {
    button.setAttribute("loading", "");
    const shadowButton = button.shadowRoot.querySelector("button");
    expect(shadowButton).toBeDisabled();
  });

  it("should render slot content", () => {
    button.innerHTML = "<span>Click me</span>";
    const slotContent = button.querySelector("span");
    expect(slotContent).toBeInTheDocument();
    expect(slotContent).toHaveTextContent("Click me");

    // Check if the slotted content is rendered within the shadow DOM
    const slot = button.shadowRoot.querySelector("slot");
    expect(slot).toBeInTheDocument();

    const assignedNodes = slot.assignedNodes();
    expect(assignedNodes).toHaveLength(1);
    expect(assignedNodes[0]).toBe(slotContent);
  });

  it("should dispatch click event when clicked", () => {
    const clickHandler = vi.fn();
    button.addEventListener("click", clickHandler);

    const shadowButton = button.shadowRoot.querySelector("button");
    shadowButton.click();

    expect(clickHandler).toHaveBeenCalledTimes(1);
  });

  it("should not dispatch click event when disabled", () => {
    button.setAttribute("disabled", "");

    const clickHandler = vi.fn();
    button.addEventListener("click", clickHandler);

    const shadowButton = button.shadowRoot.querySelector("button");
    shadowButton.click();

    expect(clickHandler).not.toHaveBeenCalled();
  });

  it("should not dispatch click event when loading", () => {
    button.setAttribute("loading", "");

    const clickHandler = vi.fn();
    button.addEventListener("click", clickHandler);

    const shadowButton = button.shadowRoot.querySelector("button");
    shadowButton.click();

    expect(clickHandler).not.toHaveBeenCalled();
  });
});
