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

const renderAnimatedModal = () => {
  const containerId = `modal-container-${Math.random().toString(36).substring(2, 9)}`;

  // Use setTimeout to ensure the script runs after the DOM is updated
  setTimeout(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const modal = container.querySelector("#modal");
    const openBtn = container.querySelector("#open");
    const cancelBtn = container.querySelector("#cancel");
    const confirmBtn = container.querySelector("#confirm");

    if (modal && openBtn) {
      openBtn.addEventListener("click", () => {
        modal.setAttribute("open", "");
      });
    }

    if (modal && cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        modal.removeAttribute("open");
      });
    }

    if (modal && confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        modal.removeAttribute("open");
      });
    }
  }, 100);

  return `
    <div id="${containerId}">
      <fvr-button id="open">Open Modal</fvr-button>
      <fvr-modal id="modal" title="Modal Title">
        <div slot="modal-body">
          <fvr-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pellentesque lobortis libero, sed fringilla orci maximus non. Pellentesque sit amet elementum tellus, et tincidunt enim.</fvr-text> 
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
    </div>
  `;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: "Favor/Modal",
  tags: ["autodocs"],
  render: (args) => renderModal(args),
  argsTypes: {},
  args: {
    //open: true,
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
  render: () => renderAnimatedModal(),
};
