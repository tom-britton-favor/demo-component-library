# TypeScript & React Integration Implementation Summary

This document summarizes the changes made to enable TypeScript integration and React compatibility for the fvr-components library.

## What Was Implemented

### 1. TypeScript JSX Declarations (`src/jsx.d.ts`)

**Purpose:** Enable type safety and autocomplete for web components in TypeScript/JSX projects.

**Features:**
- Type definitions for all component attributes
- Support for both React 18 and React 19+ (dual namespace declarations)
- Exported types for use in consumer applications
- Base `CustomElementAttributes` interface for common props

**Usage in consumer projects:**
```typescript
/// <reference types="vite-web-component-library/jsx" />
```

### 2. React Wrapper Components (`src/react.tsx`)

**Purpose:** Provide first-class React components that properly handle props, events, and refs.

**Features:**
- React wrappers for all components: `Button`, `Text`, `Modal`, `ButtonGroup`
- Proper prop-to-attribute mapping via custom `useWebComponent` hook
- Event handler support (e.g., `onClick`, `onClose`)
- Ref forwarding with `React.forwardRef`
- Automatic component registration
- Boolean attribute handling

**Key Implementation Details:**
- `useWebComponent` hook converts React props to web component attributes
- Event listeners are registered/cleaned up with `useEffect`
- Works with React 18 and React 19

### 3. Build Configuration (`vite.config.ts`)

**Purpose:** Build both the main library and React wrappers separately.

**Changes:**
- Migrated from `vite.config.js` to `vite.config.ts`
- Added React plugin via `@vitejs/plugin-react`
- Conditional build configuration based on `BUILD_TARGET` environment variable
- Main build: ES + UMD formats for broad compatibility
- React build: ES format only (React ecosystem standard)
- React and ReactDOM externalized in React build
- `emptyOutDir: false` for React build to preserve main library files

**Build Scripts:**
- `npm run build` - Builds both main and React
- `npm run build:main` - Main library only
- `npm run build:react` - React wrappers only

### 4. Package Configuration (`package.json`)

**Changes:**
- Added React dependencies as dev dependencies + optional peer dependencies
- Added TypeScript and Vite React plugin
- Updated exports map:
  - `.` - Main library (ES + UMD + types)
  - `./react` - React wrappers (ES + types)
  - `./jsx` - TypeScript declarations only
- Split build script into separate commands

**Peer Dependencies:**
React and react-dom are optional peer dependencies (won't break non-React users):
```json
"peerDependenciesMeta": {
  "react": { "optional": true },
  "react-dom": { "optional": true }
}
```

### 5. Documentation

**CLAUDE.md Updates:**
- Added "TypeScript Integration" section
- Added "React Integration" section
- Documented JSX declaration patterns
- Documented React wrapper architecture
- Explained when to update types for new components

**New INTEGRATION.md:**
- Comprehensive integration guide for all frameworks
- Examples for Vanilla JS, TypeScript, React, Vue, Angular, Svelte
- Component API reference
- Type reference section

### 6. Examples

**Created example files:**
- `examples/react-example.tsx` - Shows both React wrapper and direct usage
- `examples/typescript-example.ts` - Shows vanilla TypeScript usage with full type safety

## How It Works

### TypeScript Integration Flow

1. **Consumer imports types:**
   ```typescript
   import "vite-web-component-library/jsx";
   ```

2. **TypeScript sees declarations:**
   - `global.JSX.IntrinsicElements` (React 18)
   - `react.JSX.IntrinsicElements` (React 19)

3. **Autocomplete and type checking work:**
   ```tsx
   <fvr-button display-type="primary" loading />
   // TypeScript validates attribute names and values
   ```

### React Integration Flow

1. **Consumer imports React wrapper:**
   ```tsx
   import { Button } from "vite-web-component-library/react";
   ```

2. **Wrapper automatically registers web component:**
   ```typescript
   registerFvrButton(); // Called at module level
   ```

3. **Wrapper manages props and events:**
   - Props → attributes via `useWebComponent` hook
   - Events → event listeners via `useEffect`
   - Ref → forwarded to actual DOM element

4. **React renders web component:**
   ```tsx
   <Button onClick={handler}>Click me</Button>
   // Becomes: <fvr-button> with click listener
   ```

## Architecture Decisions

### Why Separate Builds?

- **Reason:** Vite doesn't support multiple entry points with UMD format
- **Solution:** Two sequential builds with shared output directory
- **Benefit:** Allows UMD for vanilla JS users while providing modern ES modules for React

### Why Optional Peer Dependencies?

- **Reason:** Not all users will need React
- **Solution:** Mark React as optional peer dependency
- **Benefit:** Vanilla JS and other framework users don't get React warnings

### Why Both JSX Declaration Namespaces?

- **Reason:** React 18 uses `JSX.IntrinsicElements`, React 19 uses `react.JSX.IntrinsicElements`
- **Solution:** Declare in both namespaces
- **Benefit:** Works across all React versions

### Why Not Use @lit/react?

- **Reason:** Wanted minimal dependencies and full control
- **Solution:** Built custom lightweight wrappers (~18KB gzipped)
- **Benefit:** No extra dependencies, simpler mental model

## Adding New Components

When you add a new component, update these files:

1. **Component implementation** (`src/components/<name>/index.ts`)
   - Follow standard web component pattern

2. **Main entry** (`src/index.js`)
   - Export class and registration function
   - Add to default export function

3. **JSX types** (`src/jsx.d.ts`)
   - Create attribute interface
   - Add to both JSX.IntrinsicElements declarations
   - Export types

4. **React wrapper** (`src/react.tsx`)
   - Import and register component
   - Create wrapper with forwardRef
   - Map props with useWebComponent
   - Add event handlers if needed
   - Export wrapper

## Testing the Implementation

After building, you can test:

```bash
# Build everything
npm run build

# Check output
ls -la dist/
# Should see: fvr-components.es.js, fvr-components.umd.js, react.es.js

# Test in a React project
npm link
cd ../your-react-app
npm link vite-web-component-library
```

## Benefits

### For TypeScript Users:
- ✅ Full autocomplete for component attributes
- ✅ Type validation in JSX
- ✅ Exported types for use in application code
- ✅ Works in any JSX framework (React, Preact, Solid, etc.)

### For React Users:
- ✅ Props work like normal React props
- ✅ Events work like normal React events
- ✅ Ref forwarding works
- ✅ No manual event listener management
- ✅ Cleaner API

### For Library Maintainers:
- ✅ Framework-agnostic core (web components)
- ✅ Optional framework integrations
- ✅ No framework lock-in
- ✅ Clear separation of concerns

## Limitations & Future Improvements

### Current Limitations:
1. React wrappers are ES modules only (no UMD)
2. Type declarations must be manually maintained (not auto-generated)
3. No React Server Components support (web components require DOM)

### Potential Improvements:
1. Auto-generate TypeScript declarations from component definitions
2. Add Preact-specific wrappers
3. Generate React wrappers automatically from component classes
4. Add StencilJS-style compiler for better DX
5. Add Vue 3 wrappers similar to React wrappers

## Conclusion

The implementation provides excellent TypeScript and React integration while maintaining the library's framework-agnostic nature. TypeScript users get full type safety, and React users get idiomatic React components, all backed by standard web components.
