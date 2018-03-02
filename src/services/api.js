//@flow
import BaseEvent from '@mrjs/core/event';

class ApiService extends BaseEvent {
  async init() {
    this.emit('loading');
  }
  async start() {
    this.emit('start');
  }
  async stop() {
    this.emit('stop');
  }
  async restart() {
    this.emit('restart');
  }
}

export default ApiService;
