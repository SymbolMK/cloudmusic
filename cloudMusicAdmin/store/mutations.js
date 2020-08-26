function delCookie(name) {
    var exp = new Date()
    exp.setTime(exp.getTime() - 1)
    var cval=getCookie(name)
    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

export default {
    SET_USER: (state, user) => {
        state.user = user
    },
    REMOVE_COOKIE: (state, {}) => {
        delCookie('koa:sess')
        delCookie('koa:sess.sig')
    }
}