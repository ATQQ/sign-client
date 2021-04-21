export function setClipboardStr (str, title = '复制成功') {
  uni.setClipboardData({
    data: str,
    success: function () {
      uni.showToast({
        title
      })
    }
  })
}
