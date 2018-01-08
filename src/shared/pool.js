import EventEmitter from 'events'
import Utils from './utils';
import Config from './config'
import protocol from './protocol';

class Pool extends EventEmitter {
  constructor(coin) {
    super();
    this.coin = coin;
    this.config = Config.getInstance().coins[coin];
    this.currentPool = this.getPoolInfo();
    this.log =  Utils.log(this.constructor.name+':'+this.coin);
    this.on('job',this.onJob.bind(this));
    this.on('result',this.onResult.bind(this));
    this.on('notify',this.onNotify.bind(this));
  }
  start() {
    this.protocol = protocol(this.currentPool);
    this.protocol.on('job',(data) => { this.emit('job',data) });
    this.protocol.on('result',(data) => { this.emit('result',data) });
    this.protocol.on('notify',(data) => { this.emit('notify',data) });
    this.protocol.start();
  }
  onJob() {

  }
  onResult() {

  }
  onNotify() {

  }
  getPoolInfo() {
    let poolInfo = this.config.pools.shift();
    return Utils.getPoolInfo(poolInfo)
  }
}
export default Pool
