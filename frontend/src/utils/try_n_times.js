const tryNTimes = (callback, time, conditionCallback, tries) => {
    console.log(tries, conditionCallback())
    if (tries <= 0) return
    if (!conditionCallback()) {
        setTimeout(() => {
            tryNTimes(callback, time, conditionCallback, tries - 1)
        }, time)
    }
    else {
        callback()
    }
}

export default tryNTimes;