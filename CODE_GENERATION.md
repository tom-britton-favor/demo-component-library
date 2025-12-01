# Code Generation System

This project uses **automatic code generation** to create TypeScript JSX declarations and React wrapper components from web component source files.

## Overview

Instead of manually maintaining `src/jsx.d.ts` and `src/react.tsx`, these files are **automatically generated** during the build process by analyzing your component source code.

### Benefits

✅ **No manual maintenance** - Types and React wrappers stay in sync with components
✅ **Single source of truth** - Component definitions drive everything
✅ **Fewer bugs** - No risk of forgetting to update types when adding attributes
✅ **Faster development** - Add a new component, run build, types are ready

## How It Works

### 1. Component Analysis

The generator (`scripts/generate-types.cjs`) scans `src/components/` and extracts:

- **Class name** (e.g., `FvrButton`)
- **Tag name** (e.g., `fvr-button`)
- **Observed attributes** from `observedAttributes()` array
- **Type definitions** (e.g., `type DisplayType = ...`)
- **Const arrays** (e.g., `const VALID_ELEMENTS = [...]`)
- **Custom events** (from `dispatchEvent` calls)
- **Registration function** (e.g., `registerFvrButton`)

### 2. Type Generation

From the extracted metadata, it generates `src/jsx.d.ts`:

```typescript
// Type definitions extracted from components
type DisplayType = "primary" | "secondary" | "tertiary";

// Attribute interfaces
interface FvrButtonAttributes extends CustomElementAttributes {
  "display-type"?: DisplayType;
  "disabled"?: boolean;
  "loading"?: boolean;
}

// JSX declarations for React 18 & 19+
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "fvr-button": FvrButtonAttributes;
    }
  }
}
```

### 3. React Wrapper Generation

It also generates `src/react.tsx` with proper React components:

```typescript
export const Button = React.forwardRef<FvrButton, ReactButtonProps>(
  ({ children, onClick, ...props }, forwardedRef) => {
    const internalRef = useRef<FvrButton>(null);
    const ref = forwardedRef || internalRef;

    useWebComponent(ref, props);

    useEffect(() => {
      // Event listeners
    }, [ref, onClick]);

    return (
      <fvr-button ref={ref} {...props}>
        {children}
      </fvr-button>
    );
  }
);
```

## Usage

### During Development

When you create a new component or modify attributes:

```bash
npm run generate:types
```

This regenerates the TypeScript and React files based on current component code.

### During Build

The build process automatically runs code generation first:

```bash
npm run build
# Runs: generate:types → build:main → build:react
```

### Component Template Generator

Use the existing component generator to scaffold new components:

```bash
npm run generate <component-name>
```

Then run `npm run generate:types` to create types and React wrappers.

## What Gets Extracted

### Attributes

From `static get observedAttributes()`:

```typescript
static get observedAttributes(): string[] {
  return ["display-type", "disabled", "loading"];
}
```

Becomes:

```typescript
interface FvrButtonAttributes {
  "display-type"?: DisplayType;
  "disabled"?: boolean;
  "loading"?: boolean;
}
```

### Type Definitions

From type aliases:

```typescript
type DisplayType = "primary" | "secondary" | "tertiary";
```

Extracted and included in JSX declarations.

### Const Arrays

From `as const` arrays:

```typescript
const VALID_ELEMENTS = [
  "p", "span", "div", "h1", // ...
] as const;
```

Converted to union types:

```typescript
type Elements = "p" | "span" | "div" | "h1" // ...
```

### Type Inference

The generator infers appropriate TypeScript types:

- **Boolean attributes**: `disabled`, `loading`, `open` → `boolean`
- **Enum-like**: Matches to extracted type definitions
- **Element types**: Special handling for `element` attribute
- **Fallback**: `string` for unknown attributes

### Event Detection

Detects custom events for React wrappers:

```typescript
// In component
dispatchEvent(new CustomEvent('close'));

// Generated in React wrapper
interface ReactModalProps {
  onClose?: (event: Event) => void;
}
```

## Generated File Structure

### src/jsx.d.ts

```
1. Auto-generation header
2. Component class imports
3. React type imports
4. Extracted type definitions
5. CustomElementAttributes base interface
6. Component attribute interfaces (one per component)
7. Global JSX namespace declaration (React 18)
8. React module declaration (React 19+)
9. Type exports
```

### src/react.tsx

```
1. Auto-generation header
2. React imports
3. Component and registration function imports
4. Type imports from jsx.d.ts
5. Component registrations (module level)
6. useWebComponent helper hook
7. React wrapper components (one per component)
8. Component class exports
```

## Type Inference Rules

The generator uses these rules to determine attribute types:

1. **Known booleans**: `disabled`, `loading`, `open` → `boolean`
2. **Component context**: `element` in `FvrText` → `TextContainingElement`
3. **PascalCase match**: `display-type` → looks for `DisplayType`
4. **Partial match**: `text-style` → looks for type containing `Style`
5. **Default**: `string`

## Customizing Generation

### Adding New Patterns

To teach the generator about new patterns, edit `scripts/generate-types.cjs`:

```javascript
function inferAttributeType(attrName, types, className) {
  // Add custom logic here
  if (attrName === 'my-special-attr') {
    return 'MySpecialType';
  }
  // ...existing logic
}
```

### Excluding Types

Some types might be extracted that shouldn't be exported. You can filter in the generation function:

```javascript
const typesToExclude = ['InternalType', 'HelperType'];
for (const [typeName, typeValue] of Object.entries(allTypes)) {
  if (!typesToExclude.includes(typeName)) {
    lines.push(`type ${typeName} = ${typeValue};`);
  }
}
```

## Workflow

### Adding a New Component

1. **Generate component scaffold**:
   ```bash
   npm run generate accordion
   ```

2. **Implement component** in `src/components/accordion/index.ts`:
   - Add class extending HTMLElement
   - Define `observedAttributes`
   - Add type definitions
   - Implement registration function

3. **Add to main exports** in `src/index.js`:
   ```javascript
   export { FvrAccordion, registerFvrAccordion } from "./components/accordion";
   ```

4. **Generate types and wrappers**:
   ```bash
   npm run generate:types
   ```

5. **Build**:
   ```bash
   npm run build
   ```

Done! Your component now has:
- ✅ TypeScript JSX declarations
- ✅ React wrapper component
- ✅ Full type safety

### Modifying Existing Component

1. **Update component** (add/remove attributes, change types)

2. **Regenerate**:
   ```bash
   npm run generate:types
   ```

3. **Types automatically updated** - no manual changes needed!

## Limitations & Edge Cases

### Current Limitations

1. **Complex types**: Doesn't extract interfaces, only type aliases
2. **Computed types**: Can't handle types like `Exclude<>`, `Pick<>`, etc.
3. **Comments**: Doesn't preserve JSDoc comments from component to generated file
4. **Custom events**: Detection is basic, might miss some patterns

### Edge Cases Handled

✅ Boolean attributes with no value
✅ Kebab-case to PascalCase conversion
✅ Const arrays with `as const`
✅ Type references like `(typeof ARRAY)[number]`
✅ Multiple types per component
✅ Components with no attributes

### Not Handled (Requires Manual Edit)

❌ Complex union types with generics
❌ Intersection types
❌ Conditional types
❌ Mapped types

For these cases, you can manually edit the generated files, but they'll be overwritten on next generation.

## Debugging

### Verbose Output

The generator provides detailed output:

```bash
npm run generate:types

🔍 Scanning components...
  ✓ Found component: button

📝 Generating files for 1 components...
  ✓ Generated: src/jsx.d.ts
  ✓ Generated: src/react.tsx

✨ Code generation complete!

Components processed:
  • FvrButton → <fvr-button>
    - Attributes: display-type, disabled, loading
    - Types: DisplayType, ActionType
```

### Checking Generated Files

After generation, check the generated files:

```bash
cat src/jsx.d.ts | head -n 50
cat src/react.tsx | head -n 50
```

### TypeScript Errors

If TypeScript complains after generation:

```bash
npx tsc --noEmit src/react.tsx
```

This will show exact errors in the generated code.

## Best Practices

### Component Design

For optimal code generation:

1. **Use explicit type definitions**:
   ```typescript
   type DisplayType = "primary" | "secondary";  // ✅ Extracted
   // vs
   let displayType: "primary" | "secondary";     // ❌ Not extracted
   ```

2. **Use `as const` for arrays**:
   ```typescript
   const VALID_ELEMENTS = ["p", "span"] as const;  // ✅ Extracted
   // vs
   const VALID_ELEMENTS = ["p", "span"];           // ❌ Not extracted
   ```

3. **Consistent naming**:
   ```typescript
   type DisplayType = ...              // Type name
   private displayType: DisplayType;   // Property name
   getAttribute("display-type")        // Attribute name (kebab-case)
   ```

4. **Document observed attributes**:
   ```typescript
   static get observedAttributes(): string[] {
     return ["display-type", "disabled"];  // Clear and explicit
   }
   ```

### Testing Generated Code

After generation, test:

1. **TypeScript compiles**: `npm run build`
2. **React wrapper works**: Import and test in example
3. **Types are correct**: Check autocomplete in IDE

## Comparison: Before vs After

### Before (Manual)

```
1. Create component           src/components/button/index.ts
2. Manually add types         src/jsx.d.ts (30 lines)
3. Manually create wrapper    src/react.tsx (40 lines)
4. Keep all 3 in sync         😰
```

### After (Generated)

```
1. Create component           src/components/button/index.ts
2. Run npm run generate:types ✨ Done!
```

**Time saved per component**: ~15 minutes
**Bugs prevented**: Many 😊

## Future Improvements

Potential enhancements:

- [ ] JSDoc comment extraction and preservation
- [ ] Better event detection (look for addEventListener patterns)
- [ ] Support for component methods (imperative API)
- [ ] Generate Vue wrappers
- [ ] Generate Angular directives
- [ ] Watch mode for development
- [ ] Validate generated code with TypeScript compiler
- [ ] Generate Storybook stories automatically

## Summary

The code generation system:

✅ Analyzes component source files
✅ Extracts types, attributes, and events
✅ Generates TypeScript JSX declarations
✅ Generates React wrapper components
✅ Runs automatically during build
✅ Keeps everything in sync

**Result**: Components are the single source of truth. Everything else is generated.
