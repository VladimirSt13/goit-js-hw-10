import './css/styles.css';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
};

refs.input.addEventListener('input', debounce(onChangeInput, DEBOUNCE_DELAY));

function onChangeInput(evt) {
  console.log('debouced', evt.target.value);
}

function fetchCountries(name) {}
