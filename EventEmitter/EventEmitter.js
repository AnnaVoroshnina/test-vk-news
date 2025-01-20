class EventEmitter {
  constructor() {
    this.events = {}
  }

  on(eventName, listener) {
    //создаем новый ключ, если ранее его не существовало
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    //добавляем в массив обработчиков событий по определенному ключу
    this.events[eventName].push(listener)
  }

  emit(eventName, ...args) {
    //Выходим из функции, если для имени нет обработчиков событий
    if (!this.events[eventName]) {
      return;
    }
    //Итерируемся по всем обработчикам, контекст this внутри обработчика будет null, если обработчик не использует this
    this.events[eventName].forEach(fn => fn.call(null, ...args))
  }

  off(eventName, listener) {
    //Выходим из функции, если для имени нет обработчиков событий
    if (!this.events[eventName]) {
      return;
    }

    this.events[eventName] = this.events[eventName]
      .filter(callback => callback !==
        listener);
  }
}


const emitter = new EventEmitter()
const logData = data => console.log(data)
emitter.on('data', logData)
emitter.emit('data', {message:'Hello world'})
emitter.off('data', logData)

