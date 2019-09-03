// Init
const storage = new Storage();
// Get Stored location data
const weatherLocaction = storage.getLocationData();

const weather = new Weather(weatherLocaction.city, weatherLocaction.country);
const ui = new UI();

// Get weather on DOM load
document.addEventListener("DOMContentLoaded", getWeather);

// Change location event
document.getElementById("w-change-btn").addEventListener("click", e => {
  const city = document.getElementById("city").value;
  const country = document.getElementById("country").value;

  weather.changeLocation(city, country);
  storage.setLocationData(city, country);

  // get and display new weather
  getWeather();

  // close modal (only jQuery)
  $("#locModal").modal("hide");
});

function getWeather() {
  weather
    .getWeather()
    .then(results => {
      ui.paint(results);
    })
    .catch(console.log);
}
