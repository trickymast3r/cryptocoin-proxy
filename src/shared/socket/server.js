//@flow
/* eslint-disable */
import BaseSocket from './base';
import net from 'net';

const debug = require('debug')('crypo:socket:server');

class Server extends BaseSocket {
  async setup(server: events$EventEmitter) {
    super.setup(server);
    debug(`Setup New Server: ${this.options}`);
    this.namespaces = {};
    this.methods = {};
    return this;
  }
  async create(cb?: Function) {
    if (this.server && this.server.isPrototypeOf(net.Server))
      return this.server;
    if (this.state !== 0) return this.server;
    delete this.server;
    this.server = net.createServer(this.options);
    this.catchAll(this.server);
    return this.server;
  }
  async attach(server?: net$Server, cb?: Function) {
    if(cb && typeof cb === 'function') cb.apply(null,this.server);
    return this.server;
  }
  async listen(cb?: Function) {
    return this.create().then((server) => {
      server.listen(this.options, () => {
        if(cb && typeof cb === 'function') cb.apply(null,this.server);
      });
    });
  }
  $listening() {
    debug(`Server listening on ${this.server.host}:${this.server.port}.`);
  }
  $connection(socket: net$Socket) {
    if (!this.connections.has(socket)) return;
    debug(`Client %s connect to server.`, socket.address());
  }
  $data(client: net$Socket, data: string) {
    debug(`Client %s sent data [%s] .`,client.address(),data);
  }
  $error(client: net$Socket, err: Error) {
    debug(`Client %s has been closed connection`,client.address());
    this.close(client);
  }
  $close(client: net$Socket) {
    debug(`Client %s has been closed connection`,client.address());
    this.close(client);
  }
  close(client: net$Socket, cb?: Function) {
    debug(`Server close connection withh  %s.`, client.address());
    this.clients.delete(client);
    return this;
  }
}

export default Server;
