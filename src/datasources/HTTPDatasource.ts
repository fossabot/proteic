import Datasource from './Datasource';
import { request } from 'd3';
import { Observable, Subject, Subscription } from 'rxjs';

/**
 *
 * This datasource set up a connection to a http server.
 * @export
 * @class HTTPDatasource
 * @extends {Datasource}

 */
export default class HTTPDatasource extends Datasource {
  public subscription(): Subject<any> {
      return null;
  }
}
