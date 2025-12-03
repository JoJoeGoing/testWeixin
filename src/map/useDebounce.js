
const noop = () => {}
export function debounceFilter(ms, options = {}) {
  let timer
  let maxTimer
  let lastRejector = noop

  const _clearTimeout = (timer) => {
    clearTimeout(timer)
    lastRejector()
    lastRejector = noop
  }

  let lastInvoker

  const filter = (invoke) => {
    const duration = Number(ms)
    const maxDuration = Number(options.maxWait)

    if (timer)
      _clearTimeout(timer)

    if (duration <= 0 || (maxDuration !== undefined && maxDuration <= 0)) {
      if (maxTimer) {
        _clearTimeout(maxTimer)
        maxTimer = undefined
      }
      return Promise.resolve(invoke())
    }

    return new Promise((resolve, reject) => {
      lastRejector = options.rejectOnCancel ? reject : resolve
      lastInvoker = invoke
      // Create the maxTimer. Clears the regular timer on invoke
      if (maxDuration && !maxTimer) {
        maxTimer = setTimeout(() => {
          if (timer)
            _clearTimeout(timer)
          maxTimer = undefined
          resolve(lastInvoker())
        }, maxDuration)
      }

      // Create the regular timer. Clears the max timer on invoke
      timer = setTimeout(() => {
        if (maxTimer)
          _clearTimeout(maxTimer)
        maxTimer = undefined
        resolve(invoke())
      }, duration)
    })
  }

  return filter
}   

export function createFilterWrapper(filter, fn) {
  function wrapper(...args) {
    return new Promise((resolve, reject) => {       
      // make sure it's a promise
      Promise.resolve(filter(() => fn.apply(this, args), { fn, thisArg: this, args }))
        .then(resolve)
        .catch(reject)
    })
  }

  return wrapper
}

export function useDebounce(fn, ms, options = {}) {
  const filter = debounceFilter(ms, options)
  return createFilterWrapper(filter, fn)
}