import { registerFvrModal} from "./";
import { registerFvrButton } from "../button";
import { registerFvrButtongroup } from "../button-group";
import { registerFvrText } from "../text";
registerFvrModal();
registerFvrButtongroup();
registerFvrButton();
registerFvrText();

const renderModal = (args) => `<fvr-modal ${args.open ? 'open' : ''} title="${args.title}">
  <div slot="modal-body">
    <fvr-text>${args.modalBody}</fvr-text> 
  </div>
  
  <fvr-button-group slot="modal-buttons">
    <fvr-button display-type="primary">
      Confirm
    </fvr-button>
    <fvr-button display-type="tertiary">
      Cancel
    </fvr-button>
  </fvr-button-group>
  
</fvr-modal>`;


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: "Favor/Modal",
  tags: ["autodocs"],
  render: (args) => renderModal(args),
  argsTypes: {},
  args: {
    open: true
  }
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ExampleModal = {
  args: {
    open: true,
    modalBody: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pellentesque lobortis libero, sed fringilla orci maximus non. Pellentesque sit amet elementum tellus, et tincidunt enim.',
    title: 'Modal Title'
  }
};
