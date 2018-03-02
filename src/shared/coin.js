import BaseEvent from '@mrjs/core/event';
import Config from './config';
import Coins from './coins';
import Pool from './pool';

const appConfig = Config.getInstance();
class Coin extends BaseEvent {
  constructor(coin) {
    super();
    this.state = 0;
    this.coin = coin;
  }
  reload() {
    this.config = false;
    if (Object.keys(Coins).indexOf(this.coin) > -1) {
      this.config = appConfig.get(`coins.${coin}`);
      this.state = 1;
    }
    return this.config;
  }
  async start() {
    if (!this.reload() && this.state === 0) {
      return new Error(`ERROR_CONFIG_${this.config.coin}`);
    }
    if (this.current) this.current.stop();
    return this;
  }
  current() {
    return this.current;
  }
  next() {
    this.close();
    this.current = this.config.pools.shift();
    this.emit('coin.pool.connecting', this.current);
    return this.current;
  }
  close() {
    if (this.current) {
      this.emit('coin.pool.closing', this.current);
    }
    return this;
  }

}
export default Coin;
