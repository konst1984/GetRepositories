import {createElement,debounce,elementDelete,addListener,addClassHoverElem,showElem,hideElem,elementIsInFocus} from "./functions.js";
import {requestAPi} from "./api.js";
import {elemMaket} from "./card_maket.js";
import {fragmentCard,form,datalistFragment,searchInput,dataList,reposList} from './domElements.js'


const PER_PAGE = 5;

let pageNum = 1;

let currentCount = -1;

let optionsList = [];

const keyCodeStop = [37,38,39,40,16,17,18,13];

let arrRep = [];

let timer = null;

let countCards = 0;

let searchValue = searchInput.value;

console.log(searchValue)

const getRepositories = async (searchValue) => {
  try {
    if(searchValue) {
      const responseJson = await requestAPi(searchValue,PER_PAGE,pageNum);
      dataList.innerHTML='';
      console.log(responseJson.items)
      arrRep = responseJson.items
      arrRep
        .forEach(({name,id}) => {
          const option = createElement('option', 'option-item');
          option.setAttribute('data-id', id)
          option.value = name;
          option.innerHTML = name;
          dataList.append(option);
        })
      datalistFragment.prepend(dataList);
      form.append(datalistFragment);
      optionsList =[...document.getElementsByClassName('option-item')];
    }
    else{
      dataList.innerHTML=''
    }
  }
  catch(e){
    console.error(e)
    alert(e)
  }
}



addListener(dataList,'mouseover', () => {
  return clearTimeout(timer);
})

addListener(searchInput,'focus', () => {
  showElem(dataList)
});

addListener(searchInput,'click', () => showElem(dataList));

addListener(searchInput,'blur', function () {
  optionsList.forEach(option => option.classList.remove('active') )
  currentCount = -1;
  timer = setTimeout(() => {
    hideElem(dataList);
  },200)
})


function addCard (e,elem =  e.target) {
  countCards ++;
  form.style.gap = 300 + 'px';
  searchInput.value = '';
  const elementId = elem.getAttribute('data-id');
  arrRep.filter((item) => item.id == elementId)
    .forEach(({name, full_name, stargazers_count}) => {
      const card = createElement('div', 'card');
      card.innerHTML = elemMaket(name, full_name, stargazers_count);
      fragmentCard.append(card);
      reposList.append(fragmentCard);
      form.append(reposList);
    })
}

addListener(dataList,'click',(e) => addCard(e))

addListener(form,'click',(event) => {
  let target =event.target;
  if(target.className === 'card__btn-delete') {
    countCards--;
    if(countCards === 0){
      form.style.gap = 0 + 'px';
    }
    elementDelete(target)
  }
  else if (target.className === 'option-item') {
    hideElem(dataList);
  }
  else return;
})


addListener(form,'mouseover' , (e) => {
  if(e.target.className === 'option-item'){
    optionsList.forEach(option => option.classList.remove('active') )
    e.target.classList.add('active')
  }
})

addListener(form,'mouseout' , (e) => {
  if(e.target.className === 'option-item'){
    optionsList.forEach(option => option.classList.remove('active') )
    e.target.classList.remove('active')
  }

})

addListener(form,'submit', function(event) {
  event.preventDefault();
});


async function resultFunc (event) {

  if (!keyCodeStop.includes(event.keyCode)) {
    await loadRepositories()
  }
  if((elementIsInFocus(event.target) && hideElem(dataList) && (event.keyCode === 40 || event.keyCode === 38)) || searchInput.value){
    showElem(dataList)
  }
  if (event.keyCode === 40 && optionsList.length  && currentCount < optionsList.length) {
    currentCount++;
    if (currentCount < optionsList.length ) {
      addClassHoverElem(optionsList[currentCount],optionsList,'active')
    } else if (currentCount > optionsList.length - 2) {
      currentCount = 0;
      addClassHoverElem(optionsList[currentCount],optionsList,'active')
    }
  }
  if (event.keyCode === 38 && optionsList.length && currentCount >= 0) {
    currentCount--;
    if (currentCount < 0) {
      currentCount = 0;
    }
    addClassHoverElem(optionsList[currentCount],optionsList,'active')
  }
  if (event.keyCode === 13) {
    addCard(event,optionsList[currentCount]);
    hideElem(dataList);
  }
}


function loadRepositories() {
  getRepositories(searchInput.value)
}

searchInput.addEventListener('keyup', debounce(resultFunc, 300));