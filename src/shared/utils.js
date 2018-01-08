import { URL } from 'url'
import _ from 'lodash'
import tls from 'tls'
import net from 'net'
import debug from 'debug';

class Utils {
  static log(namespace) {
    return {
      info: debug('tm:info:'+namespace.toLowerCase()),
      warn: debug('tm:warning:'+namespace.toLowerCase()),
      error: debug('tm:error:'+namespace.toLowerCase()),
      debug: debug('tm:debug:'+namespace.toLowerCase()),
    }
  }
  static getPoolInfo(uri) {
    if(uri.indexOf('://') == -1)
      uri = 'getwork://'+uri;
    let infoObj = new URL(uri);
    let ret = Object.assign(Utils.simplify(infoObj),{
      params: {}
    });
    for (const [name, value] of infoObj.searchParams) {
      ret.params[name] = value;
    }
    return ret;
  }
  static simplify(object) {
    let rs = {};
    for(let i in object) {
      if(['function','object'].indexOf(typeof(object[i])) == -1) {
        rs[i] = object[i];
      }
    }
    return rs;
  }
  static connect(poolInfo) {
    if(typeof(poolInfo) != 'object') throw new Error('Not Valid Pool Info')
    if(!poolInfo.hasOwnProperty('protocol')) throw new Error("Can't find 'protocol' in poolInfo")
    if(!poolInfo.hasOwnProperty('port')) throw new Error("Can't find 'port' in poolInfo")
    if(!poolInfo.hasOwnProperty('hostname')) throw new Error("Can't find 'hostname' in poolInfo")
    switch(poolInfo.protocol) {
      case 'tls:':
      case 'ssl:':
      case 'stratum+ssl:':
        return tls.connect(poolInfo.port,poolInfo.hostname,{ rejectUnauthorized: poolInfo.allowSelfSSL || false });
      break;
      case 'getwork+ssl:':
        
      break;
      case 'getwork:':
      case 'stratum:':
        return net.connect(poolInfo.port,poolInfo.hostname);
      break;
      default:
        throw new Error(`Not Support Protocol ${poolInfo.protocol} '${poolInfo.href}'`);
      break;
    }
  }
}
export default Utils
