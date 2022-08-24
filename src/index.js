import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';

import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener(
  'input',
  debounce(() => {
    if (!refs.searchBox.value) {
      cleanCuntryInfo();
      cleanCountryList();
    }
    fetchCountries(refs.searchBox.value.trim())
      .then(showCountry)
      .catch(showError);
  }, DEBOUNCE_DELAY)
);

function showCountry(data) {
  if (data.length > 10) {
    Notify.success(
      '"Too many matches found. Please enter a more specific name."'
    );
    cleanCuntryInfo();
    cleanCountryList();
  } else if (data.length > 1) {
    refs.countryList.innerHTML = markupList(data);
    cleanCuntryInfo();
  } else {
    refs.countryInfo.innerHTML = markupCountry(data);
    cleanCountryList();
  }
}

function markupList(data) {
  return data.reduce(
    (markup, { flags: { svg: flag }, name: { official: name } }) =>
      (markup += `<li><img src="${flag}" width="45" alt="Flag of${name}"> <span>${name}</span></li>`),
    ''
  );
}

function cleanCountryList() {
  if (refs.countryList.innerHTML) {
    refs.countryList.innerHTML = '';
  }
}

function cleanCuntryInfo() {
  if (refs.countryInfo.innerHTML) {
    refs.countryInfo.innerHTML = '';
  }
}

function markupCountry(data) {
  const {
    flags: { svg: flag },
    name: { official: name },
    capital,
    population,
    languages,
  } = data[0];
  const listOfLanguages = Object.values(languages).join(', ');
  return `
    <p>
      <img src="${flag}" width="30" alt="Flag of${name}" /> <span>${name}</span>
    </p>
    <ul>
      <li><span>Capital: </span>${capital}</li>
      <li><span>Population: </span>${population}</li>
      <li><span>Languages: </span>${listOfLanguages}</li>
    </ul>
    `;
}

function showError(error) {
  Notify.failure('"Oops, there is no country with that name"');
}
