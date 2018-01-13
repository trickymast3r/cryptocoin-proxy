import EventEmitter from 'events';
import Utils from '../utils';
import tls from 'tls';
import net from 'net';

class Socket extends EventEmitter {
  constructor(config) {
    super();
    this.userAgent = 'TmPoolProxyv1.0.0';
    this.config = config;
    this.buffer = '';
    this.log = Utils.log(this.constructor.name);
    this.on('response', this.response.bind(this));
    this.on('data', this.onData.bind(this));
    this.on('connect', this.onConnect.bind(this));
    this.on('close', this.onClose.bind(this));
    this.on('error', this.onError.bind(this));
    this.on('end', this.onEnd.bind(this));
  }
  start() {
    if (this.socket != null) this.close();
    if (this.config.protocol.indexOf('ssl') != -1 || this.config.protocol.indexOf('tls') != -1) {
      this.socket = new tls.TLSSocket({ rejectUnauthorized: this.config.allowSelfSSL || false });
    } else {
      this.socket = new net.Socket();
    }
    this.log.info(`Connecting to '${this.config.href}'`);
    this.socket.setEncoding('utf8');
    this.socket.setKeepAlive(true);
    this.socket.setNoDelay(true);
    this.socket.setTimeout(10000);
    this.socket.on('timeout', () => { this.emit('error', new Error('Timed out')); });
    this.socket.on('connect', () => { this.emit('connect'); });
    this.socket.on('error', (err) => { this.emit('error', err); });
    this.socket.on('close', (err) => { this.emit('close', err); });
    this.socket.on('end', () => { this.emit('end'); });
    this.socket.on('data', (data) => { this.emit('data', data); });
    this.socket.connect(this.config.port, this.config.hostname);
    return this;
  }
  close() {
    if (this.socket != null) {
      this.socket.end();
      this.socket.destroy();
      this.emit('close');
    }
  }
  request(data) {
    if (!this.socket.writable) throw new Error('Socket is not writable', data);
    try {
      this.log.debug(`Send Data ${data} [${this.config.href}]`);
      this.socket.write(`${data}\n`);
    } catch (e) {
      throw new Error(`Error when send data [${this.config.href}]`, data, e);
    }
  }
  response(data) {
    if (data.trim() == '') return;
    this.log.debug(`Get Response ${data} [${this.config.href}]`);
  }
  onData(data) {
    try {
      if (data.indexOf('\n') != -1) {
        data = data.split('\n').forEach((item) => {
          item = item.toString().replace(/[\r\x00]/g, '');
          if (item.trim() == '') return false;
          this.onData(item);
          return item;
        });
      } else {
        this.emit('response', data);
      }
    } catch (e) {
      throw new Error([`Error when receive data from [${this.config.href}]`, data, e]);
    }
  }
  onConnect() {
    this.log.info(`Connected to '${this.config.href}'`);
  }
  onClose() {
    if (this.socket != null) {
      this.socket = null;
      this.log.info(`Close Connection to '${this.config.href}'`);
    }
  }
  onError(err) {
    this.log.info(`Error on '${this.config.href}'`, err.message);
    this.close();
  }
  onEnd() {
    this.log.info(`End Connection To '${this.currentPool.href}'`);
    this.close();
  }
}
export default Socket;
