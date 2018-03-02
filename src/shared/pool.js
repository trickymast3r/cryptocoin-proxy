import BaseEvent from '@mrjs/core/event';
import Utils from './utils';
import Config from './config';
import Protocol from './protocol';

class Pool extends BaseEvent {
  constructor() {
    super();
    this.config = Config.getInstance().coins[coin];
    this.current = {};
    this.on('master.message', this.fromMaster.bind(this));
    this.on('socket.message', this.fromSocket.bind(this));
  }
  start() {
    this.protocol = new Protocol(this.currentPool);
    this.protocol.on('job', (data) => { this.emit('job', data); });
    this.protocol.on('result', (data) => { this.emit('result', data); });
    this.protocol.on('notify', (data) => { this.emit('notify', data); });
    this.protocol.start();
  }
  onJob() {
    return this;
  }
  onResult() {
    return this;
  }
  onNotify() {
    return this;
  }
}
export default Pool;
