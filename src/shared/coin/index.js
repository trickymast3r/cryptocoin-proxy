import Utils from '../utils';
import Config from '../config'
const EventEmitter = require('events');

class Coin extends EventEmitter {
  constructor(coin) {
    super();
    this.log =  Utils.log(this.constructor.name);
    this.coin = coin;
    this.initialize();
  }
  initialize() {
    if(Config.getInstance().coins.hasOwnProperty(this.coin)) Object.assign(this,Config.getInstance().coins[this.coin],Config.getInstance().default);
  }
  getPools() {
    return this.pools
  }
  getCurrentPool() {
    return this.currentPool
  }
  swithPool() {
    this.currentPool = this.config.pools.shift();
    this.emit('switchPool',this.currentPool)
    return this.currentPool;
  }
}

export default Coin
