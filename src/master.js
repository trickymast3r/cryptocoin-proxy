import cluster from 'cluster';
import EventEmitter from 'events';
import _ from 'lodash';
import Pool from './shared/pool';
import Utils from './shared/utils';

class Master extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.workers = [];
    this.activePools = {};
    this.log = Utils.log(this.constructor.name);
    const masterEvents = ['disconnect', 'exit', 'fork', 'listening', 'message', 'online', 'setup'];
    masterEvents.forEach((item) => {
      cluster.on(item, (...args) => {
        this.emit(item, ...args);
      });
    });
  }
  async start(numWorkers) {
    _.range(numWorkers).forEach(id => this.addWorker(id));
    return this;
  }
  addWorker(id) {
    this.workers[id] = cluster.fork();
  }
  addPools(pools) {
    _.each(pools, (pool) => {
      this.addPool(pool);
    });
  }
  addPool(coin) {
    if (!_.has(this.activePools, coin)) {
      this.activePools[coin] = new Pool(coin);
    }
    return this;
  }
}
export default Master;
