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
    this.socket = null;
    this.retry = 0;
    this.log =  Utils.log(this.constructor.name+':'+this.coin);
    this.on('job',this.onJob.bind(this));
    this.on('share',this.onShare.bind(this));
    this.on('data',this.onData.bind(this));
    this.on('connect',this.onConnect.bind(this));
    this.on('close',this.onClose.bind(this));
    this.on('error',this.onError.bind(this));
    this.on('end',this.onEnd.bind(this));
  }
  onData(data) {
    try {
        let jsonData = JSON.parse(data);
        if('id' in jsonData && 'result' in jsonData) {
          this.log.debug(`Result #${jsonData.id}:`+JSON.stringify(jsonData.result));
          if('error' in jsonData && jsonData.error != null && jsonData.error != 'null') {
            this.emit('error',jsonData.error);
          } else if('job' in jsonData.result) {
            this.emit('job',jsonData.result.job);
          } else {
            this.log.warn('Unknown Data: ',jsonData)
          }
        } else {
          this.emit(jsonData.method,jsonData.params);
        }
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
  connect() {
    this.close();
    if(this.retry > 5) {
      this.retry = 0;
      this.currentPool = this.getPoolInfo();
    }
    this.log.debug(`Connecting to '${this.currentPool.href}' #${this.retry}`);
    this.socket = Utils.connect(this.currentPool);
    this.socket.on('connect',() => { this.emit('connect') });
    this.socket.on('error',(err) => { this.emit('error',err) });
    this.socket.on('end',() => { this.emit('end') });
    this.socket.on('data', (data) => { this.emit('data',data) });
    return this;
  }
  login(workerId) {
    return this.send('login', {
        id: 1,
        login: this.currentPool.username || this.config.address || this.config.username,
        pass: this.currentPool.password || this.config.password,
        agent: this.config.agent
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
  keepAlive() {
    this.send('keepalived',{id: this.sequence,})
  }
  send(method, params={}) {
    if (!this.socket.writable){
        return false;
    }
    let sendID = this.sequence;
    if('id' in params) {
       sendID = params.id;
       delete params.id;
    }
    let rawSend = {
        method: method,
        id: sendID,
        params: params
    };
    this.sequence++;
    this.socket.write(JSON.stringify(rawSend) + '\n');
    this.log.debug(`Send #${rawSend.id} to '${this.currentPool.href}': ${JSON.stringify(rawSend)}`);
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
  onConnect() {
    if(this.socket != null) {
      this.status = 1;
      this.socket.setEncoding('utf8');
      this.socket.setKeepAlive(true);
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
