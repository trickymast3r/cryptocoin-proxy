const a = require('@mrjs/utils/array')
const b = new a();
console.log("console.log(a);");
console.log(a);
a.implement();
const c = new a();
console.log("console.log(b.prototype)",b.prototype)
console.log(c.prototype)
console.log(Array.prototype);
console.log(b)
console.log(b.test)
console.log(b.test2)
console.log(Object.getOwnPropertyDescriptors(a));
