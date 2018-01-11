import Application from './src'
import config from './config.js'
import tester from '@mrjs/core';
var proxy = new Application(config);
proxy.start()