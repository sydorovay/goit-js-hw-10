import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { showNotification } from './js/notiflixMessage';
import debounce from 'lodash.debounce';
// import showNotification from 'notiflix';

// значення затримки DEBOUNCE
const DEBOUNCE_DELAY = 300;

// посилання на елементи
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

// слухач подій для поля input з затримкою DEBOUNCE
input.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function clearCountryMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function onInputSearch(event) {
	event.preventDefault();
	const searchCountryName = event.target.value.trim();
	if (!searchCountryName) {
		clearCountryMarkup();
		return;
	}
}

