var data = {
  endpoint: 'ws://192.168.3.32:3000/linechart'
};
var dataSource = new WebsocketDatasource(data);
linechart = new Linechart(dataSource, {'selector': '#linechart-streaming', height: 250, area:true, maxNumberOfElements: 10});
dataSource.start();
