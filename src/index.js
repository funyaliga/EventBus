// https://github.com/sindresorhus/emittery/blob/master/index.js

const eventsMap = new WeakMap();
const onceMap = new WeakMap();

function assertEventName(eventName) {
    if (typeof eventName !== 'string') {
        throw new TypeError('eventName必须是string类型');
    }
}
function assertListener(listener) {
    if (typeof listener !== 'function') {
        throw new TypeError('listener必须是function类型');
    }
}

function getListeners(instance, eventName) {
    const events = eventsMap.get(instance);
    if (!events.has(eventName)) {
        events.set(eventName, new Set());
    }

    return events.get(eventName);
}

function addListener (eventName, listener, isOnce) {
    assertEventName(eventName);
    assertListener(listener);
    getListeners(this, eventName).add(listener);
    if (isOnce) onceMap.get(this).add(listener);
    return {
        off: this.off.bind(this, eventName, listener)
    }
}

class EventBus {
    constructor() {
        eventsMap.set(this, new Map());
        onceMap.set(this, new Set());
    }

    // 订阅事件
    on(eventName, listener) {
        return addListener.call(this, eventName, listener);
    }

    // 订阅事件 - 运行一次后删除
    once(eventName, listener) {
        return addListener.call(this, eventName, listener, true);
    }

    // 删除事件
    off(eventName, listener) {
        assertEventName(eventName);
        assertListener(listener);
        getListeners(this, eventName).delete(listener);
    }

    // 清除
    // 有eventName，删除该事件的listener
    // 无eventName，清除所有
    clear(eventName) {
        if (typeof eventName === 'string') {
            getListeners(this, eventName).clear();
        } else {
            for (const listeners of eventsMap.get(this).values()) {
                listeners.clear();
            }
        }
    }

    // 触发事件
    async emit(eventName, ...args) {
        assertEventName(eventName);
        const listeners = getListeners(this, eventName);

        if(!listeners.size) {
            throw new TypeError(`没有${eventName}事件`);
        }

        return Promise.all([
            ...[...listeners].map(async listener => {
                if (listeners.has(listener)) {
                    // 如果onceMap有，移除该事件
                    if (onceMap.get(this).has(listener)) {
                        this.off(eventName, listener);
                    }
                    return listener.apply(this, args);
                }
            })
        ]);
    }
}

export default EventBus;