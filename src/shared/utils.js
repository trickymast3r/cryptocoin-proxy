import BaseUtils from '@mrjs/utils';
import { URL } from 'url';
import tls from 'tls';
import net from 'net';
import debug from 'debug';
import _ from 'lodash';

class Utils extends BaseUtils {
  static log(namespace = '') {
    return {
      info: debug(`tm:info:${namespace.toLowerCase()}`),
      warn: debug(`tm:warning:${namespace.toLowerCase()}`),
      error: debug(`tm:error:${namespace.toLowerCase()}`),
      debug: debug(`tm:debug:${namespace.toLowerCase()}`),
    };
  }
  static zipObjectDeep(props, values) {
    return _.zipObjectDeep(props, values);
  }
  static getDefaultUrl(uri) {
    if (uri.indexOf('://') === -1) return `getwork://${uri}`;
    return uri;
  }
  static uriToConfig(uri) {
    const infoObj = new URL(Utils.getDefaultUrl(uri));
    return _(infoObj).assign(infoObj.searchParams);
  }
  static getPoolInfo(uri) {
    return Utils.uriToConfig(uri);
  }
  static simplify(object) {
    return _.toPlainObject(object);
  }
  static connect(poolInfo) {
    try {
      if (!_.isObject('object')) throw new Error('Not Valid Pool Info');
      if (!_.has(poolInfo, 'protocol')) throw new Error("Can't find 'protocol' in poolInfo");
      if (!_.has(poolInfo, 'port')) throw new Error("Can't find 'port' in poolInfo");
      if (!_.has(poolInfo, 'hostname')) throw new Error("Can't find 'hostname' in poolInfo");
      switch (poolInfo.protocol) {
        case 'tls:':
        case 'ssl:':
        case 'stratum+ssl:':
          return tls.connect(poolInfo.port, poolInfo.hostname, { rejectUnauthorized: poolInfo.allowSelfSSL || false });
        case 'getwork+ssl:':
          // ignore
          break;
        case 'getwork:':
        case 'stratum:':
          return net.connect(poolInfo.port, poolInfo.hostname);
        default:
          throw new Error(`Not Support Protocol ${poolInfo.protocol} '${poolInfo.href}'`);
      }
      return false;
    } catch (e) {
      throw e;
    }
  }
}
export default Utils;
