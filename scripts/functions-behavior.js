const createElement = (elemTag, elemClass) => {
  const element = document.createElement(elemTag);
  if (elemClass) element.classList.add(elemClass);

  return element;
};

const hideElem = (elem) => {
  elem.style.display = "none";
  return true;
};

const showElem = (elem) => {
  elem.style.display = "block";
  return true;
};

const addListener = (target, event, callback) => {
  return target
    ? target.addEventListener(event, callback)
    : target.removeEventListener(event, callback);
};

const debounce = (fn, setTime) => {
  let timer = null;

  return function wrap(...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      const b = fn.bind(this, ...args);
      b();
    }, setTime);
  };
};

export { createElement, debounce, addListener, showElem, hideElem };
