export default function fetchCountries(searchQuery) {
  return fetch(`https://restcountries.com/v2/name/${searchQuery}`)
    .then(response => {
      if (response.ok) return response.json();

      throw new Error(console.log(Error));
    })
    .then(data => data)
    .catch(error => console.log(error));
}
