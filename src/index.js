import minimist from 'minimist'
import cluster from 'cluster'
import Master from './master'
import Worker from './worker'
import defaultConfig from './config';
import Config from './shared/config'

class Application {
  constructor(config) {
    this.config = Config.getInstance(config,defaultConfig)
  }
  start() {
    if (cluster.isMaster) {
      let numWorkers = 1;
      let argv = minimist(process.argv.slice(2));
      if (typeof argv.workers !== 'undefined') {
          numWorkers = Number(argv.workers);
      }
      //cluster.fork();
      var master = new Master(this.config);
      master.start(numWorkers);
    } else {
      var worker = new Worker(this.config);
      //worker.start();
    }
  }
}
export default Application;
