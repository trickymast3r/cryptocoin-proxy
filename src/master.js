import os from 'os'
import net from 'net'
import tls from 'tls'
import fs from 'fs'
import uuid from 'uuid/v4'
import cluster from 'cluster'
import EventEmitter from 'events'

import Pool from './shared/pool'

class Master extends EventEmitter {
  constructor(config) {
    super();
    this.config = config || {};
    this.activePools = {}
    let masterEvents = ['disconnect','exit','fork','listening','message','online','setup'];
    masterEvents.forEach((item) => {
      cluster.on(item,(...args) => { this.emit(item,...args) });
    });
    this.on('exit',this.onExit.bind(this));
    this.on('message',this.onMessage.bind(this));
    this.on('job',this.onJob.bind(this));
    this.on('share',this.onShare.bind(this));
  }
  addWorker() {
    let worker = cluster.fork();
  }
  start(numWorkers) {
    for (let i = 0; i < numWorkers; i++) {
      this.addWorker();
    }
    for(let j in this.config.coins) {
      this.addPool(j,this.config.coins[j]);
    }
  }
  onMessage(msg) {

  }
  onJob(coin,job) {

  }
  onShare(coin,job) {

  }
  onExit() {

  }
  addPool(coin,config) {
    if (this.activePools.hasOwnProperty(coin)) return this.activePools[coin];
    let pool = new Pool(coin,config);
    pool.on('job',(job) => {
      this.emit('newJob',coin,job);
    });
    pool.on('share',(job) => {
      this.emit('share',coin,job);
    });
    pool.connect();
    this.activePools[coin] = pool;
  }
}
export default Master
