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
    this.protocol = protocol(this.currentPool);
    this.log =  Utils.log(this.constructor.name+':'+this.coin);
    this.protocol.on('job',(data) => { this.emit('job') });
    this.protocol.on('share',(data) => { this.emit('share') });
    this.protocol.on('notify',(data) => { this.emit('notify') });
    this.on('job',this.onJob.bind(this));
    this.on('share',this.onShare.bind(this));
    this.on('notify',this.onNotify.bind(this));
  }
  start() {
    this.protocol.start();
  }
  login(workerId) {
    return this.send('login',{
      _sequence: 1,
      username: this.currentPool.username || this.config.address || this.config.username,
      password: this.currentPool.password || this.config.password,
    });
  }
  share(data) {
    if (this.lastJob.id == data.jobID){
      this.send('submit', {
          job_id: data.jobID,
          nonce: data.nonce,
          result: data.resultHash,
          workerNonce: data.workerNonce,
          poolNonce: data.poolNonce
      });
    }
  }
  send(method, params={}) {
    if (!this.socket.writable){
        return false;
    }
    let sequence = this.sequence;
    if('_sequence' in params) {
      sequence = params._sequence;
    }
    let sendObj = this.protocol.getRequest(sequence,method,params);
    this.request[this.sequence] = false;
    this.sequence++;
    this.socket.write(JSON.stringify(sendObj) + '\n');
    this.log.debug(`Send #${sequence} to '${this.currentPool.href}': ${JSON.stringify(sendObj)}`);
    return this;
  }
  reset() {
    this.status = 0;
    this.sequence = 1;
    this.jobs = {};
    this.retry = 0;
  }
  close() {
    this.retry++;
    if(this.socket != null) {
      this.socket.end();
      this.socket.destroy();
      this.socket = null;
      this.emit('close');
    }
  }
  onData(data) {
    try {
      let datas = this.protocol.getResponse(data);
      console.log(datas);
      datas.forEach((item) => {
        console.log(`RESPONSE #${item.id}`,item);
      })      
    }
    catch (e) {
      this.log.debug(`Socket error from ${this.currentPool.href} Message: ${data}`);
      this.log.debug(e);
      this.connect();
    }
  }
  onJob(data) {
    if('job_id' in data && 'target' in data && 'blob' in data) {
      this.jobs[data.job_id] = data;
      this.log.info(`New Job [${data.job_id}] with target '${data.target}'`);
    }
  }
  onShare(data) {
    console.log('SHARE',data);
  }
  onConnect() {
    if(this.socket != null) {
      this.status = 1;
      this.protocol.afterConnect(this.socket);
      this.log.info(`Connected to pool: ${this.currentPool.href}`);
      this.login();
    }
  }
  onClose() {
    if(this.socket != null) {
      this.log.info(`Close Connection To ${this.currentPool.href}`);
    }
    if(this.config.pools.length > 0) this.connect();
  }
  onError(err) {
    this.log.info(`Error on ${this.currentPool.href}`,err.message);
    this.close();
  }
  onEnd() {
    this.log.info(`End Connection To ${this.currentPool.href}`);
    this.close();
  }
  getPoolInfo() {
    let poolInfo = this.config.pools.shift();
    return Utils.getPoolInfo(poolInfo)
  }
}
export default Pool
