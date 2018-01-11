import _ from 'lodash';
import TMClass from '@mrjs/core/class'

class Config extends TMClass {
  constructor(config,defaultConfig={}) {
    super();
    _.defaultsDeep(this,config,defaultConfig);
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
