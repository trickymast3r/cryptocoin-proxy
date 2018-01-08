import { URL } from 'url'
import Stratum from './stratum'
import GetWork from './getwork'
import Monero from './monero'

export default (uri) => {
  if(uri instanceof String) uri = new URL(uri);
  if(uri instanceof Object && uri.hasOwnProperty('protocol')) {
    if(uri.protocol.indexOf('stratum') != -1) {
      return new Stratum(uri);
    }
    if(uri.protocol.indexOf('xmr') != -1) {
      return new Monero(uri);
    }
    if(uri.protocol.indexOf('http') != -1 || uri.protocol.indexOf('getwork') != -1) {
      return new GetWork(uri);
    }
  }
  throw new Error("Can't Get Protocol")
}
