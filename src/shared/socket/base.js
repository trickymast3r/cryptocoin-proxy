//@flow
import BaseEvent from '@mrjs/core/event';
import { ERRORS, EVENTS } from './const';

const defaultOptions = {
  encoding: 'utf-8',
  keepAlive: true,
  noDelay: true,
  maxPayload: 128000000,
  timeOut: 60000,
  pingInterval: 25000,
  perMessageDeflate: false,
  httpCompression: false,
  handleProtocols: null,
  clientTracking: true,
  verifyClient: null,
};
/* eslint-disable */
class Base extends BaseEvent {
  ERRORS: { key: string } = ERRORS;
  EVENTS: { key: string } = EVENTS;
  constructor(options: Object) {
    super();
    this.options = Object.assign(defaultOptions, options);
    this.connections = new Set();
    this.state = 0;
    this.setup(this);
  }
  async setup(server: events$EventEmitter) {
    server.on('listening', this.$listening.bind(this));
    server.on('connect', this.$connection.bind(this));
    server.on('connection', this.$connection.bind(this));
    server.on('disconnect', this.$close.bind(this));
    server.on('close', this.$close.bind(this));
    server.on('end', this.$close.bind(this));
    server.on('error', this.$error.bind(this));
    server.on('timeout', this.$error.bind(this));
    server.on('data', this.$data.bind(this));
  }
  getConnections() {
    return this.connections;
  }
  async close(socket: net$Socket) {
    this.state = 0;
    this.destroy();
  }
  async send() {
    return this;
  }
  async use() {
    return this;
  }

  $connection(socket: net$Socket) {
    if (!this.connections.has(socket)) return;
  }
  $data(client: net$Socket, data: string) {}
  $error(client: net$Socket, err: Error) {
    this.close(client);
  }
  $close(client: net$Socket) {
    this.close(client);
  }
  to() {}
  in() {}
  compress() {}
  dispatch() {}
  use() {}
  run() {}
  ack() {}
  leaveAll() {}
  leave() {}
  write() {}
  packet() {}
  join() {}
  request() {}
}
export default Base;
