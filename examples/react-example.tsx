/**
 * React Example - Using fvr-components in React
 *
 * This example demonstrates both approaches to using fvr-components in React:
 * 1. Using React wrapper components (recommended)
 * 2. Using web components directly
 */

import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// Approach 1: Using React wrappers (recommended)
import { Button, Text, Modal, ButtonGroup } from '../src/generated/react.tsx';

// Approach 2: Direct web component usage (for comparison)
import { registerFvrButton, type FvrButton } from '../src/index.js';
import '../src/generated/jsx.d.ts'; // For TypeScript types

function ReactWrapperExample() {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('Saved!');
    }, 2000);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>React Wrapper Example</h2>

      <Text element="p" text-style="body">
        This example uses React wrapper components for seamless integration.
      </Text>

      <ButtonGroup>
        <Button
          display-type="primary"
          loading={loading}
          onClick={handleSave}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>

        <Button
          display-type="secondary"
          onClick={() => setModalOpen(true)}
        >
          Open Modal
        </Button>
      </ButtonGroup>

      <Modal
        open={modalOpen}
        title="Confirm Action"
        modal-type="inline"
        onClose={() => setModalOpen(false)}
      >
        <Text slot="modal-body" text-style="body">
          Are you sure you want to proceed?
        </Text>
        <ButtonGroup slot="modal-buttons">
          <Button
            display-type="primary"
            onClick={() => setModalOpen(false)}
          >
            Confirm
          </Button>
          <Button
            display-type="secondary"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </Modal>
    </div>
  );
}

function DirectWebComponentExample() {
  const buttonRef = useRef<FvrButton>(null);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    // Register the component
    registerFvrButton();

    const button = buttonRef.current;
    if (!button) return;

    const handleClick = (e: Event) => {
      console.log('Direct web component clicked', e);
      setClickCount(prev => prev + 1);
    };

    button.addEventListener('click', handleClick);
    return () => button.removeEventListener('click', handleClick);
  }, []);

  return (
    <div style={{ padding: '20px', marginTop: '20px', borderTop: '1px solid #ccc' }}>
      <h2>Direct Web Component Example</h2>

      <p>
        This example uses web components directly with manual event handling.
        Clicked {clickCount} times.
      </p>

      <fvr-button
        ref={buttonRef}
        display-type="secondary"
      >
        Click me (Direct)
      </fvr-button>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>fvr-components React Integration Examples</h1>
      <ReactWrapperExample />
      <DirectWebComponentExample />
    </div>
  );
}

// Mount the app
const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<App />);
}

export default App;
