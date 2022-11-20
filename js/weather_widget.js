const openWeatherApiKey = "2259fde0463a564d93ef7f605823fc31";


class Widget {
  constructor(id, latitude=0, longitude=0) {
    this.id = id;
    this.latitude = latitude;
    this.longitude = longitude;

    this.widgetHTML = document.querySelector(`#widget_${id}`);
    this.widgetHTML.querySelector('.widget__submit-btn').addEventListener('click', () => {
      if (this.setLocationUsingInput())
        this.setWeatherInfo();
    })
  }
  

  setUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.widgetHTML.querySelector('#latitude').value = this.latitude;
        this.widgetHTML.querySelector('#longitude').value = this.longitude;
      });
    }
  }


  setLocationUsingInput() {
    const lat = this.widgetHTML.querySelector('#latitude').value;
    const long = this.widgetHTML.querySelector('#longitude').value;
    if (!lat || !long || isNaN(lat) || isNaN(long)) {
      this.widgetHTML.querySelector('#widget__invalid-text').style.visibility = 'visible';
      return false;
    }
    else {
      this.widgetHTML.querySelector('#widget__invalid-text').style.visibility = 'hidden';
      this.latitude = lat;
      this.longitude = long;
      return true;
    }
  }


  async setWeatherInfo() {
    this.widgetHTML.querySelector('#widget__loading-text').style.visibility = 'visible';
    const weatherData = await this._getLocationWeatherData();
    const locationTime = await this._getLocationTime();
    this._updateWidgetHTML(weatherData, locationTime);
    this._updateWidgetMap();
    this.widgetHTML.querySelector('#widget__loading-text').style.visibility = 'hidden';
  }


  _getLocationWeatherData() {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.latitude}&lon=${this.longitude}&appid=${openWeatherApiKey}&units=metric`)
      .then((response) => {
        return response.json();
      })
      .catch((err) => {
        throw new Error(`Возникла ошибка при отправке запроса погоды на openweathermap:\n${err}`);
      })
      .then((data) => {
        return { 
          location: data.name,
          temperature: data.main.temp,
          iconType: data.weather[0].icon,
          description: data.weather[0].main,
          windStrength: data.wind.speed,
          pressure: data.main.pressure,
          humidity: data.main.humidity,
          temperatureFeelsLike: data.main.feels_like
        }
      })
      .catch((err) => {
        throw new Error(`Возникла ошибка при расшифровке запроса погоды:\n${err}`);
      });;
  }


  _getLocationTime() {
    return fetch(`http://htmlweb.ru/json/geo/timezone?latitude=${this.latitude}&longitude=${this.longitude}&country=RU`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data.time;
      })
      .catch((err) => {
        throw new Error(`Возникла ошибка при запросе местного времени локации с htmlweb:\n${err}`)
      });
  }


  _updateWidgetHTML(weatherInfo, locationTime) {
    this.widgetHTML.querySelector('.widget__loc-name').textContent = weatherInfo.location;
    this.widgetHTML.querySelector('.widget__loc-time').textContent = locationTime;
    this.widgetHTML.querySelector('.widget__temp').textContent = `${weatherInfo.temperature.toFixed(1)}°C`;
    this.widgetHTML.querySelector('.widget__icon').src = `http://openweathermap.org/img/wn/${weatherInfo.iconType}@2x.png`;
    this.widgetHTML.querySelector('.widget__desc').textContent = weatherInfo.description;
    this.widgetHTML.querySelector('.widget__wind-strength-space').textContent = weatherInfo.windStrength;
    this.widgetHTML.querySelector('.widget__pressure-space').textContent = Math.round(weatherInfo.pressure * 0.75);
    this.widgetHTML.querySelector('.widget__humidity-space').textContent = weatherInfo.humidity;
    this.widgetHTML.querySelector('.widget__temp-feels-like-space').textContent = weatherInfo.temperatureFeelsLike.toFixed(1);

    this.widgetHTML.querySelector('.widget__loc-info').style.visibility = 'visible';
    this.widgetHTML.querySelector('.widget__main-info').style.visibility = 'visible';
    this.widgetHTML.querySelector('.widget__add-info').style.visibility = 'visible';
  }


  _updateWidgetMap() {
    this.widgetHTML.querySelector('.widget__map').replaceChildren();
    const [id, latitude, longitude] = [this.id, this.latitude, this.longitude];
    ymaps.ready(init);
    function init() {
      const map = new ymaps.Map(`widget__map-${id}`, {
        center: [latitude, longitude],
        zoom: 8,
        controls: []
      });
      const marker = new ymaps.GeoObject({
        geometry: {
          type: "Point",
          coordinates: map.getCenter()
        }
      });
      map.geoObjects.add(marker);
    }
  }
}