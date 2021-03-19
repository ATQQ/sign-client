export const Gender = {
  MALE: 1,
  FEMALE: 2
}
export const SignStatus = {
  ing: 1,
  pause: 0,
  over: -1
}
export const SignStatusText = {
  [SignStatus.ing]: '进行中',
  [SignStatus.pause]: '暂停',
  [SignStatus.over]: '已结束'
}
