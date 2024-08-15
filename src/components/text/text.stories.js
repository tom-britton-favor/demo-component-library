import { fn } from "@storybook/test";
import { registerFvrText } from "./";

registerFvrText();

const renderText = (args) =>
  `<fvr-text
    element="${args.element}"
    text-style="${args.textStyle}"
    color="${args.color}"
  >
    ${args.text}
  </fvr-button>`;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: "Favor/Text",
  tags: ["autodocs"],
  render: (args) => renderText(args),
  argTypes: {
    element: {
      control: { type: "select" },
      options: ["p", "span", "h1", "h2", "h3", "h4", "h5", "h6"],
    },
    textStyle: {
      control: { type: "select" },
      options: [
        "body",
        "body-bold",
        "title",
        "title-light",
        "caption",
        "caption-bold",
        "heading-1",
        "heading-2",
        "heading-3",
        "heading-4",
        "heading-5",
        "heading-6",
        "heading-6-allcaps",
      ],
    },
    color: {
      control: { type: "select" },
      options: [
        "foreground-primary",
        "foreground-secondary",
        "foreground-disabled",
        "foreground-tint",
        "blue-primary",
        "green-primary",
        "yellow-primary",
        "orange-primary",
        "red-primary",
        "gold-primary",
        "gold-secondary",
        "blue-tint-75",
        "green-tint-75",
        "yellow-tint-75",
        "orange-tint-75",
        "red-tint-75",
        "blue-tint-25",
        "green-tint-25",
        "yellow-tint-25",
        "orange-tint-25",
        "red-tint-25",
        "blue-tint-08",
        "green-tint-08",
        "yellow-tint-08",
        "orange-tint-08",
        "red-tint-08",
        "heb-red-primary",
        "heb-red-dark",
        "heb-red-light",
      ],
    }
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ExampleText = {
  args: {
    element: "p",
    textStyle: "body",
    text: 'The quick bowl of rice jumps over the lazy spoon.',
    color: 'foreground-primary',
  },
};
