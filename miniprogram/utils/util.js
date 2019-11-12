const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function giveTip(content) {
  wx.showModal({
    content: content,
    showCancel: false,
    confirmText: '确定',
    confirmColor: '#ff7f50',
    success: function (res) {
    }
  })
}

module.exports = {
  formatTime: formatTime,
  giveTip: giveTip
}
