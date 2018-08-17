import EventBus from '../src/index.js';

const eb = new EventBus();

eb.on('test', data => {
    return `run 1 ${data}`
})
eb.on('test', data => {
    return `run 2 ${data}`
})

eb.once('test', (data, data1) => {
    return `run 3 ${data}`
});

eb.emit('test', 'round').then(d => console.log(d))
// ["run 1 round", "run 2 round", "run 3 round"]


eb.emit('test', 'round').then(d => console.log(d))
// ["run 1 round", "run 2 round"]

