/**
 * TypeScript Example - Using fvr-components in vanilla TypeScript
 *
 * This example demonstrates how to use the components in a TypeScript project
 * with full type safety and autocomplete.
 */

import {
  registerFvrButton,
  registerFvrText,
  registerFvrModal,
  FvrButton,
  FvrText,
  FvrModal,
} from '../src/index.js';

// Import types for TypeScript autocomplete and validation
import type {
  DisplayType,
  ActionType,
  TextStyle,
  Color,
} from '../src/jsx.d.ts';

// Register components
registerFvrButton();
registerFvrText();
registerFvrModal();

class TypeScriptExample {
  private container: HTMLElement;
  private modal: FvrModal | null = null;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container;
    this.init();
  }

  private init(): void {
    this.container.innerHTML = `
      <div class="example">
        <h2>TypeScript Integration Example</h2>
        <div id="button-container"></div>
        <div id="modal-container"></div>
      </div>
    `;

    this.createButtons();
    this.createModal();
  }

  private createButtons(): void {
    const buttonContainer = document.getElementById('button-container');
    if (!buttonContainer) return;

    // Create a primary button with full type safety
    const primaryButton = this.createButton({
      displayType: 'primary',
      actionType: 'default',
      text: 'Primary Button',
      onClick: () => this.handlePrimaryClick(),
    });

    // Create a destructive button
    const destructiveButton = this.createButton({
      displayType: 'secondary',
      actionType: 'destructive',
      text: 'Delete',
      onClick: () => this.showModal(),
    });

    buttonContainer.appendChild(primaryButton);
    buttonContainer.appendChild(destructiveButton);
  }

  private createButton(options: {
    displayType: DisplayType;
    actionType: ActionType;
    text: string;
    onClick: () => void;
  }): FvrButton {
    const button = document.createElement('fvr-button') as FvrButton;

    // TypeScript knows these are valid attributes
    button.setAttribute('display-type', options.displayType);
    button.setAttribute('action-type', options.actionType);
    button.textContent = options.text;

    // Type-safe event listener
    button.addEventListener('click', (e: Event) => {
      console.log('Button clicked:', e);
      options.onClick();
    });

    return button;
  }

  private handlePrimaryClick(): void {
    console.log('Primary button clicked');

    // Find the button and set it to loading state
    const button = this.container.querySelector(
      'fvr-button[display-type="primary"]'
    ) as FvrButton;

    if (button) {
      button.setAttribute('loading', '');

      // Simulate async operation
      setTimeout(() => {
        button.removeAttribute('loading');
        this.showNotification('Operation completed!', 'green-primary');
      }, 2000);
    }
  }

  private createModal(): void {
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;

    const modal = document.createElement('fvr-modal') as FvrModal;
    modal.setAttribute('title', 'Confirm Delete');
    modal.setAttribute('modal-type', 'inline');

    // Create modal body text with type-safe attributes
    const bodyText = document.createElement('fvr-text') as FvrText;
    bodyText.setAttribute('slot', 'modal-body');
    bodyText.setAttribute('text-style', 'body');
    bodyText.textContent = 'Are you sure you want to delete this item?';

    // Create modal buttons
    const confirmButton = this.createButton({
      displayType: 'primary',
      actionType: 'destructive',
      text: 'Confirm Delete',
      onClick: () => this.handleDelete(),
    });
    confirmButton.setAttribute('slot', 'modal-buttons');

    const cancelButton = this.createButton({
      displayType: 'secondary',
      actionType: 'default',
      text: 'Cancel',
      onClick: () => this.hideModal(),
    });
    cancelButton.setAttribute('slot', 'modal-buttons');

    modal.appendChild(bodyText);
    modal.appendChild(confirmButton);
    modal.appendChild(cancelButton);

    modalContainer.appendChild(modal);
    this.modal = modal;
  }

  private showModal(): void {
    if (this.modal) {
      this.modal.setAttribute('open', '');
    }
  }

  private hideModal(): void {
    if (this.modal) {
      this.modal.removeAttribute('open');
    }
  }

  private handleDelete(): void {
    console.log('Deleting...');
    this.hideModal();
    this.showNotification('Item deleted', 'red-primary');
  }

  private showNotification(message: string, color: Color): void {
    const notification = document.createElement('fvr-text') as FvrText;
    notification.setAttribute('text-style', 'body-bold');
    notification.setAttribute('color', color);
    notification.textContent = message;
    notification.style.marginTop = '20px';
    notification.style.display = 'block';

    this.container.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize the example when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new TypeScriptExample('root');
  });
} else {
  new TypeScriptExample('root');
}

export default TypeScriptExample;
