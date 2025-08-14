export function createElement(type, attributes = {}, text = "") {
  const el = document.createElement(type);
  for (const [attr, val] of Object.entries(attributes)) {
    el.setAttribute(attr, val);
  }
  if (text) el.textContent = text;
  return el;
}