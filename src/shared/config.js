import _ from 'lodash';
var globalConfig = null;
class Config {
  constructor(config,defaultConfig={}) {
    _.defaultsDeep(this,config,defaultConfig);
  }
  static getInstance(config={},defaultConfig={}) {
    if(globalConfig == null) {
      globalConfig = new Config(config,defaultConfig);
    }
    return globalConfig;
  }
  get(path,defaultValue) {
    return _.get(this,path,defaultValue);
  }
  set(path,value) {
    _.set(this,path,value);
    return this;
  }
}
export default Config;