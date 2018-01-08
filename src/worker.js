import EventEmitter from 'events'
import Utils from './shared/utils'

class Worker extends EventEmitter {
  constructor(config) {
    super();
    this.config = config || {};
    this.log = Utils.log(this.constructor.name);
    this.activeServers = {};
  }
  addServer(uri) {
    console.log(uri);
    if (this.activeServers.hasOwnProperty(uri)) return false;
    let urlInfo = Utils.uriToConfig(uri);
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
    this.log.debug(`Start Worker ${process.pid}`)
    this.config.listeners.forEach((uri) => {
      this.addServer(uri);
    });
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
