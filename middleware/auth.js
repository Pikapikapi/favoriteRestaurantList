module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    if (isEmptyArray(res.locals.success_msg)) {
      req.flash('warning_msg', '請先登入才能使用！')
    } else {
      req.flash('success_msg', res.locals.success_msg)
    }
    res.redirect('/users/login')
  },
}
function isEmptyArray(obj) {
  if (Array.isArray(obj)) {
    return obj.length === 0
  }
  return false
}
