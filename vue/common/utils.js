Date.prototype.format = function (fmt) {
    if (!this) return
    var o = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'h+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'q+': Math.floor((this.getMonth() + 3) / 3),
        S: this.getMilliseconds()
    }
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
            )
    }
    return fmt
}

String.prototype.formatDate = function (fmt) {
    let params = this.replace(/[-\s]/g, ':').split(':')
    params[1] -= 1
    let result = new Date(...params)
    return result.format(fmt)
}

String.prototype.gbLength = function () {
    var l = this.length
    var blen = 0
    for (let i = 0; i < l; i++) {
        if ((this.charCodeAt(i) & 0xff00) !== 0) {
            blen += 1
        } else {
            blen += 0.5
        }
    }
    return Math.ceil(blen)
}

String.prototype.gbIndex = function (length) {
    let l = this.length
    let blen = 0
    let index = 0
    for (let i = 0; i < l; i++) {
        if ((this.charCodeAt(i) & 0xff00) !== 0) {
            blen += 1
        } else {
            blen += 0.5
        }
        if (blen === length) {
            index = i
            break
        } else if (blen > length) {
            index = i - 1
            break
        }
    }
    return index
}

String.prototype.copyClipboard = function (callBack) {
    var textarea = document.createElement('textarea')
    textarea.innerHTML = this
    textarea.style.position = 'fixed'
    textarea.style.top = '1000000000px'
    document.body.appendChild(textarea)
    textarea.select()
    if (document.execCommand('copy')) {
        document.execCommand('copy')
        textarea.blur()
        if (callBack) callBack('success')
    } else {
        if (callBack) callBack('error')
    }
    var lt = setTimeout(function () {
        clearTimeout(lt)
        document.body.removeChild(textarea)
    }, 500)
}

String.prototype.padStart = function padStart(targetLength, padString) {
    targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
    padString = String(typeof padString !== 'undefined' ? padString : ' ');
    if (this.length > targetLength) {
        return String(this);
    } else {
        targetLength = targetLength - this.length;
        if (targetLength > padString.length) {
            padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
        }
        return padString.slice(0, targetLength) + String(this);
    }
};
