import os from 'os'
import net from 'net'
import tls from 'tls'
import fs from 'fs'
import uuid from 'uuid/v4'
import cluster from 'cluster'
import EventEmitter from 'events'
import Pool from './shared/pool'
import Utils from './shared/utils'
class Master extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.activePools = {};
    this.log = Utils.log(this.constructor.name);
    let masterEvents = ['disconnect', 'exit', 'fork', 'listening', 'message', 'online', 'setup'];
    masterEvents.forEach((item) => {
      cluster.on(item, (...args) => {
        this.emit(item, ...args)
      });
    });
    this.on('exit', this.onExit.bind(this));
    this.on('message', this.onMessage.bind(this));
    this.on('job', this.onJob.bind(this));
    this.on('share', this.onShare.bind(this));
  }
  addWorker() {
    let worker = cluster.fork();
  }
  async start(numWorkers) {
    for (let i = 0; i < numWorkers; i++) {
      await this.addWorker();
    }
    return this;
  }
  onMessage(msg) {

  }
  onJob(coin, job) {
    this.log.info([coin, job]);
  }
  onShare(coin, job) {

  }
  onExit() {

  }
  addPools(pools) {
    for (let j in this.config.coins) {
      if (j == 'default') continue;
      this.addPool(j);
    }
  }
  addPool(coin) {
    if (!this.activePools.hasOwnProperty(coin)) {
      this.activePools[coin] = new Pool(coin);
    }
    return this;
  }
}
export default Master