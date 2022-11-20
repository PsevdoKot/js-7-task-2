class WeatherApplication {
  constructor() {
    const widget = new Widget(0);
    widget.setUserLocation();
    this.widgets = [widget];
  }

  createNewWidget(widgetId) {
    const newWidget = new Widget(widgetId);
    this.widgets.push(newWidget);
  }

  getLastWidgetId() {
    return this.widgets[this.widgets.length - 1].id;
  }
}
