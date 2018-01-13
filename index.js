import Application from './src';
import config from './config';

const proxy = new Application(config);
proxy.start();
