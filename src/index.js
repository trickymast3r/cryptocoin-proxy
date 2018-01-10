import minimist from 'minimist'
import cluster from 'cluster'
import Coin from './shared/coin'
import Master from './master'
import Worker from './worker'
import defaultConfig from './config';
import Config from './shared/config'

class Application {
  constructor(config) {
    this.config = Config.getInstance(config, defaultConfig)
  }
  start() {
    if (cluster.isMaster) {
      let numWorkers = 1;
      let argv = minimist(process.argv.slice(2));
      if (typeof argv.workers !== 'undefined') {
        numWorkers = Number(argv.workers);
      }
      //cluster.fork();
      var coin = new Coin('btc');
      var master = new Master(this.config);
      master.start(numWorkers).then(() => {
        console.log(`Master Started #${process.pid}`)
      });
    } else {
      var worker = new Worker(this.config);
      //worker.start().then(() => {
      //   console.log(`Worker Started #${process.pid}`)
      // });;
    }
  }
}
export default Application;