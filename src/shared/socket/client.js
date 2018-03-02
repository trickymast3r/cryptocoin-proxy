//@flow
/* eslint-disable */
import BaseSocket from './base';
class Client extends BaseSocket {

  setup() {
    this.nsps = {};
    this.path(opts.path || '/socket.io');
    this.serveClient(false !== opts.serveClient);
    this.parser = opts.parser || parser;
    this.encoder = new this.parser.Encoder();
    this.adapter(opts.adapter || Adapter);
    this.origins(opts.origins || '*:*');
    this.sockets = this.of('/');
    if (srv) this.attach(srv, opts);
  }
  to() {}
  in() {}
  compress() {}
  dispatch() {}
  use() {}
  run() {}
  error() {}
  ack() {}
  leaveAll() {}
  leave() {}
  send() {}
  write() {}
  packet(packet, opts) {}
  join(rooms, fn) {}
  request() {}
  onclose() {}
  onerror() {}
  ondisconnect() {}
  onack() {}
  onevent() {}
  onpacket() {}
  onconnect() {}

  handShake() {
    return {
      headers: this.request.headers,
      time: `${new Date()}`,
      address: this.conn.remoteAddress,
      xdomain: !!this.request.headers.origin,
      secure: !!this.request.connection.encrypted,
      issued: +new Date(),
      url: this.request.url,
      query: buildQuery(),
    };
  }
}

export default Client;
