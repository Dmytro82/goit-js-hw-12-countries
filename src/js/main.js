import { debounce } from 'lodash';
import { error, Stack } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import fetchCountries from './fetchCountries';
import countryCard from '../templates/country.hbs';
import countriesList from '../templates/countries.hbs';

const refs = {
  input: document.querySelector('.input'),
  country: document.querySelector('.country-container'),
};

refs.input.addEventListener('input', debounce(onInput, 1000));
refs.country.addEventListener('click', e => {
  if (e.target.className === 'name-country') {
    refs.input.value = e.target.innerText;
    setTimeout(() => onInput(), 250);
  }
  return;
});

function onInput() {
  if (!refs.input.value) return markupOutput(0);

  if (!refs.input.value.match(/^[a-zA-Z,() ']*$/)) {
    markupOutput(0);
    return errMsg('415', 'Используйте латинские буквы в запросе!');
  }

  fetchCountries(refs.input.value).then(data => {
    if (!data.length) {
      markupOutput(0);
      return errMsg(
        data.status,
        `Страна с названием "${refs.input.value}" не найдена!`,
      );
    }

    if (data.length > 10) {
      markupOutput(0);
      errMsg('300', `Найдено ${data.length} совпадений!`);
    } else if (data.length > 2 && data.length <= 10) {
      markupOutput(countriesList(data));
    } else {
      markupOutput(countryCard(data[0]));
    }
    return;
  });

  function markupOutput(markup) {
    if (markup) {
      refs.country.innerHTML = markup;
    } else {
      return (refs.country.innerHTML = '');
    }
  }

  function errMsg(numErr, message) {
    const myStack = new Stack({
      modal: true,
    });

    return error({
      title: `Ошибка №  ${numErr}`,
      text: message,
      delay: 1000,
      stack: myStack,

      icon: false,
      closer: false,
      sticker: false,
    });
  }
}
