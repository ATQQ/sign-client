export function setClipboardStr (str, title = 'ε€εΆζε') {
  uni.setClipboardData({
    data: str,
    success: function () {
      uni.showToast({
        title
      })
    }
  })
}
