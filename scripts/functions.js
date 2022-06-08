export {createElement,debounce,elementDelete,addListener,addClassHoverElem,showElem,hideElem,elementIsInFocus};


function createElement(elemTag,elemClass) {

  const element = document.createElement(elemTag);
  if(elemClass) element.classList.add(elemClass);

  return element
}

function elementDelete(elem) {
  elem.parentElement.remove();
}

function hideElem(elem){
  elem.style.display = 'none';
  return true;
}

function showElem(elem){
  elem.style.display = 'block';
  return true;
}


function addListener(target, event, callback) {
  return target ? target.addEventListener(event,callback) : false;
}


const elementIsInFocus = (el) => (el === document.activeElement);

function addClassHoverElem(elem,elemList, nameClass){
  if(elem && elemList ) {
    elemList.forEach(elem => elem.classList.remove(nameClass))
    elem.classList.add(nameClass);
  }
  return true;
}

function debounce(fn, setTime){

  let timer = null;

  return function wrap (...args){

    clearTimeout(timer);

    timer = setTimeout(() =>{
      const b = fn.bind(this,...args)
      b();
    },setTime);
  }

}