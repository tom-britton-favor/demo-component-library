import styles from "./modal.css?inline";
import { registerFvrText } from "../text";
import { registerFvrButton } from "../button";

type ModalType = "inline" | "mobile-full-screen" | "mobile-bottom-aligned";

class FvrModal extends HTMLElement {
  private isOpen: boolean;
  private modalType: ModalType;
  private modalTitle = "Modal Title";
  private dialogElement: HTMLDialogElement;
  private pendingOpen = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  /**
   * Specifies the attributes to observe for changes.
   * @returns {string[]} An arrof attribute names to observe.
   */
  static get observedAttributes(): string[] {
    return ["open", "modal-type", "title"];
  }

  /**
   * Handles changes to observed attributes.
   * @param {string} name - The name of the attribute that changed
   * @param {string} oldValue - The previous value of the attribute
   * @param {string} newValue - The new value of the attribute
   */
  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string,
  ): void {
    if (oldValue === newValue) return;
    switch (name) {
      case "open":
        this.isOpen = this.hasAttribute("open");
        // Unintuitively the attributeChangedCallback executes before connectedCallback.
        if (this.dialogElement) {
          this.updateModalState();
        } else {
          this.pendingOpen = this.isOpen;
        }
        break;
      case "title":
        this.modalTitle = newValue;
        this.updateModalContent();
        break;
      case "modal-type":
        this.modalType = newValue as ModalType;
        this.updateModalContent();
        break;
    }
  }

  /**
   * Lifecycle callback when the element is added to the DOM.
   * Initializes the button's rendered state.
   */
  connectedCallback(): void {
    this.isOpen = this.hasAttribute("open");
    this.modalType = (this.getAttribute("modal-type") as ModalType) || "inline";
    this.modalTitle = this.getAttribute("title") || "Modal Title";

    registerFvrText();
    registerFvrButton();

    this.render();
    this.dialogElement = this.shadowRoot.querySelector("dialog");

    if (this.pendingOpen) {
      this.updateModalState();
      this.pendingOpen = false;
    }
  }

  private updateModalState(): void {
    if (!this.dialogElement) {
      return;
    }

    if (this.isOpen) {
      this.dialogElement.showModal();
    } else {
      this.dialogElement.close();
    }
  }

  private updateModalContent(): void {
    if (!this.dialogElement) {
      return;
    }

    this.dialogElement.className = `modal ${this.modalType || "inline"}`;
    const titleElement = this.shadowRoot.getElementById("fvr-modal-title");
    if (titleElement) {
      titleElement.setAttribute("text-content", this.modalTitle);
    }
  }

  /**
   * Renders the button's HTML structure and applies current state.
   * @private
   */
  private render(): void {
    this.shadowRoot.innerHTML = `
      <style>
        ${styles}
      </style>
      <dialog
        class="modal ${this.modalType || "inline"}"
      >
        <fvr-text id="fvr-modal-title" element="h2" text-style="heading-4">${this.modalTitle}</fvr-text>
        <slot name="modal-body"></slot>
        <slot name="modal-buttons"></slot>
      </dialog>
    `;
  }
}

/**
 * Registers the custom element with the browser.
 * Call this function to make <fvr-button> available in HTML.
 */
const registerFvrModal = (
  customElementRegistry: CustomElementRegistry = window.customElements,
): void => {
  if (!customElementRegistry.get("fvr-modal")) {
    customElementRegistry.define("fvr-modal", FvrModal);
  }
};

export { FvrModal, registerFvrModal };
