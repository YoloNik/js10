import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import card from './templates/card.hbs';
import cardList from './templates/list.hbs';

const DEBOUNCE_DELAY = 300;

const userSerch = document.querySelector('#search-box');
const cardContainer = document.querySelector(`.country-info`);
const countryList = document.querySelector(`.country-list`);

userSerch.addEventListener(`input`, debounce(onChangeInput, DEBOUNCE_DELAY));
let countryName;
function onChangeInput(e) {
  countryName = e.target.value.trim();
  if (countryName !== ``) {
    fetchCountries(countryName).then(data => {
      renderCardList(data);
    });
  }
  clearPages();
}

function fetchCountries(countryName) {
  return fetch(
    `https://restcountries.com/v2/name/${countryName}?fields=name,capital,population,flags,languages`,
  )
    .then(response => {
      return response.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => console.log(error));
}

function renderCardList(countries) {
  countryList.innerHTML = ``;
  cardContainer.innerHTML = ``;
  if (countries.length >= 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countries.length < 10 && countries.length > 2) {
    cardContainer.innerHTML = ``;
    const cardListTemp = countries
      .map(country => {
        return cardList(country);
      })
      .slice(0, 10)
      .join(``);
    return (countryList.innerHTML = cardListTemp);
  } else if (countries.length === 1) {
    countryList.innerHTML = ``;
    cardContainer.innerHTML = card(countries[0]);
  } else {
    Notiflix.Notify.failure('Oops, there is no country with that name');
  }
}

function clearPages() {
  if (countryName === ``) {
    countryList.innerHTML = ``;
    cardContainer.innerHTML = ``;
  }
}
