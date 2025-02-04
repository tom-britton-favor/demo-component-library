import { registerFvrButton } from "./components/button";
import { registerFvrText } from "./components/text";
import { registerFvrButtonGroup } from "./components/button-group";
import { registerFvrModal } from "./components/modal";

export { FvrButton, registerFvrButton } from "./components/button";
export { FvrText, registerFvrText } from "./components/text";
export { FvrButtonGroup, registerFvrButtonGroup } from "./components/button-group";
export { FvrModal, registerFvrModal } from "./components/modal";

registerFvrButton();
registerFvrText();
registerFvrButtonGroup();
registerFvrModal();
