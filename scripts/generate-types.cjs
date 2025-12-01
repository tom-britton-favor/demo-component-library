/**
 * Code Generator for TypeScript JSX Declarations and React Wrappers
 *
 * This script reads component files and generates:
 * 1. src/jsx.d.ts - TypeScript JSX declarations
 * 2. src/react.tsx - React wrapper components
 *
 * Run: node scripts/generate-types.cjs
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');
const GENERATED_DIR = path.join(__dirname, '../src/generated');
const JSX_OUTPUT = path.join(GENERATED_DIR, 'jsx.d.ts');
const REACT_OUTPUT = path.join(GENERATED_DIR, 'react.tsx');

/**
 * Extract component metadata from a TypeScript file
 */
function parseComponentFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract class name (e.g., "class FvrButton extends HTMLElement")
  const classMatch = content.match(/class\s+(Fvr\w+)\s+extends\s+HTMLElement/);
  if (!classMatch) return null;

  const className = classMatch[1];

  // Extract observed attributes
  const observedAttrsMatch = content.match(
    /static\s+get\s+observedAttributes\(\)[\s\S]*?return\s+\[([\s\S]*?)\]/
  );

  const attributes = [];
  if (observedAttrsMatch) {
    const attrsString = observedAttrsMatch[1];
    const attrMatches = attrsString.matchAll(/["']([^"']+)["']/g);
    for (const match of attrMatches) {
      attributes.push(match[1]);
    }
  }

  // Extract type definitions from the file
  const types = extractTypes(content);

  // Extract custom events (look for addEventListener or dispatchEvent patterns)
  const events = extractEvents(content);

  // Generate kebab-case tag name
  const tagName = 'fvr-' + className.replace(/^Fvr/, '')
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');

  // Extract registration function name
  const registerFnMatch = content.match(/const\s+(registerFvr\w+)/);
  const registerFn = registerFnMatch ? registerFnMatch[1] : null;

  return {
    className,
    tagName,
    registerFn,
    attributes,
    types,
    events,
    filePath: filePath.replace(COMPONENTS_DIR, '').replace(/\\/g, '/'),
  };
}

/**
 * Extract type definitions from component file
 */
function extractTypes(content) {
  const types = {};

  // Extract type aliases (e.g., "type DisplayType = ...")
  const typeMatches = content.matchAll(/type\s+(\w+)\s+=\s+([^;]+);/g);
  for (const match of typeMatches) {
    types[match[1]] = match[2].trim();
  }

  // Extract const arrays (e.g., "const VALID_ELEMENTS = [...] as const")
  const constMatches = content.matchAll(
    /const\s+VALID_(\w+)\s+=\s+\[([\s\S]*?)\]\s+as\s+const/g
  );
  for (const match of constMatches) {
    const typeName = match[1].split('_').map((word, i) =>
      i === 0 ? word.charAt(0) + word.slice(1).toLowerCase() : word.charAt(0) + word.slice(1).toLowerCase()
    ).join('');

    // Extract values from array
    const values = match[2].matchAll(/["']([^"']+)["']/g);
    const valueList = Array.from(values).map(v => `"${v[1]}"`).join(' | ');
    if (valueList) {
      types[typeName] = valueList;
    }
  }

  // Also check for type definitions that reference const arrays
  // e.g., type TextContainingElement = (typeof VALID_ELEMENTS)[number];
  // Replace these with the direct union type
  const derivedTypeMatches = content.matchAll(
    /type\s+(\w+)\s+=\s+\(typeof\s+VALID_(\w+)\)\[number\]/g
  );
  for (const match of derivedTypeMatches) {
    const typeName = match[1];
    const constName = match[2].split('_').map((word, i) =>
      i === 0 ? word.charAt(0) + word.slice(1).toLowerCase() : word.charAt(0) + word.slice(1).toLowerCase()
    ).join('');

    // If we already extracted the const array values, use those
    if (types[constName]) {
      types[typeName] = types[constName];
    }
  }

  return types;
}

/**
 * Extract custom events from component
 */
function extractEvents(content) {
  const events = new Set();

  // Look for dispatchEvent patterns
  const dispatchMatches = content.matchAll(/dispatchEvent\(new\s+\w*Event\(['"](\w+)['"]/g);
  for (const match of dispatchMatches) {
    events.add(match[1]);
  }

  return Array.from(events);
}

/**
 * Infer TypeScript type for an attribute based on naming and context
 */
function inferAttributeType(attrName, types, className) {
  // Boolean attributes (no value or empty string)
  if (['disabled', 'loading', 'open'].includes(attrName)) {
    return 'boolean';
  }

  // Special case for 'element' attribute in Text component
  if (attrName === 'element' && className === 'FvrText') {
    // Look for TextContainingElement or Elements type
    if (types['TextContainingElement']) return 'TextContainingElement';
    if (types['Elements']) return 'Elements';
  }

  // Try to find matching type
  const pascalAttrName = attrName.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('');

  if (types[pascalAttrName]) {
    return pascalAttrName;
  }

  // Check for type + suffix patterns
  for (const typeName in types) {
    if (pascalAttrName.includes(typeName) ||
        attrName.includes(typeName.toLowerCase())) {
      return typeName;
    }
  }

  // Default to string
  return 'string';
}

/**
 * Generate JSX declarations file
 */
function generateJsxDeclarations(components) {
  const lines = [];

  lines.push('/**');
  lines.push(' * TypeScript JSX declarations for fvr- web components');
  lines.push(' * This file is AUTO-GENERATED by scripts/generate-types.cjs');
  lines.push(' * Do not edit manually - changes will be overwritten');
  lines.push(' */');
  lines.push('');

  // Import component classes
  lines.push('// Component imports');
  for (const comp of components) {
    const importPath = comp.filePath.replace('.ts', '');
    lines.push(`import { ${comp.className} } from "./components${importPath}";`);
  }
  lines.push('');

  // Import React types
  lines.push('import type * as React from \'react\';');
  lines.push('');

  // Export type definitions
  lines.push('// Type definitions extracted from components');
  const allTypes = {};
  for (const comp of components) {
    Object.assign(allTypes, comp.types);
  }

  for (const [typeName, typeValue] of Object.entries(allTypes)) {
    lines.push(`type ${typeName} = ${typeValue};`);
  }
  lines.push('');

  // Base interface
  lines.push('// Base interface for common HTML attributes');
  lines.push('interface CustomElementAttributes {');
  lines.push('  class?: string;');
  lines.push('  className?: string;');
  lines.push('  id?: string;');
  lines.push('  slot?: string;');
  lines.push('  style?: string | React.CSSProperties;');
  lines.push('  children?: React.ReactNode;');
  lines.push('  ref?: React.Ref<HTMLElement>;');
  lines.push('}');
  lines.push('');

  // Component attribute interfaces
  for (const comp of components) {
    const interfaceName = `${comp.className}Attributes`;
    lines.push(`interface ${interfaceName} extends CustomElementAttributes {`);

    for (const attr of comp.attributes) {
      const type = inferAttributeType(attr, comp.types, comp.className);
      lines.push(`  "${attr}"?: ${type};`);
    }

    lines.push('}');
    lines.push('');
  }

  // Global JSX namespace (React 18)
  lines.push('declare global {');
  lines.push('  namespace JSX {');
  lines.push('    interface IntrinsicElements {');
  for (const comp of components) {
    lines.push(`      "${comp.tagName}": ${comp.className}Attributes;`);
  }
  lines.push('    }');
  lines.push('  }');
  lines.push('}');
  lines.push('');

  // React namespace (React 19+)
  lines.push('// For React 19+ compatibility');
  lines.push('declare module "react" {');
  lines.push('  namespace JSX {');
  lines.push('    interface IntrinsicElements {');
  for (const comp of components) {
    lines.push(`      "${comp.tagName}": ${comp.className}Attributes;`);
  }
  lines.push('    }');
  lines.push('  }');
  lines.push('}');
  lines.push('');

  // Export types
  lines.push('// Export types for consumers');
  lines.push('export type {');
  for (const comp of components) {
    lines.push(`  ${comp.className}Attributes,`);
  }
  for (const typeName of Object.keys(allTypes)) {
    lines.push(`  ${typeName},`);
  }
  lines.push('};');

  return lines.join('\n');
}

/**
 * Generate React wrapper components
 */
function generateReactWrappers(components) {
  const lines = [];

  lines.push('/**');
  lines.push(' * React wrapper components for fvr- web components');
  lines.push(' * This file is AUTO-GENERATED by scripts/generate-types.cjs');
  lines.push(' * Do not edit manually - changes will be overwritten');
  lines.push(' */');
  lines.push('');
  lines.push('import React, { useEffect, useRef } from "react";');

  // Import all components and registration functions
  lines.push('import {');
  for (const comp of components) {
    lines.push(`  ${comp.className},`);
    lines.push(`  ${comp.registerFn},`);
  }
  lines.push('} from "../index.js";');
  lines.push('');

  // Import types
  lines.push('import type {');
  for (const comp of components) {
    lines.push(`  ${comp.className}Attributes,`);
  }
  lines.push('} from "./jsx.d.ts";');
  lines.push('');

  // Register all components
  lines.push('// Register all components');
  for (const comp of components) {
    lines.push(`${comp.registerFn}();`);
  }
  lines.push('');

  // useWebComponent hook
  lines.push('// Helper function to set properties on web components');
  lines.push('function useWebComponent<T extends HTMLElement>(');
  lines.push('  ref: React.RefObject<T>,');
  lines.push('  props: Record<string, any>');
  lines.push(') {');
  lines.push('  useEffect(() => {');
  lines.push('    if (!ref.current) return;');
  lines.push('');
  lines.push('    const element = ref.current;');
  lines.push('');
  lines.push('    // Set properties directly on the element (not as attributes)');
  lines.push('    Object.keys(props).forEach((key) => {');
  lines.push('      if (key === "children" || key === "className" || key === "style") return;');
  lines.push('');
  lines.push('      const value = props[key];');
  lines.push('');
  lines.push('      // Handle boolean attributes');
  lines.push('      if (typeof value === "boolean") {');
  lines.push('        if (value) {');
  lines.push('          element.setAttribute(key, "");');
  lines.push('        } else {');
  lines.push('          element.removeAttribute(key);');
  lines.push('        }');
  lines.push('      }');
  lines.push('      // Handle other attributes');
  lines.push('      else if (value !== undefined && value !== null) {');
  lines.push('        element.setAttribute(key, String(value));');
  lines.push('      }');
  lines.push('    });');
  lines.push('  }, [ref, props]);');
  lines.push('}');
  lines.push('');

  // Generate wrapper for each component
  for (const comp of components) {
    const componentName = comp.className.replace(/^Fvr/, '');
    const propsName = `React${componentName}Props`;

    // Determine event props
    const eventProps = [];
    if (comp.events.length > 0) {
      for (const event of comp.events) {
        eventProps.push(`on${event.charAt(0).toUpperCase()}${event.slice(1)}?: (event: Event) => void;`);
      }
    }
    // Add common events
    if (comp.tagName.includes('button')) {
      eventProps.push('onClick?: (event: Event) => void;');
    }
    if (comp.tagName.includes('modal')) {
      eventProps.push('onClose?: (event: Event) => void;');
    }

    // Props interface
    lines.push(`interface ${propsName} extends Omit<${comp.className}Attributes, "children"> {`);
    for (const eventProp of eventProps) {
      lines.push(`  ${eventProp}`);
    }
    lines.push('  children?: React.ReactNode;');
    lines.push('}');
    lines.push('');

    // Component wrapper
    lines.push(`export const ${componentName} = React.forwardRef<${comp.className}, ${propsName}>(`);

    // Destructure event handlers
    const eventHandlers = eventProps.map(ep => {
      const match = ep.match(/(\w+)\?:/);
      return match ? match[1] : null;
    }).filter(Boolean);

    const destructured = eventHandlers.length > 0
      ? `{ children, ${eventHandlers.join(', ')}, ...props }`
      : '{ children, ...props }';

    lines.push(`  (${destructured}, forwardedRef) => {`);
    lines.push(`    const internalRef = useRef<${comp.className}>(null);`);
    lines.push(`    const ref = (forwardedRef as React.RefObject<${comp.className}>) || internalRef;`);
    lines.push('');
    lines.push('    useWebComponent(ref, props);');
    lines.push('');

    // Add event listeners
    if (eventHandlers.length > 0) {
      lines.push('    useEffect(() => {');
      lines.push('      const element = ref.current;');
      lines.push('      if (!element) return;');
      lines.push('');
      lines.push('      const handlers: Array<[string, EventListener]> = [];');
      lines.push('');

      for (const handler of eventHandlers) {
        const eventName = handler.replace(/^on/, '').toLowerCase();
        lines.push(`      if (${handler}) {`);
        lines.push(`        const listener = ${handler} as EventListener;`);
        lines.push(`        element.addEventListener("${eventName}", listener);`);
        lines.push(`        handlers.push(["${eventName}", listener]);`);
        lines.push('      }');
        lines.push('');
      }

      lines.push('      return () => {');
      lines.push('        handlers.forEach(([event, listener]) => {');
      lines.push('          element.removeEventListener(event, listener);');
      lines.push('        });');
      lines.push('      };');
      lines.push(`    }, [ref, ${eventHandlers.join(', ')}]);`);
      lines.push('');
    }

    lines.push('    return (');
    lines.push(`      <${comp.tagName} ref={ref} {...props}>`);
    lines.push('        {children}');
    lines.push(`      </${comp.tagName}>`);
    lines.push('    );');
    lines.push('  }');
    lines.push(');');
    lines.push('');
    lines.push(`${componentName}.displayName = "${componentName}";`);
    lines.push('');
  }

  // Export all classes
  lines.push('// Export all component classes');
  lines.push('export {');
  for (const comp of components) {
    lines.push(`  ${comp.className},`);
  }
  lines.push('};');

  return lines.join('\n');
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Scanning components...');

  // Ensure generated directory exists
  if (!fs.existsSync(GENERATED_DIR)) {
    fs.mkdirSync(GENERATED_DIR, { recursive: true });
  }

  // Find all component directories
  const componentDirs = fs.readdirSync(COMPONENTS_DIR)
    .filter(name => {
      const stat = fs.statSync(path.join(COMPONENTS_DIR, name));
      return stat.isDirectory();
    });

  // Parse each component
  const components = [];
  for (const dir of componentDirs) {
    const indexPath = path.join(COMPONENTS_DIR, dir, 'index.ts');
    if (fs.existsSync(indexPath)) {
      console.log(`  ✓ Found component: ${dir}`);
      const component = parseComponentFile(indexPath);
      if (component) {
        components.push(component);
      }
    }
  }

  console.log(`\n📝 Generating files for ${components.length} components...\n`);

  // Generate JSX declarations
  const jsxContent = generateJsxDeclarations(components);
  fs.writeFileSync(JSX_OUTPUT, jsxContent, 'utf-8');
  console.log(`  ✓ Generated: ${path.relative(process.cwd(), JSX_OUTPUT)}`);

  // Generate React wrappers
  const reactContent = generateReactWrappers(components);
  fs.writeFileSync(REACT_OUTPUT, reactContent, 'utf-8');
  console.log(`  ✓ Generated: ${path.relative(process.cwd(), REACT_OUTPUT)}`);

  console.log('\n✨ Code generation complete!\n');

  // Summary
  console.log('Components processed:');
  for (const comp of components) {
    console.log(`  • ${comp.className} → <${comp.tagName}>`);
    console.log(`    - Attributes: ${comp.attributes.join(', ') || 'none'}`);
    console.log(`    - Types: ${Object.keys(comp.types).join(', ') || 'none'}`);
  }
}

// Run
main();
