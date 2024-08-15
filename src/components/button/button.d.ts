// button.d.ts

import { FvrButton } from "./";

declare global {
  interface HTMLElementTagNameMap {
    "fvr-button": FvrButton;
  }
}

declare namespace JSX {
  interface IntrinsicElements {
    "fvr-button": FvrButtonAttributes;
  }
}

interface FvrButtonAttributes extends React.HTMLAttributes<HTMLElement> {
  "display-type"?: "primary" | "secondary" | "tertiary";
  "action-type"?: "default" | "destructive";
  disabled?: boolean;
  loading?: boolean;
}

export {};
