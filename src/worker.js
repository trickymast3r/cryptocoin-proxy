import fs from 'fs'
import tls from 'tls'
import net from 'net'
import url from 'url'
import EventEmitter from 'events'

import Utils from './shared/utils'

class Worker extends EventEmitter {
  constructor(config) {
    super();
    this.config = config || {};
    this.activeServers = {};
  }
  addServer(data) {
    if (this.activeServers.hasOwnProperty(data.uri) !== -1) {
      return false;
    }
    let urlInfo = Utils.getUrl(data.uri);
    if (urlInfo.protocol in ['ssl:','tls:']) {
        let server = tls.createServer({ key: fs.readFileSync('cert.key'), cert: fs.readFileSync('cert.pem') });
    } else {
        let server = net.createServer();
    }
    server.on('connection',this.onConnection.bind(this));
    server.on('error',this.onError.bind(this));
    server.on('close',this.onClose.bind(this));
    server.listen(urlInfo.port,urlInfo.hostname,() => {
      this.activeServers[data.uri] = server;
      console.log("Started Proxy Server: " + urlInfo.port);
    });
  }
  start() {
    for(let i in this.config.ports) {
      this.addServer(this.config.ports[i]);
    }
  }
  onConnection(socket) {

  }
  onError(err) {
    console.log('Error',err);
  }
  onClose() {
    console.log('Closed');
  }
}
export default Worker
