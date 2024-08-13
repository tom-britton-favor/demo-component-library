import { fn } from "@storybook/test";
import { registerFvrButton } from "./";

registerFvrButton();

const renderButton = (args) =>
  `<script>window.callback = () => { alert('click') }</script>
  <fvr-button
    onclick="callback()"
    display-type="${args.displayType}"
    ${args.disabled ? "disabled" : ""}
    ${args.loading ? "loading" : ""}
    action-type="${args.actionType}"
  >
    ${args.label}
  </fvr-button>`;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: "Favor/Button",
  tags: ["autodocs"],
  render: (args) => renderButton(args),
  argTypes: {
    displayType: {
      control: { type: "select" },
      options: ["primary", "secondary", "tertiary"],
    },
    actionType: {
      control: { type: "select" },
      options: ["default", "destructive"],
    },
    disabled: {
      control: { type: "boolean" },
    },
    loading: {
      control: { type: "boolean" },
    },
  },
  args: { onClick: fn() },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ExampleButton = {
  args: {
    displayType: "primary",
    label: "Button Label",
    actionType: "default",
    disabled: false,
    loading: false,
  },
};
