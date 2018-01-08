import Socket from './socket';
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
      'mining.notify'  : [],
      'mining.set_difficulty'  : [],
      'mining.set_extranonce'  : []
    };
  }
  onConnect() {
    super.onConnect();
    let sendObj = this.request(1,'mining.subscribe',{userAgent: this.userAgent});
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
    return super.request(JSON.stringify(sendObj));
  }
  response(data) {
    if(data.indexOf('\n') != -1) {
      data = data.split('\n').map((item) => {        
        item = item.toString().replace(/[\r\x00]/g, "");
        if(item.trim() == '') return false;
        item = JSON.parse(item);
        return item;
      });
    }
    return data;
  }
}
export default Stratum
