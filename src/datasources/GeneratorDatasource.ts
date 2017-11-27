import Datasource from './Datasource';
import { unwind } from '../utils/data/transforming';
import { discardProperties } from '../utils/data/filtering';
import StorageService from '../services/StorageService';
import Config from '../Config';
import StreamingStrategy from '../charts/enums/StreamingStrategy';
import { fitArrayByOldAndNewValue } from '../utils/array/array';
import { Observable, Observer, Subject, Subscription } from 'rxjs';
/**
 *
 * This datasource generates data using a custom function and timeout.
 * @export
 * @class GeneratorDatasource
 * @extends {Datasource}
 */
class GeneratorDatasource extends Datasource {

  private _observable: Observable<any>;

  private openStream: Observable<any>;
  private closeStream: Observable<any>;
  private errorStream: Observable<any>;
  private messageStream: Observable<any>;

  private subscriptionOpenStream: Subscription;
  private subscriptionCloseStream: Subscription;
  private subscriptionErrorStream: Subscription;
  private subscriptionMessageStream: Subscription;

  private stopped: boolean = true;

  /**
   * Default constructor
   */
  constructor(generator: Function, timeout: number) {
    super();

    this._observable = Observable.create(function(observer: any) {
      // From: https://stackoverflow.com/a/41388355/2563749

      observer.next({ x: Math.random(), y: Math.random() });

      // recursively send a random number to the subscriber
      // after a random delay
      (function push() {
        setTimeout(
          () => {
            observer.next(generator());
            push();
          },
          timeout
        );
      })();

      // clear any pending timeout on teardown
      return () => clearTimeout(timeout);
    });
  }

  public start() {
    if (this.stopped) {
      console.warn('Not yet implemented');
      this.stopped = false;
    }
  }
  public stop() {
    if (!this.stopped) {
      console.warn('Not yet implemented');
      this.stopped = true;
    }
  }

  public subscription(): Observable<any> {
    return this._observable;
  }
}

export default GeneratorDatasource;
