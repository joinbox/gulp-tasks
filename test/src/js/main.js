import include from './include.js';
import PrivatePropClass from './PrivatePropClass.js';

console.log(include(5));

const privateProp = new PrivatePropClass();
console.log(privateProp.getPrivateField());
