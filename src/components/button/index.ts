import spinnerIcon from "../../assets/icons/spinner.svg";
import styles from "./button.css?inline";

type DisplayType = "primary" | "secondary" | "tertiary";
type ActionType = "default" | "destructive";

/**
 * Custom button element with configurable display type, action type, and loading state.
 * @customElement
 * @extends HTMLElement
 *
 * @attr {DisplayType} display-type - The visual style of the button (default: "primary")
 * @attr {boolean} disabled - Whether the button is disabled
 * @attr {boolean} loading - Whether the button is in a loading state
 * @attr {ActionType} action-type - The semantic action type of the button, default or destructive (default: "default")
 *
 * @fires FvrButton#click - Fired when the button is clicked (unless disabled or loading)
 */
class FvrButton extends HTMLElement {
  private displayType: DisplayType;
  private disabled: boolean;
  private loading: boolean;
  private actionType: ActionType;

  /**
   * Creates an instance of FvrButton.
   * Initializes the shadow DOM and sets up initial property values.
   */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.displayType = (this.getAttribute("display-type") as DisplayType) || "primary";
    this.disabled = this.hasAttribute("disabled");
    this.loading = this.hasAttribute("loading");
    this.actionType = (this.getAttribute("action-type") as ActionType) || "default";
  }

  /**
   * Specifies the attributes to observe for changes.
   * @returns {string[]} An array of attribute names to observe
   */
  static get observedAttributes(): string[] {
    return ["display-type", "disabled", "loading", "action-type"];
  }

  /**
   * Handles changes to observed attributes.
   * @param {string} name - The name of the attribute that changed
   * @param {string} oldValue - The previous value of the attribute
   * @param {string} newValue - The new value of the attribute
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    switch (name) {
      case "display-type":
        this.displayType = (newValue as DisplayType) || "primary";
        break;
      case "disabled":
        this.disabled = this.hasAttribute("disabled");
        break;
      case "loading":
        this.loading = this.hasAttribute("loading");
        break;
      case "action-type":
        this.actionType = (newValue as ActionType) || "default";
        break;
    }
    this.render();
  }

  /**
   * Lifecycle callback when the element is added to the DOM.
   * Initializes the button's rendered state.
   */
  connectedCallback(): void {
    this.render();
  }

  /**
   * Renders the button's HTML structure and applies current state.
   * @private
   */
  private render(): void {
    this.shadowRoot!.innerHTML = `
      <style>${styles}</style>
      <button
        class="fvrBtn displayType-${this.displayType}${this.loading ? " loading" : ""} actionType-${this.actionType}"
        ${this.disabled || this.loading ? "disabled" : ""}
      >
        <span class="buttonLabel">
          <slot></slot>
        </span>
        ${this.loading ? `<img src="${spinnerIcon}" class="spinner" alt="Loading" />` : ""}
      </button>
    `;
  }
}

/**
 * Registers the FvrButton custom element with the browser.
 * Call this function to make <fvr-button> available in HTML.
 */
const registerFvrButton = (customElementRegistry: CustomElementRegistry = window.customElements): void => {
  if (!customElementRegistry.get("fvr-button")) {
    customElementRegistry.define("fvr-button", FvrButton);
  }
};

export { FvrButton, registerFvrButton };
