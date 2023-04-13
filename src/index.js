import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

// значення затримки DEBOUNCE
const DEBOUNCE_DELAY = 300;

// отримуємо посилання на елементи
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
// доддаємо слухач подій input з функцією пошуку країни і затримкою DEBOUNCE
input.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

// створюємо функцію, яка буде очищувати список країн і отриману інформацію
function resetMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

// Cтворюємо функцію пошуку країни за отриманим значенням в input.
function onSearchCountry(event) {
  // скасовуємо стандартну поведінку браузера
  event.preventDefault();
  // Виконуємо санітизацію введеного рядка методом trim()
  const inputValue = event.target.value.trim();
  // Якщо значення input не існує повертаємо чисту розмітку
  if (!inputValue) {
    resetMarkup();
    return;
  }
  // Якщо у відповіді бекенд повернув більше ніж 10 країн, в інтерфейсі з'являється повідомлення про те, що назва повинна бути специфічнішою Для повідомлень використовуємо бібліотеку notiflix.
  fetchCountries(inputValue)
    .then(returnedСountries => {
      if (returnedСountries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        console.log('Too many matches. enter more characters!');
        // Якщо бекенд повернув від 2-х до 10-и країн, під тестовим полем відображається список знайдених країн. Кожен елемент списку складається з прапора та назви країни.
      } else if (
        returnedСountries.length >= 2 &&
        returnedСountries.length <= 10
      ) {
        resetMarkup();
        createCountryList(returnedСountries);
        console.log('list of Countries found');
        // Якщо результат запиту - це масив з однією країною, в інтерфейсі відображається розмітка картки з даними про країну: прапор, назва, столиця, населення і мови.
      } else {
        resetMarkup();
        createCountryInfo(returnedСountries);
        console.log('Country found!');
      }
    })
    //  обробимо помилку і додамо повідомлення
    .catch(() => {
      resetMarkup();
      Notiflix.Notify.failure('Oops, there is no country with that name');
      console.log('Error. check the entered country name!');
    });
}

// створимо розмітку для списку країн з svg-прапором та official-назвою країни
function createCountryList(returnedСountries) {
  const markupCountryTitle = returnedСountries
    .map(({ name, flags }) => {
      return `<li class="countries-item">
        <img class="countries-img" src="${flags.svg}" alt="flag" width = 24/>
        <p class="countries-names">${name.official}</p>
      </li>`;
    })
    .join('');
  // повертаємо розмітку всавлену в hnml/countryList
  return countryList.insertAdjacentHTML('beforeend', markupCountryTitle);
}

// створюємо розмітку з інформацією про країну
function createCountryInfo(returnedСountries) {
  const markupCountryInfo = returnedСountries.map(
    ({ name, capital, population, flags, languages }) => {
      return `
			<div class="сountry-found">
  <div class="country-title">
    <img class="country-img" src="${flags.svg}" alt="flag" width = 50>
    <p class="country-name">${name.official}</p>
  </div>
  <ul class="country-info-list">
      <li class="country-item"> 
			<p class="country-info"> <b>Capital:</b> ${capital}</p>
  
      </li>
      <li class="country-item">
			
    <p class="country-info"><b>Population:</b> ${population}</p>
      </li>
      <li class="country-item"> 
    <p class="country-info"><b>Languages</b>:${Object.values(languages).join(
      ', '
    )} </p>
      </li>
  </ul>;
			</div>`;
    }
  );
  // повертаємо розмітку всавлену в hnml/countryInfo
  return countryInfo.insertAdjacentHTML('beforeend', markupCountryInfo);
}
