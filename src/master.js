import BaseEvent from '@mrjs/core/event';
import Coin from '@shared/coin';
import cluster from 'cluster';

class Master extends BaseEvent {
  constructor(config) {
    super();
    this.config = config;
    this.state = 0;
    this.workers = {};
    this.pools = {};
    this.on('message', this.fromCoin.bind(this));
    this.on('exit', this.fromCoin.bind(this, { code: 'exit' }));
    cluster.on('message', this.fromWorker.bind(this));
    cluster.on('exit', this.fromWorker.bind(this, { code: 'exit' }));
  }
  fromWorker(message) {
    if (message === '') return;
    switch (message.code) {
      case 'getJob':
        this.status();
        break;
      default:
        this.status();
      // no default
    }
  }
  fromCoin(message) {
    if (message === '') return;
    switch (message.code) {
      case 'getJob':
        this.status();
        break;
      default:
        this.status();
      // no default
    }
  }
  start(numWorkers) {
    if (this.state !== 0) return this;
    this.state = 1;
    // start workers
    this.addWorkers(numWorkers);
    // start coins services
    this.addCoins(this.config.coins);
    // start pools services
    this.addPool();
    return this;
  }
  stop() {
    return this;
  }
  restart() {
    return this;
  }
  reload() {
    return this;
  }
  status() {
    return this.state;
  }
  addWorkers(numWorkers) {
    Array(numWorkers)
      .fill('w')
      .forEach(this.addWorker.bind(this));
    return this;
  }
  addWorker() {
    const worker = cluster.fork();
    this.workers[worker.process.pid] = worker.id;
    return this;
  }
  addCoins(coins) {
    Object.keys(coins).forEach((i) => {
      this.addPool(coins[i]);
    });
    return this;
  }
  addCoin(coin) {
    const coinManager = new Coin(coin);
    this.coins[coin] = coinManager.start();
    return this;
  }
}
export default Master;
