import { createElement } from "./functions-behavior.js";

const form = document.querySelector(".form");
const searchInput = document.querySelector(".searchInput");
const dataList = createElement("datalist");
dataList.setAttribute("id", "complete-list");
dataList.setAttribute("class", "complete-list");
const datalistFragment = document.createDocumentFragment();

export { form, datalistFragment, searchInput, dataList };
