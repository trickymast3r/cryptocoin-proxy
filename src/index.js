import minimist from 'minimist'
import Master from './master'
import Worker from './worker'
import cluster from 'cluster';

class Application {
  constructor(config) {
    this.config = config || {};
  }
  start() {
    if (cluster.isMaster) {
      let numWorkers = 1;
      let argv = minimist(process.argv.slice(2));
      if (typeof argv.workers !== 'undefined') {
          numWorkers = Number(argv.workers);
      }
      var master = new Master(this.config);
      master.start(numWorkers);
    } else {
      var worker = new Worker(this.config);
      worker.start();
    }
  }
}
export default Application;
