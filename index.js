import Application from './src'
import config from './config.js'

var proxy = new Application(config);
proxy.start();
