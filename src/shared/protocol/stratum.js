import Socket from './socket'
import Utils from '../utils'
class Stratum extends Socket {
  constructor(config) {
    super(config);
    this.requestMethod = {
      'mining.authorize' : ['username','password'],
      'mining.extranonce.subscribe'  : [],
      'mining.get_transactions'  : ['jobId'],
      'mining.submit' : ['worker','jobId','extranonce2','nTime','nOnce'],
      'mining.subscribe'  : ['userAgent'],
      'mining.suggest_difficulty'  : [],
      'mining.suggest_target'  : []
    };
    this.responseMethod = {
      'client.get_version'  : [],
      'client.reconnect'  : [],
      'client.show_message'  : [],
      'mining.notify'  : ['jobId','previousHash','coinbase1','coinbase2','brances','blockVersion','nbit','ntime','clean'],
      'mining.set_difficulty'  : [],
      'mining.set_extranonce'  : []
    };
    this.currentDifficulty = null;
  }
  onConnect() {
    super.onConnect();
    let sendObj = this.request(1,'mining.subscribe',{userAgent: this.userAgent});
  }
  getMethod(method) {
    let convertableMethod = {
      login: 'mining.authorize',
      share: 'mining.submit',
    }
    if(convertableMethod.hasOwnProperty(method)) return convertableMethod[method];
    return method;
  }
  request(id,method,params={}) {
    method = this.getMethod(method);
    let sendObj = {
      id: id,
      method: method,
      params: []
    }
    if(method in this.requestMethod) {
      for(let i in this.requestMethod[method]) {
        if(this.requestMethod[method][i] in params)
          sendObj.params.push(params[this.requestMethod[method][i]])
      }
    }
    this.request[id] = false;
    return super.request(JSON.stringify(sendObj));
  }
  response(data) {
    try {
      super.response(data);
      data = JSON.parse(data);
      if(!(data instanceof Object)) throw new Error('Error when parsing response');
      if(data.hasOwnProperty('error') && data.error != null) return this.emit('error',data.error);
      if(data.hasOwnProperty('id') && this.request.hasOwnProperty(data.id)) {
        if(data.hasOwnProperty('result')) this.response[data.id] = data.result;
        delete this.request[data.id];
        return;
      }
      if(data.hasOwnProperty('method') && data.hasOwnProperty('params')) {
        if(data.method == 'mining.set_difficulty') {
          this.currentDifficulty = data.params[0];
          this.emit('set_difficulty',data.params[0]);
        }
        if(data.method == 'mining.notify') {
          if(this.responseMethod.hasOwnProperty(data.method)) {
            let jobData = Utils.zipObjectDeep(this.responseMethod[data.method],data.params)
            this.emit('job',jobData);
          } else {
            this.emit('error','Unknown Data '+JSON.stringify(data));
          }
        }
      }
    }
    catch(e) {
      throw new Error('Error when parsing response '+e.message,data);
    }
  }
}
export default Stratum
