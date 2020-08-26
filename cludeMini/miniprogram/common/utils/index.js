export const throttle = (fn, threshhold) => {
    var last
    var timer
    threshhold || (threshhold = 250)
    return function () {
        var context = this
        var args = arguments

        var now = +new Date()

        if (last && now < last + threshhold) {
            clearTimeout(timer)
            timer = setTimeout(function () {
                last = now
                fn.apply(context, args)
            }, threshhold)
        } else {
            last = now
            fn.apply(context, args)
        }
    }
}

export const debounce = (fn, delay) => {
    var timer = null
    return function () {
        var context = this
        var args = arguments
        clearTimeout(timer)
        timer = setTimeout(function () {
            fn.apply(context, args)
        }, delay)
    }
}
export const radomInt = (min, max) => {
    /**
   * 在区间内取最大值与最小值的整数，包括最大值 、最小值
   */
  return Math.floor(Math.random() * (max - min + 1) + min)
}