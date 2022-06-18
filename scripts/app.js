import {
  createElement,
  debounce,
  addListener,
  addClassHoverElem,
  showElem,
  hideElem,
  elementIsInFocus,
  addClass,
  removeClass,
} from "./functions-behavior.js";
import { requestAPi } from "./request-api.js";
import { elemMaket } from "./card-maket.js";
import {
  fragmentCard,
  form,
  datalistFragment,
  searchInput,
  dataList,
  reposList,
} from "./dom-elements.js";

const PER_PAGE = 5;

const pageNum = 1;

const KEY_CODE_STOP = [37, 38, 39, 40, 16, 17, 18, 13];

let currentCount = -1;

let optionsList = [];

let arrRep = [];

let timer = null;

let countCards = 0;

const getRepositories = async (searchValue) => {
  try {
    if (searchValue) {
      const responseJson = await requestAPi(searchValue, PER_PAGE, pageNum);
      dataList.innerHTML = "";
      responseJson.items.length === 0 && alert("Репозиторий не существует");
      arrRep = responseJson.items;
      arrRep.forEach(({ name, id }) => {
        const option = createElement("option", "option-item");
        option.setAttribute("data-id", id);
        option.value = name;
        option.innerHTML = name;
        dataList.append(option);
      });
      datalistFragment.prepend(dataList);
      form.append(datalistFragment);
      optionsList = [...document.getElementsByClassName("option-item")];
    } else {
      dataList.innerHTML = "";
    }
  } catch (e) {
    console.error(e);
    alert(e);
  }
};

if(!showElem(dataList)){
  addListener(searchInput, "focus", () => {
    showElem(dataList);
  })
} else
  searchInput.removeEventListener('focus', () => showElem(dataList))

addListener(searchInput, "blur", () => {
  optionsList.forEach((option) => option.classList.remove("active"));
  currentCount = -1;
  timer = setTimeout(() => {
    hideElem(dataList);
  }, 100);
});

function addCard(e, elem = e.target) {
  countCards++;
  searchInput.value = "";
  arrRep
    .filter((item) => item.id == elem.getAttribute("data-id"))
    .forEach(({ name, full_name, stargazers_count }) => {
      const card = createElement("div", "card");
      card.innerHTML = elemMaket(name, full_name, stargazers_count);
      fragmentCard.append(card);
      reposList.append(fragmentCard);
      form.append(reposList);
    });
}

addListener(form, "click", function handler(event) {
  switch (event.target.className) {
    case "option-item":
      addCard(event);
      hideElem(dataList);
      break;
    case "complete-list":
      addCard(event);
      break;
    case "searchInput":
      showElem(dataList);
      break;
    case "card__btn-delete":
      event.target.parentElement.remove();
      break;
    default:
      form.removeEventListener('click',handler)
      break;
  }
});

addListener(form, "mouseover", (event) => {
  addClass(event, "option-item", optionsList, "active");
  if (event.target.id === "complete-list") {
    clearTimeout(timer);
  }
});

addListener(form, "mouseout", (event) => {
  removeClass(event, "option-item", optionsList, "active");
});

addListener(form, "submit", (event) => {
  event.preventDefault();
});

async function resultFunc(event) {
  if (!KEY_CODE_STOP.includes(event.keyCode)) {
    await loadRepositories();
  }
  if (
    (elementIsInFocus(event.target) &&
      hideElem(dataList) &&
      (event.keyCode === 40 || event.keyCode === 38)) ||
    searchInput.value
  ) {
    showElem(dataList);
  }
  if (
    event.keyCode === 40 &&
    optionsList.length &&
    currentCount < optionsList.length
  ) {
    currentCount++;
    if (currentCount < optionsList.length) {
      addClassHoverElem(optionsList[currentCount], optionsList, "active");
    } else if (currentCount > optionsList.length - 2) {
      currentCount = 0;
      addClassHoverElem(optionsList[currentCount], optionsList, "active");
    }
  }
  if (event.keyCode === 38 && optionsList.length && currentCount >= 0) {
    currentCount--;
    if (currentCount < 0) {
      currentCount = 0;
    }
    addClassHoverElem(optionsList[currentCount], optionsList, "active");
  }
  if (event.keyCode === 13) {
    addCard(event, optionsList[currentCount]);
    hideElem(dataList);
  }
}

function loadRepositories() {
  getRepositories(searchInput.value);
}

searchInput.addEventListener("keyup", debounce(resultFunc, 300));
