const renderModal = (
  args,
) => `<fvr-modal ${args.open ? "open" : ""} title="${args.title}">
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

const renderAnimatedModal = (args) => `
<fvr-button id="open">Open Modal</fvr-button>

<fvr-modal id="modal" title="${args.title}">
  <div slot="modal-body">
    <fvr-text>${args.modalBody}</fvr-text> 
  </div>
  
  <fvr-button-group slot="modal-buttons">
    <fvr-button display-type="primary" id="confirm">
      Confirm
    </fvr-button>
    <fvr-button display-type="tertiary" id="cancel">
      Cancel
    </fvr-button>
  </fvr-button-group>
</fvr-modal>

<script>
  const modal = document.getElementById('modal');
  document.getElementById('open').addEventListener('click', () => {
    modal.setAttribute('open', '');
    
    document.getElementById('cancel').addEventListener('click', () => {
      modal.removeAttribute('open');
    })
    document.getElementById('confirm').addEventListener('click', () => {
      modal.removeAttribute('open');
    })
  })
</script>

`;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: "Favor/Modal",
  tags: ["autodocs"],
  render: (args) => renderModal(args),
  argsTypes: {},
  args: {
    open: true,
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ExampleModal = {
  args: {
    open: true,
    modalBody:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pellentesque lobortis libero, sed fringilla orci maximus non. Pellentesque sit amet elementum tellus, et tincidunt enim.",
    title: "Modal Title",
  },
};

export const AnimationExample = {
  render: (args) => renderAnimatedModal(args),
  args: {
    open: false,
    modalBody:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pellentesque lobortis libero, sed fringilla orci maximus non. Pellentesque sit amet elementum tellus, et tincidunt enim.",
    title: "Animated Modal Example",
  },
};
