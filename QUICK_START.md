# Quick Start Guide

Get up and running with fvr-components in your project.

## Installation

```bash
npm install vite-web-component-library
```

For React projects, also install React:
```bash
npm install react react-dom
```

## Usage

### Option 1: React (Recommended for React projects)

```tsx
import { Button, Text } from 'vite-web-component-library/react';

function App() {
  return (
    <div>
      <Text text-style="heading-1">Hello World</Text>
      <Button display-type="primary" onClick={() => alert('Clicked!')}>
        Click Me
      </Button>
    </div>
  );
}
```

### Option 2: Vanilla JavaScript

```html
<script type="module">
  import registerAll from 'vite-web-component-library';
  registerAll();
</script>

<fvr-button display-type="primary">Click Me</fvr-button>
<fvr-text text-style="heading-1">Hello World</fvr-text>
```

### Option 3: TypeScript

```typescript
import { registerFvrButton, type FvrButton } from 'vite-web-component-library';
import 'vite-web-component-library/jsx'; // For types

registerFvrButton();

const button = document.querySelector('fvr-button') as FvrButton;
button.addEventListener('click', () => console.log('Clicked!'));
```

## Available Components

### Button
```tsx
<Button
  display-type="primary"  // primary | secondary | tertiary
  action-type="default"   // default | destructive
  loading={false}
  disabled={false}
  onClick={handler}
>
  Button Text
</Button>
```

### Text
```tsx
<Text
  element="p"              // p | span | h1 | h2 | etc.
  text-style="body"        // body | heading-1 | caption | etc.
  color="foreground-primary" // foreground-primary | blue-primary | etc.
>
  Your text here
</Text>
```

### Modal
```tsx
<Modal
  open={isOpen}
  title="Modal Title"
  modal-type="inline"      // inline | mobile-full-screen | mobile-bottom-aligned
  onClose={handleClose}
>
  <Text slot="modal-body">Content</Text>
  <Button slot="modal-buttons">OK</Button>
</Modal>
```

### Button Group
```tsx
<ButtonGroup>
  <Button>One</Button>
  <Button>Two</Button>
</ButtonGroup>
```

## TypeScript Setup

Add to your `tsconfig.json`:
```json
{
  "compilerOptions": {
    "types": ["vite-web-component-library/jsx"]
  }
}
```

Or in a `.d.ts` file:
```typescript
/// <reference types="vite-web-component-library/jsx" />
```

## Next Steps

- See [INTEGRATION.md](./INTEGRATION.md) for framework-specific guides
- See [CLAUDE.md](./CLAUDE.md) for architecture details
- Check `examples/` folder for complete examples
