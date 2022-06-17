import { createElement } from "./functions.js";

const form = document.querySelector(".form");
const reposList = createElement("div", "repos-list");
const searchInput = document.querySelector(".searchInput");
const fragmentCard = document.createDocumentFragment();
const dataList = createElement("datalist");
dataList.setAttribute("id", "complete-list");
dataList.setAttribute("class", "complete-list");
const datalistFragment = document.createDocumentFragment();

export {
  fragmentCard,
  form,
  datalistFragment,
  searchInput,
  dataList,
  reposList,
};
