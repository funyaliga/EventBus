# EventBus #

## 使用 ##

```js
const eventBus = new EventBus();

const listener = data => data;
const listener2 = data => '🌑';

// 订阅事件监听
eventBus.on('🌝', listener);

// 订阅一次性事件监听
eventBus.once('🌝', listener2)

// 触发事件监听器
eventBus.emit('🌝', '🌚'); // 🌚 🌑
eventBus.emit('🌝', '🌚'); // 🌚

// 移除事件监听器
eventBus.off('🌝', listener);

// 移除该事件下所有监听器
eventBus.clear('🌝');

// 移除所有事件和监听器
eventBus.clear('');

```