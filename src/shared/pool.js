import tls from 'tls'
import net from 'net'
import url from 'url'
import debug from 'debug';
import Utils from './utils';
import EventEmitter from 'events'
class Pool extends EventEmitter {
  constructor(coin,config) {
    super();
    this.coin = coin;
    this.config = config || {};
    this.debug = debug('tm:pool:'+coin);
    this.currentPool = null;
    this.sendId = 1;
    this.socket = null;
    this.status = 0;
    this.jobs = {};
    this.on('job',this.onJob.bind(this));
    this.on('error',this.onError.bind(this));
  }
  onData(data) {
    try {
        let jsonData = JSON.parse(data);
        if('id' in jsonData) {
          this.debug(`Result #${jsonData.id}:`+JSON.stringify(jsonData));
          if('error' in jsonData && jsonData.error != null && jsonData.error != 'null') {
            this.emit('error',jsonData.error);
          } else if('job' in jsonData.result) {
            this.emit('job',jsonData.result.job);
          } else {
            console.log('Unknown Data: ',jsonData)
          }
        } else {
          this.emit(jsonData.method,jsonData.params);
        }
    }
    catch (e) {
      this.debug(`Socket error from ${this.currentPool.href} Message: ${data}`);
      debug(e);
      this.connect();
    }
  }
  onJob(data) {
    if('job_id' in data && 'target' in data && 'blob' in data) {
      this.jobs[data.job_id] = data;
      this.debug(`New Job [${data.job_id}] with target '${data.target}'`);
    }
  }
  connect() {
    this.close();
    this.currentPool = this.getPoolInfo();
    this.debug(`Connecting to ${this.currentPool.href}`);
    this.status = 0;
    switch(this.currentPool.protocol) {
      case 'tls:':
      case 'ssl:':
      case 'stratum+tcps:':
        this.socket = tls.connect(this.currentPool.port,this.currentPool.hostname,{rejectUnauthorized: this.currentPool.allowSelfSignedSSL});
      break;
      case 'stratum:':
        this.socket = net.connect(this.currentPool.port,this.currentPool.hostname);
      break;
      default:
        console.error(`Not Support Protocol ${this.currentPool.protocol} '${this.currentPool.href}'`);
      break;
    }
    this.socket.on('connect',this.onConnect.bind(this));
    this.socket.on('error',this.onError.bind(this));
    this.socket.on('end',this.onEnd.bind(this));
    this.socket.on('data', this.onData.bind(this));
    return this;
  }
  login() {
    this.send('login', {
        login: this.currentPool.username || this.config.address || this.config.username,
        pass: this.currentPool.password || this.config.password,
        agent: 'tm-stratum-proxy/1.0.0'
    });
    return this;
  }
  share(data) {
    if (this.lastJob.id == data.jobID){
      this.sendData('submit', {
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
    let rawSend = {
        method: method,
        id: this.sendId++,
        params: params
    };
    this.socket.write(JSON.stringify(rawSend) + '\n');
    this.debug(`Send #${rawSend.id} to '${this.currentPool.href}': ${JSON.stringify(rawSend)}`);
    return this;
  }
  close() {
    if(this.socket != null) {
      this.debug(`Close Current Socket of ${this.currentPool.href}`);
      this.socket.end();
      this.socket.destroy();
      this.socket = null;
    }
  }
  onConnect() {
    this.socket.setEncoding('utf8');
    this.socket.setKeepAlive(true);
    console.log(`Connected to pool: ${this.currentPool.href}`);
    this.status = 1;
    this.emit('connect',this);
    this.login();
  }
  onError(err) {
    this.status = 2;
    this.debug(`Error on ${this.currentPool.href}`,err);
  }
  onEnd() {
    this.debug(`End Connection of '${this.currentPool.href}'`,err);
    this.emit('end');
  }
  getPoolInfo() {
    let poolInfo = this.config.pools.shift();
    return Utils.getUrl(poolInfo)
  }
  getPoolOptions() {
    return Utils.getParams(this.currentPool);
  }
}
export default Pool
