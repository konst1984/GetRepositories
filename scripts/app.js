import {
  createElement,
  debounce,
  addListener,
  showElem,
  hideElem,
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
        option.setAttribute("tabindex", 1);
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

if (!showElem(dataList)) {
  addListener(searchInput, "focus", (e) => {
    console.log(e.target);
    showElem(dataList);
  });
} else searchInput.removeEventListener("focus", () => showElem(dataList));

addListener(searchInput, "blur", (e) => {
  currentCount = -1;
  const unBlurElem = e.target.nextElementSibling;
  if (unBlurElem === dataList || unBlurElem.className === "repos-list") {
    return;
  }
  timer = setTimeout(() => {
    hideElem(dataList);
  }, 200);
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

function handlerBody(event) {
  if (
    event.target.className === "searchInput" ||
    event.target.className === "option-item"
  ) {
    showElem(dataList);
  } else
    timer = setTimeout(() => {
      hideElem(dataList);
    }, 100);

  if (
    (event.target.className === "option-item" && event.keyCode === undefined) ||
    (event.target.className === "option-item" && event.keyCode === 13)
  ) {
    addCard(event);
    hideElem(dataList);
  }
  if (
    (event.target.className === "card__btn-delete" &&
      event.keyCode === undefined) ||
    (event.target.className === "card__btn-delete" && event.keyCode === 13)
  ) {
    event.target.parentElement.remove();
  }
}

addListener(form, "submit", (event) => {
  event.preventDefault();
});

addListener(document.body, "keyup", (e) => handlerBody(e));
addListener(document.body, "click", (e) => handlerBody(e));

function loadRepositories() {
  getRepositories(searchInput.value);
}

searchInput.addEventListener("input", debounce(loadRepositories, 300));
