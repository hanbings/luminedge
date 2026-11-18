function dataName(name) {
  return `data-${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
}

export class FakeElement {
  constructor(document, tag = 'div') {
    this.ownerDocument = document;
    this.tagName = tag.toUpperCase();
    this.parentElement = null;
    this.children = [];
    this.attributes = new Map();
    this.listeners = new Map();
    this.hidden = false;
    this.disabled = false;
    this.open = false;
    this.tabIndex = 0;
    this._text = '';
    this.dataset = new Proxy({}, {
      get: (_, name) => this.getAttribute(dataName(String(name))) ?? undefined,
      set: (_, name, value) => { this.setAttribute(dataName(String(name)), String(value)); return true; },
    });
  }
  get id() { return this.getAttribute('id') ?? ''; }
  set id(value) { this.setAttribute('id', value); }
  get className() { return this.getAttribute('class') ?? ''; }
  set className(value) { this.setAttribute('class', value); }
  get textContent() { return this._text + this.children.map((child) => child.textContent).join(''); }
  set textContent(value) { this._text = String(value ?? ''); this.replaceChildren(); }
  get isConnected() { return this.ownerDocument.contains(this); }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  removeAttribute(name) { this.attributes.delete(name); }
  append(...elements) {
    for (const element of elements) {
      element.remove();
      element.parentElement = this;
      this.children.push(element);
    }
  }
  replaceChildren(...elements) {
    for (const child of this.children) child.parentElement = null;
    this.children = [];
    this.append(...elements);
  }
  remove() {
    if (!this.parentElement) return;
    this.parentElement.children = this.parentElement.children.filter((child) => child !== this);
    this.parentElement = null;
  }
  contains(node) { return node === this || this.children.some((child) => child.contains(node)); }
  matches(selector) {
    if (selector === ':disabled') return this.disabled;
    const match = /^([a-z]+)?(?:\[([\w-]+)(?:=["']?([^\]"']+)["']?)?\])?$/i.exec(selector);
    if (!match) throw new Error(`Unsupported test selector: ${selector}`);
    const [, tag, attribute, value] = match;
    if (tag && this.tagName !== tag.toUpperCase()) return false;
    if (attribute && this.getAttribute(attribute) === null) return false;
    return value === undefined || this.getAttribute(attribute) === value;
  }
  closest(selector) {
    for (let current = this; current; current = current.parentElement) if (current.matches(selector)) return current;
    return null;
  }
  querySelectorAll(selector) {
    const found = [];
    const visit = (node) => {
      for (const child of node.children) {
        if (child.matches(selector)) found.push(child);
        visit(child);
      }
    };
    visit(this);
    return found;
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] ?? null; }
  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
  }
  removeEventListener(type, listener) { this.listeners.get(type)?.delete(listener); }
  dispatchEvent(event) {
    if (!event.target) Object.defineProperty(event, 'target', { value: this, configurable: true });
    for (const listener of this.listeners.get(event.type) ?? []) listener.call(this, event);
    if (event.bubbles && this.parentElement) this.parentElement.dispatchEvent(event);
    return !event.defaultPrevented;
  }
  focus() { this.ownerDocument.activeElement = this; }
}

export class FakeDocument extends FakeElement {
  constructor() {
    super(null, 'document');
    this.ownerDocument = this;
    this.documentElement = new FakeElement(this, 'html');
    this.documentElement.lang = 'en-US';
    this.body = new FakeElement(this, 'body');
    this.append(this.documentElement);
    this.documentElement.append(this.body);
    this.activeElement = this.body;
  }
  createElement(tag) { return new FakeElement(this, tag); }
  getElementById(id) { return this.querySelectorAll('[id]').find((element) => element.id === id) ?? null; }
}

export function element(document, tag, attributes = {}) {
  const node = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
  return node;
}

export function fire(target, type, properties = {}) {
  const event = {
    type,
    target,
    bubbles: true,
    defaultPrevented: false,
    preventDefault() { this.defaultPrevented = true; },
    ...properties,
  };
  target.dispatchEvent(event);
  return event;
}
