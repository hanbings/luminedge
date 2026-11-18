import { listen } from '@luminedge/tools';

export function createToggleButton(button: HTMLButtonElement) {
  const getPressed = () => button.getAttribute('aria-pressed') === 'true';
  const setPressed = (pressed: boolean) => {
    button.setAttribute('aria-pressed', String(pressed));
  };
  setPressed(getPressed());
  return { getPressed, setPressed, destroy: listen(button, 'click', () => setPressed(!getPressed())) };
}
