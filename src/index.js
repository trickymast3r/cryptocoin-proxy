import Utils from '@shared/utils';
import BaseClass from '@mrjs/core/class';

import minimist from 'minimist';
import cluster from 'cluster';

import Master from './master';
import Worker from './worker';
import defaultConfig from './config';
import Config from './shared/config';

class Application extends BaseClass {
  constructor(config) {
    super();
    this.config = Config.getInstance(config, defaultConfig);
  }
  start() {
    if (cluster.isMaster) {
      let numWorkers = 1;
      const argv = minimist(process.argv.slice(2));
      if (typeof argv.workers !== 'undefined') {
        numWorkers = Number(argv.workers);
      }
      const master = new Master(this.config);
      master.start(numWorkers).then(() => {
        Utils.info(`Master Started #${process.pid}`);
      });
    } else {
      const worker = new Worker(this.config);
      worker.start().then(() => {
        Utils.info(`Worker Started #${process.pid}`);
      });
    }
  }
}
export default Application;
