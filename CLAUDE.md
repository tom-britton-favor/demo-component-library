# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vite-based web component library that builds framework-agnostic custom elements with the `fvr-` prefix. Components are built using TypeScript, Shadow DOM, and scoped CSS, then distributed as ES, UMD, and CJS modules.

## Development Commands

### Building
- `npm run build` - Runs code generation, then builds main library and React wrappers (outputs to `dist/`)
- `npm run build:main` - Builds main library only
- `npm run build:react` - Builds React wrappers only
- `npm run generate:types` - Generates TypeScript declarations and React wrappers from component source
- Main entry: `src/index.js` → `dist/fvr-components.{es,umd}.js`
- React entry: `src/react.tsx` → `dist/react.es.js`
- Build system uses environment variable `BUILD_TARGET=react` to switch between builds
- The React build doesn't empty the dist folder to preserve main library files
- **Important**: `src/jsx.d.ts` and `src/react.tsx` are AUTO-GENERATED - do not edit manually

### Testing
- `npm test` - Runs Vitest tests with jsdom environment
- Test files: `*.test.ts` alongside component files
- Global test setup: `setupTests.js`

### Storybook
- `npm run storybook` - Runs Storybook dev server on port 6006
- `npm run build-storybook` - Builds static Storybook
- Stories: `*.stories.ts` alongside component files

### Component Generation
- `npm run generate <component-name>` - Scaffolds a new component from templates
  - Creates `src/components/<component-name>/` directory
  - Generates: `index.ts`, `<component-name>.css`, `<component-name>.stories.ts`, `<component-name>.test.ts`
  - Uses templates from `templates/` directory
  - Converts component name to PascalCase for class names
  - **After creating a component, run `npm run generate:types` to create TypeScript types and React wrappers**

## Code Generation

**IMPORTANT**: `src/generated/jsx.d.ts` and `src/generated/react.tsx` are automatically generated files.

### What Is Generated

The `scripts/generate-types.cjs` script analyzes component source files and generates:
1. **TypeScript JSX declarations** (`src/generated/jsx.d.ts`) - Type definitions for all components
2. **React wrapper components** (`src/generated/react.tsx`) - First-class React components

### How It Works

The generator extracts from component files:
- Class name and tag name
- Observed attributes from `observedAttributes()` array
- Type definitions (e.g., `type DisplayType = ...`)
- Const arrays (e.g., `const VALID_ELEMENTS = [...]`)
- Events (from `dispatchEvent` patterns)
- Registration functions

### When to Run

- **Automatically**: Runs before every build (`npm run build`)
- **Watch mode**: Run `npm run generate:watch` to auto-regenerate on component file changes
- **Manually**: Run `npm run generate:types` after modifying component attributes or types
- **After creating a component**: Run after using `npm run generate <name>`

### Generated File Location

Generated files are in `src/generated/` and are **gitignored** (not tracked in version control).

After cloning the repository, run `npm run generate:types` or `npm run build` to create them.

### Generated File Rules

- **DO NOT** manually edit files in `src/generated/`
- Changes will be overwritten on next generation
- The component source files are the single source of truth
- See `CODE_GENERATION.md` and `GENERATED_FILES.md` for detailed documentation

### Development Workflow

**Recommended approach with watch mode:**
```bash
# Terminal 1: Auto-regenerate types on component changes
npm run generate:watch

# Terminal 2: Development server
npm run storybook
```

Edit components → Types automatically regenerate!

## Architecture

### Component Structure

All components follow this standard pattern:

1. **Custom Element Class** - Extends `HTMLElement` with Shadow DOM
   - Named `Fvr<ComponentName>` (PascalCase)
   - Uses Shadow DOM (`attachShadow({ mode: "open" })`)
   - Implements lifecycle callbacks: `connectedCallback()`, `attributeChangedCallback()`
   - Private `render()` method updates `shadowRoot.innerHTML`

2. **Registration Function** - `registerFvr<ComponentName>()`
   - Checks if element already registered before defining
   - Accepts optional `CustomElementRegistry` parameter (defaults to `window.customElements`)
   - Custom element tag: `fvr-<component-name>` (kebab-case)

3. **CSS Imports** - Component styles imported with `?inline` suffix
   - Example: `import styles from "./button.css?inline"`
   - Injected into Shadow DOM via `<style>${styles}</style>`

4. **Asset Imports** - SVG and other assets imported directly
   - Example: `import spinnerIcon from "../../assets/icons/spinner.svg"`

### Component Dependencies

Components may depend on other components:
- Import and call registration functions in `connectedCallback()`
- Example: Modal component registers `FvrText` and `FvrButton` before rendering

### Library Entry Point

`src/index.js` serves as the main entry:
- Exports all component classes and registration functions individually
- Default export is a function that registers all components at once
- New components must be manually added to this file (not auto-generated)

### Observed Attributes Pattern

Components use `static get observedAttributes()` to declare reactive attributes:
- Attribute changes trigger `attributeChangedCallback()`
- Always check `oldValue === newValue` to avoid unnecessary renders
- Store attribute state as private class properties
- Call `render()` after updating state

### Attribute Types

- Boolean attributes: Check with `hasAttribute()` (not `getAttribute()`)
- String attributes: Cast to specific types (e.g., `as DisplayType`)
- Update attributes via `setAttribute()`, `removeAttribute()`, or `toggleAttribute()`

## Important Patterns

### Lifecycle Timing

The modal component demonstrates an important timing issue:
- `attributeChangedCallback()` executes **before** `connectedCallback()`
- If initial attribute changes need rendered DOM, use a `pending` flag pattern
- Check if elements exist before manipulating them in `attributeChangedCallback()`

### Rendering Pattern

Components follow this render pattern:
1. Set `shadowRoot.innerHTML` with template literal
2. Include `<style>${styles}</style>` at the top
3. Use conditional rendering with template literals (e.g., `${condition ? html : ''}`)
4. Query rendered elements after setting innerHTML (e.g., `this.shadowRoot.querySelector()`)

### Slots

Components use named slots for composability:
- Example: Modal uses `<slot name="modal-body">` and `<slot name="modal-buttons">`
- Default slot: `<slot></slot>` for primary content

## Type Declarations

The library exports TypeScript type declarations:
- Output: `dist/types/index.d.ts`
- Include path: `src/**/*`
- TypeScript config: `tsconfig.json`

## Distribution

Package exports configuration in `package.json`:
- Main (UMD): `./dist/fvr-components.umd.js`
- Module (ES): `./dist/fvr-components.es.js`
- Types: `./dist/types/index.d.ts`
- React wrappers: `./dist/react.{es,umd}.js` (types: `./dist/types/react.d.ts`)
- JSX types only: `./dist/types/jsx.d.ts`
- Only `dist/` directory is included in published package

## TypeScript Integration

### Using in TypeScript Projects

The library includes TypeScript declaration files that provide type safety for custom elements in JSX/TSX files.

**Automatic JSX Support (TypeScript/React):**

Import the JSX types in your project's type declarations:

```typescript
// In your tsconfig.json or a global.d.ts file
/// <reference types="vite-web-component-library/jsx" />
```

Or import directly in files where you use the components:

```typescript
import "vite-web-component-library/jsx";
```

This enables type checking and autocomplete for all fvr- components in JSX:

```tsx
<fvr-button display-type="primary" loading disabled>
  Click me
</fvr-button>
```

**Type Exports:**

All component attribute types are exported from `src/jsx.d.ts`:
- `FvrButtonAttributes`
- `FvrTextAttributes`
- `FvrButtonGroupAttributes`
- `FvrModalAttributes`
- Plus utility types like `TextStyle`, `Color`, `DisplayType`, etc.

### JSX Declaration Pattern

The `src/jsx.d.ts` file extends both `JSX.IntrinsicElements` (for React 18) and `react.JSX.IntrinsicElements` (for React 19+) to ensure compatibility across React versions.

When adding new components, update `src/jsx.d.ts`:
1. Create an interface for component attributes extending `CustomElementAttributes`
2. Add the interface to both `JSX.IntrinsicElements` declarations
3. Export the interface type

## React Integration

### Using React Wrapper Components

The library provides first-class React components that wrap the web components for better React integration.

**Installation:**

```bash
npm install vite-web-component-library react react-dom
```

**Usage:**

```tsx
import { Button, Text, Modal, ButtonGroup } from "vite-web-component-library/react";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button
        display-type="primary"
        onClick={() => setIsOpen(true)}
      >
        Open Modal
      </Button>

      <Modal
        open={isOpen}
        title="My Modal"
        onClose={() => setIsOpen(false)}
      >
        <Text slot="modal-body" text-style="body">
          Modal content here
        </Text>
      </Modal>
    </div>
  );
}
```

**React Wrapper Benefits:**
- Proper prop-to-property mapping (not just attributes)
- Event handlers work as React props (`onClick`, `onClose`)
- TypeScript types included
- Ref forwarding support
- Automatic component registration

### React Wrapper Architecture

`src/react.tsx` contains React wrapper components built with:
- `React.forwardRef` for ref forwarding
- `useWebComponent` custom hook for prop-to-attribute mapping
- `useEffect` for event listener registration
- Proper cleanup on unmount

**Pattern for wrapping components:**
1. Import the web component class and registration function
2. Call registration function at module level
3. Create interface extending component attributes from `jsx.d.ts`
4. Use `forwardRef` with proper typing
5. Use `useWebComponent` hook to sync props to attributes
6. Add event listeners with `useEffect` for custom events

**When adding React wrappers for new components:**
- Add to `src/react.tsx`
- Follow the existing wrapper pattern
- Export both the wrapper and the underlying web component class
- React wrappers are optional peer dependencies

### Direct Web Component Usage in React

React 19+ has improved web component support, allowing direct usage:

```tsx
import "vite-web-component-library";
import "vite-web-component-library/jsx"; // For TypeScript types

function App() {
  const buttonRef = useRef<FvrButton>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handler = (e) => console.log("clicked", e);
    button.addEventListener("click", handler);
    return () => button.removeEventListener("click", handler);
  }, []);

  return <fvr-button ref={buttonRef}>Click me</fvr-button>;
}
```

Note: React 18 has limitations with complex props and events, so React wrappers are recommended for React 18 projects.
