import Base from './base';

class Stratum extends Base {
  constructor() {
    this.sendObj = {
      id: '',
      method: '',
      params: {}
    }
    this.requestMethod = {
      'mining.authorize' => ['username','password'],
      'mining.extranonce.subscribe'  => [],
      'mining.get_transactions'  => [],
      'mining.submit' => ['worker','jobId','extranonce2','ntime','nonce'],
      'mining.subscribe'  => ['userAgent'],
      'mining.suggest_difficulty'  => [],
      'mining.suggest_target'  => []
    };
    this.responseMethod = {
      'client.get_version'  => [],
      'client.reconnect'  => [],
      'client.show_message'  => [],
      'mining.notify'  => [],
      'mining.set_difficulty'  => [],
      'mining.set_extranonce'  => []
    };
  }
  onConnect(socket) {
  }
  getMethod(method) {
    let convertableMethod = {
      login: 'mining.authorize',
      share: 'mining.submit',
      job: 'mining.notify',
    }
    if(convertableMethod.hasOwnProperty(method)) return convertableMethod[method];
    return method;
  }
  getSendMessage() {

  }
}
export default Stratum
