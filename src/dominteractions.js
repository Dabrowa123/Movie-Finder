const _getDOMElem = (attribute, value) => {
  return document.querySelector(`[${attribute}="${value}"]`);
};

export const mapListToDOMElements = (listOfValues, attribute) => {
  const _viewElems = {};

  for (const value of listOfValues) {
    _viewElems[value] = _getDOMElem(attribute, value);
  }

  return _viewElems;
};

export const createDOMElem = (tagName, className, innerHTML, src, alt) => {
  const tag = document.createElement(tagName);
  tag.classList = className;

  if (innerHTML) tag.innerHTML = innerHTML;
  if (src) tag.src = src;
  if (alt) tag.alt = alt;

  return tag;
};
