import styles from "./text.css?inline";

class FvrText extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.element = this.getAttribute("element") || "p";
    this.textStyle = this.getAttribute("text-style") || "body";
    this.color = this.getAttribute("color") || "foreground-primary";
  }

  /**
   * Specifies the attributes to observe for changes.
   * @returns {string[]} An array of attribute names to observe
   */
  static get observedAttributes() {
    return ['element', 'text-style', 'color'];
  }

  /**
   * Handles changes to observed attributes.
   * @param {string} name - The name of the attribute that changed
   * @param {string} oldValue - The previous value of the attribute
   * @param {string} newValue - The new value of the attribute
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'element':
        this.element = newValue;
        break;
      case 'text-style':
        this.textStyle = newValue;
        break;
      case 'color':
        this.color = newValue;
        break;
    }
    this.render();
  }

  /**
   * Lifecycle callback when the element is added to the DOM.
   * Initializes the button's rendered state.
   */
  connectedCallback() {
    this.render();
  }

  /**
   * Renders the component's HTML structure and applies current state.
   * @private
   */
  render() {
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <${this.element} class="fvrText color-${this.color} text-style-${this.textStyle}">
        <slot></slot>
      </${this.element}>
    `;
  }
}

const registerFvrText = (customElementRegistry = window.customElements) => {
  if (!customElementRegistry.get("fvr-text")) {
    customElementRegistry.define("fvr-text", FvrText);
  }
};

export { FvrText, registerFvrText };