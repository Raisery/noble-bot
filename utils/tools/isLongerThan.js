function isLongerThan(duration, limit) {
    const d = duration.split(':');
    const l = limit.split(':');
    var timeD = 0;
    var timeL = 0;

    if (d.length > l.length) return true
    let puissance = 0;
    for (let i = l.length-1; i >= 0; i--) {
        timeD += parseInt(d[i])*Math.pow(60,puissance);
        timeL += parseInt(l[i])*Math.pow(60,puissance);
        puissance++;
    }
    return (timeD > timeL)
}

module.exports = isLongerThan;