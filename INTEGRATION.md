# Integration Guide

This guide covers how to integrate the fvr-components library into different project types.

## Table of Contents

- [Vanilla HTML/JavaScript](#vanilla-htmljavascript)
- [TypeScript Projects](#typescript-projects)
- [React Projects](#react-projects)
- [Other Frameworks](#other-frameworks)

## Vanilla HTML/JavaScript

### Installation

```bash
npm install vite-web-component-library
```

### Usage

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <fvr-button display-type="primary">Click me</fvr-button>

  <script type="module">
    import registerAll from 'vite-web-component-library';
    // Register all components
    registerAll();
  </script>
</body>
</html>
```

Or register components individually:

```javascript
import { registerFvrButton, registerFvrText } from 'vite-web-component-library';

registerFvrButton();
registerFvrText();

// Now you can use <fvr-button> and <fvr-text>
```

## TypeScript Projects

### Installation

```bash
npm install vite-web-component-library
```

### Setup Type Declarations

Create or update a `global.d.ts` file in your project:

```typescript
/// <reference types="vite-web-component-library/jsx" />
```

Or add to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vite-web-component-library/jsx"]
  }
}
```

### Usage in TypeScript

```typescript
import { registerFvrButton, FvrButton } from 'vite-web-component-library';

registerFvrButton();

// Get element with proper typing
const button = document.querySelector('fvr-button') as FvrButton;

// Set properties
button.setAttribute('display-type', 'primary');
button.setAttribute('loading', '');

// Listen to events
button.addEventListener('click', (e) => {
  console.log('Button clicked', e);
});
```

### Usage in TSX (without React)

```tsx
import { registerFvrButton } from 'vite-web-component-library';
import 'vite-web-component-library/jsx';

registerFvrButton();

// TypeScript will provide autocomplete and type checking
const MyComponent = () => (
  <fvr-button display-type="primary" loading>
    Click me
  </fvr-button>
);
```

## React Projects

### Installation

```bash
npm install vite-web-component-library react react-dom
```

### Recommended: Use React Wrappers

The easiest way to use the components in React:

```tsx
import { Button, Text, Modal, ButtonGroup } from 'vite-web-component-library/react';
import { useState } from 'react';

function App() {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div>
      <ButtonGroup>
        <Button
          display-type="primary"
          loading={loading}
          onClick={handleClick}
        >
          Save Changes
        </Button>
        <Button
          display-type="secondary"
          onClick={() => setModalOpen(true)}
        >
          Cancel
        </Button>
      </ButtonGroup>

      <Modal
        open={modalOpen}
        title="Confirm Action"
        modal-type="inline"
        onClose={() => setModalOpen(false)}
      >
        <Text slot="modal-body">Are you sure?</Text>
        <ButtonGroup slot="modal-buttons">
          <Button display-type="primary">Yes</Button>
          <Button display-type="secondary">No</Button>
        </ButtonGroup>
      </Modal>
    </div>
  );
}
```

### Alternative: Direct Web Component Usage

For React 19+ projects, you can use web components directly:

```tsx
import 'vite-web-component-library';
import 'vite-web-component-library/jsx';
import { useRef, useEffect } from 'react';
import type { FvrButton } from 'vite-web-component-library';

function App() {
  const buttonRef = useRef<FvrButton>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleClick = (e: Event) => {
      console.log('Clicked', e);
    };

    button.addEventListener('click', handleClick);
    return () => button.removeEventListener('click', handleClick);
  }, []);

  return (
    <fvr-button
      ref={buttonRef}
      display-type="primary"
    >
      Click me
    </fvr-button>
  );
}
```

**Note:** React 18 has limitations with web components (complex props, events). Use React wrappers for React 18 projects.

## Other Frameworks

### Vue 3

Vue has excellent web component support:

```vue
<template>
  <fvr-button
    display-type="primary"
    :loading="isLoading"
    @click="handleClick"
  >
    {{ buttonText }}
  </fvr-button>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { registerFvrButton } from 'vite-web-component-library';

const isLoading = ref(false);
const buttonText = ref('Click me');

onMounted(() => {
  registerFvrButton();
});

const handleClick = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
};
</script>
```

For TypeScript support in Vue:

```typescript
// vite-env.d.ts or global.d.ts
/// <reference types="vite-web-component-library/jsx" />
```

### Angular

Angular requires custom elements schema:

```typescript
// app.module.ts or standalone component
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { registerFvrButton } from 'vite-web-component-library';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // ...
})
export class AppModule {
  constructor() {
    registerFvrButton();
  }
}
```

Usage in template:

```html
<fvr-button
  display-type="primary"
  [attr.loading]="isLoading ? '' : null"
  (click)="handleClick()"
>
  Click me
</fvr-button>
```

### Svelte

Svelte works well with web components:

```svelte
<script>
  import { onMount } from 'svelte';
  import { registerFvrButton } from 'vite-web-component-library';

  let loading = false;

  onMount(() => {
    registerFvrButton();
  });

  function handleClick() {
    loading = true;
    setTimeout(() => loading = false, 2000);
  }
</script>

<fvr-button
  display-type="primary"
  loading={loading}
  on:click={handleClick}
>
  Click me
</fvr-button>
```

## Component Reference

### FvrButton

**Attributes:**
- `display-type`: `"primary" | "secondary" | "tertiary"` (default: `"primary"`)
- `action-type`: `"default" | "destructive"` (default: `"default"`)
- `disabled`: boolean
- `loading`: boolean

**Events:**
- `click`: Fired when button is clicked (unless disabled or loading)

### FvrText

**Attributes:**
- `element`: HTML element to render as (default: `"p"`)
- `text-style`: Style variant (default: `"body"`)
- `color`: Color variant (default: `"foreground-primary"`)

### FvrButtonGroup

Simple container for grouping buttons.

**Slots:**
- Default slot for buttons

### FvrModal

**Attributes:**
- `open`: boolean - Controls modal visibility
- `modal-type`: `"inline" | "mobile-full-screen" | "mobile-bottom-aligned"`
- `title`: Modal title text

**Slots:**
- `modal-body`: Main content area
- `modal-buttons`: Button area at bottom

**Events:**
- `close`: Fired when modal is closed

## TypeScript Type Reference

Import types for use in your code:

```typescript
import type {
  FvrButtonAttributes,
  FvrTextAttributes,
  FvrModalAttributes,
  DisplayType,
  ActionType,
  TextStyle,
  Color,
} from 'vite-web-component-library/jsx';
```
