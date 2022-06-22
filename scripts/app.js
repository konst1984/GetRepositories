import {
  createElement,
  debounce,
  addListener,
  showElem,
  hideElem,
} from "./functions-behavior.js";

import {
  form,
  datalistFragment,
  searchInput,
  dataList,
} from "./dom-elements.js";

let optionsList = [];
let arrRep = [];

const getRepositories = async (searchValue) => {
  try {
    if (searchValue) {
      const res = await fetch(
        `https://api.github.com/search/repositories?q=${searchValue}+in:name&per_page=5&page=1`
      );
      const responseJson = await res.json();
      dataList.innerHTML = "";
      responseJson.items.length === 0 && alert("Репозиторий не существует");
      responseJson.items.forEach(({ name, id }) => {
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
      optionsList.forEach((option) =>
        option.addEventListener("click", (e) =>
          createCard(e, responseJson.items)
        )
      );
      optionsList.forEach((option) =>
        option.addEventListener("keyup", (e) => {
          if (e.keyCode === 13) {
            e.target.click();
          }
        })
      );
    } else {
      dataList.innerHTML = "";
    }
  } catch (e) {
    console.error(e);
    alert(e);
  }
};

function createCard(e, arrRepos) {
  searchInput.value = "";
  const reposList = document.querySelector(".repos-list");
  arrRepos
    .filter((item, index) => item.id == e.target.getAttribute("data-id"))
    .forEach(({ name, full_name, stargazers_count }) => {
      const card = createElement("div", "card");
      card.innerHTML = `<div class="card-content">
                          <p class="card-content__name">Name:  ${name}</p>
                          <p class="card-content__owner">Owner:  ${full_name}</p>
                          <p class="card-content__stars">Stars:  ${stargazers_count}</p>
                       </div>
                       <button class="card__btn-delete" type="button"></button>`;
      reposList.append(card);
      [...document.getElementsByClassName("card__btn-delete")].forEach(
        (button) => {
          button.addEventListener("click", function delCard(event) {
            event.target.parentElement.remove();
            event.target.removeEventListener("click", delCard);
            hideElem(dataList);
          });
        }
      );
      hideElem(dataList);
    });
}

addListener(searchInput, "focusin", (e) => {
  if (document.activeElement === searchInput) showElem(dataList);
});

addListener(searchInput, "blur", (e) => {
  if (e.relatedTarget === null) {
    hideElem(dataList);
  }
});

function loadRepositories() {
  getRepositories(searchInput.value);
}

searchInput.addEventListener("input", debounce(loadRepositories, 300));
