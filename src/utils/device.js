export function setClipboardStr (str) {
  uni.setClipboardData({
    data: str,
    success: function () {
      uni.showToast({
        title: '复制成功'
      })
    }
  })
}
