const renderButtongroup = (args) => `
  <fvr-button-group>
    ${args?.showPrimaryButton ? "<fvr-button>Confirm</fvr-button>" : ""}    
    ${args?.showSecondaryButton ? '<fvr-button display-type="secondary">Reset</fvr-button>' : ""}
    ${args?.showTextButton ? '<fvr-button display-type="tertiary">Cancel</fvr-button>' : ""}
  </fvr-button-group>
`;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: "Favor/Buttongroup",
  tags: ["autodocs"],
  render: (args) => renderButtongroup(args),
  argsTypes: {},
  args: {},
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ExampleButtongroup = {
  args: {
    showTextButton: true,
    showSecondaryButton: true,
    showPrimaryButton: true,
  },
};
