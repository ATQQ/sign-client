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
export const SignMethod = {
  qrCode: 1,
  gps: 2,
  camera: 3,
  teacher: 4
}

export const SignMethodText = {
  [SignMethod.qrCode]: '二维码',
  [SignMethod.gps]: '定位',
  [SignMethod.teacher]: '教师修改'
}

export const StatusCode = {
  people: {
    exist: 10001,
    notExist: 10002
  },
  nowPower: 99999,
  record: {
    invalidQRCode: 20001,
    invalidPWD: 20002,
    signOver: 20003,
    alreadySign: 20004,
    fail: 20005,
    notJoin: 20006
  }
}

/**
 * 签到记录状态
 */
export const RecordStatus = {
  not: -1,
  success: 0,
  fail: 1,
  late: 2,
  notArrived: 3
}

export const RecordStatusTagType = {
  [RecordStatus.not]: 'danger',
  [RecordStatus.success]: 'success',
  [RecordStatus.fail]: 'warning',
  [RecordStatus.late]: 'primary',
  [RecordStatus.notArrived]: 'danger'
}
export const RecordStatusText = {
  [RecordStatus.not]: '未签到',
  [RecordStatus.success]: '签到成功',
  [RecordStatus.fail]: '签到失败',
  [RecordStatus.late]: '迟到',
  [RecordStatus.notArrived]: '旷课'
}
