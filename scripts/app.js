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
      const optionsList = [...document.getElementsByClassName("option-item")];

      optionsList.forEach((option) =>
        option.addEventListener("click", function addCardInDocument(e) {
          createCard(e, responseJson.items);
          option.removeEventListener("click", addCardInDocument);
        })
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

const createCard = (e, arrRepos) => {
  searchInput.value = "";
  const reposList = document.querySelector(".repos-list");
  arrRepos
    .filter((item) => item.id == e.target.getAttribute("data-id"))
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
          button.addEventListener("click", function delCard(e) {
            e.target.parentElement.remove();
            e.target.removeEventListener("click", delCard);
            hideElem(dataList);
          });
        }
      );
      hideElem(dataList);
    });
};

addListener(searchInput, "focusin", () => {
  if (document.activeElement === searchInput) showElem(dataList);
});

addListener(searchInput, "blur", (e) => {
  if (e.relatedTarget === null) {
    hideElem(dataList);
  }
});

searchInput.addEventListener(
  "input",
  debounce(() => getRepositories(searchInput.value), 300)
);
