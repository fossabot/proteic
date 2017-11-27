import { Observable, Subject, Subscription } from 'rxjs';
import Config from '../Config';

/**
 *
 * A Datasource is the name given to the connection set up to a data endpoint.
 * This class defines the common methods for the datasources,
 * such as start() and stop().
 *
 * @export Default export: Datasource class
 *
 * @class Datasource The Datasource class
 *
 */
abstract class Datasource {

    constructor() {}

    abstract subscription(): Observable<any>;
}

export default Datasource;
