window.addEventListener('load', () => {
  const weatherApp = new WeatherApplication();

  const initialWidget = document.querySelector('.widget').cloneNode(true);
  document.querySelector('.header__more-widget-btn').addEventListener('click', () => {
    let newWidgetId = weatherApp.getLastWidgetId() + 1;
    const newWidgetHTML = initialWidget.cloneNode(true);
    newWidgetHTML.id = `widget_${newWidgetId}`;
    newWidgetHTML.querySelector('.widget__map').id = `widget__map-${newWidgetId}`;
    document.querySelector('.weather').appendChild(newWidgetHTML);
    weatherApp.createNewWidget(newWidgetId);
  });
});
