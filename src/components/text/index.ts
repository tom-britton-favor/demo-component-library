import styles from "./text.css?inline";

// Define the valid options for each attribute
const VALID_ELEMENTS = [
  "p",
  "span",
  "div",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "label",
  "a",
  "strong",
  "em",
  "i",
  "b",
  "small",
  "mark",
  "del",
  "ins",
  "sub",
  "sup",
  "q",
  "blockquote",
  "cite",
  "dfn",
  "abbr",
  "time",
  "code",
  "var",
  "samp",
  "kbd",
  "pre",
  "address",
  "figcaption",
  "li",
  "dt",
  "dd",
  "th",
  "td",
] as const;

const VALID_TEXT_STYLES = [
  "body",
  "body-bold",
  "title",
  "title-light",
  "caption",
  "caption-bold",
  "heading-1",
  "heading-2",
  "heading-3",
  "heading-4",
  "heading-5",
  "heading-6",
  "heading-6-allcaps",
] as const;

const VALID_COLORS = [
  "background-primary",
  "background-raised",
  "background-recessed",
  "foreground-primary",
  "foreground-secondary",
  "foreground-disabled",
  "foreground-tint",
  "blue-primary",
  "green-primary",
  "yellow-primary",
  "orange-primary",
  "red-primary",
  "gold-primary",
  "gold-secondary",
  "blue-tint-75",
  "green-tint-75",
  "yellow-tint-75",
  "orange-tint-75",
  "red-tint-75",
  "blue-tint-25",
  "green-tint-25",
  "yellow-tint-25",
  "orange-tint-25",
  "red-tint-25",
  "blue-tint-08",
  "green-tint-08",
  "yellow-tint-08",
  "orange-tint-08",
  "red-tint-08",
  "heb-red-primary",
  "heb-red-dark",
  "heb-red-light",
] as const;

// Define types based on the valid options
type TextContainingElement = (typeof VALID_ELEMENTS)[number];
type TextStyle = (typeof VALID_TEXT_STYLES)[number];
type Color = (typeof VALID_COLORS)[number];

class FvrText extends HTMLElement {
  // Static Sets for efficient lookups
  // Using Sets instead of arrays provides O(1) lookup time, which is crucial for performance
  // when validating attributes, especially with many FvrText instances on a page
  private static validElements = new Set<TextContainingElement>(VALID_ELEMENTS);
  private static validTextStyles = new Set<TextStyle>(VALID_TEXT_STYLES);
  private static validColors = new Set<Color>(VALID_COLORS);

  // Private fields with default values
  // This reduces the need for null checks and provides a clear initial state
  private _element: TextContainingElement = "p";
  private _textStyle: TextStyle = "body";
  private _color: Color = "foreground-primary";

  constructor() {
    super();
    // Create a shadow DOM for encapsulation
    this.attachShadow({ mode: "open" });
  }

  // Specify which attributes should be observed for changes
  static get observedAttributes(): string[] {
    return ["element", "text-style", "color"];
  }

  // Called when observed attributes change
  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    // Only update and re-render if the value has actually changed
    if (oldValue === newValue) return;

    switch (name) {
      case "element":
        this._element = FvrText.getValidElement(newValue);
        break;
      case "text-style":
        this._textStyle = FvrText.getValidTextStyle(newValue);
        break;
      case "color":
        this._color = FvrText.getValidColor(newValue);
        break;
    }
    this.render();
  }

  // Called when the element is added to the DOM
  connectedCallback(): void {
    // Initialize attributes when the element is connected to the DOM
    this._element = FvrText.getValidElement(this.getAttribute("element"));
    this._textStyle = FvrText.getValidTextStyle(
      this.getAttribute("text-style"),
    );
    this._color = FvrText.getValidColor(this.getAttribute("color"));
    this.render();
  }

  // Static methods for attribute validation
  // Using static methods allows for efficient validation without creating instances
  // This is particularly beneficial when used in the constructor or static contexts
  private static getValidElement(value: string | null): TextContainingElement {
    return FvrText.validElements.has(value as TextContainingElement)
      ? (value as TextContainingElement)
      : "p";
  }

  private static getValidTextStyle(value: string | null): TextStyle {
    return FvrText.validTextStyles.has(value as TextStyle)
      ? (value as TextStyle)
      : "body";
  }

  private static getValidColor(value: string | null): Color {
    return FvrText.validColors.has(value as Color)
      ? (value as Color)
      : "foreground-primary";
  }

  // Render method to update the component's DOM
  private render(): void {
    if (this.shadowRoot) {
      // Using template literals for efficient string concatenation
      this.shadowRoot.innerHTML = `
        <style>${styles}</style>
        <${this._element} class="fvrText color-${this._color} text-style-${this._textStyle}">
          <slot></slot>
        </${this._element}>
      `;
    }
  }
}

// Register the custom element
const registerFvrText = (
  customElementRegistry: CustomElementRegistry = window.customElements,
): void => {
  if (!customElementRegistry.get("fvr-text")) {
    customElementRegistry.define("fvr-text", FvrText);
  }
};

export { FvrText, registerFvrText };

// Usage example:
// <fvr-text element="h1" text-style="heading-1" color="blue-primary">Hello, World!</fvr-text>
