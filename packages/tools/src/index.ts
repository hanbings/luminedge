export { encode as encodeQr } from 'uqr';

/** Listen for an event and return a function that removes the listener. */
export function listen(
  target: EventTarget,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
): () => void {
  target.addEventListener(type, listener, options);
  return () => target.removeEventListener(type, listener, options);
}
