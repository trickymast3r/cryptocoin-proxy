import { URL } from 'url'
import Stratum from './stratum'
import GetWork from './getwork'
import Monero from './monero'

export default (uri) => {
  if(uri instanceof String) uri = new URL(uri);
  if(uri instanceof Object && uri.hasOwnProperty('protocol')) {
    if(uri.protocol.indexOf('stratum') != -1) {
      return new Stratum();
    }
    if(uri.protocol.indexOf('xmr') != -1) {
      return new Monero();
    }
    if(uri.protocol.indexOf('http') != -1) {
      return new GetWork();
    }
  }
  throw new Error("Can't Get Protocol")
}
