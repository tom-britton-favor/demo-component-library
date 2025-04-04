/** @type { import('@storybook/web-components').Preview } */

import "../src/assets/global.css";
import registerComponents from "../src/index";

registerComponents();

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
