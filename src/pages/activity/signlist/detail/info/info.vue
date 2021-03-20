<template>
  <view>
    <view v-if="record.name">
      <view>
        姓名：<text>{{ record.name }}</text>
      </view>
      <view v-show="record.rank > 0">
        排名：<text>{{ record.rank }}</text>
      </view>
      <view>
        状态：<text>{{ RecordStatusText[record.status] }}</text>
      </view>
      <view>
        批注：<text>{{ record.tips }}</text>
      </view>
      <picker
        mode="selector"
        :range="statusRange"
        range-key="text"
        @change="handleChangeStauts"
      >
        <button type="default">更改状态</button>
      </picker>
      <button @click="changeTips" type="default">更改批注</button>
      <textarea placeholder="在此处输入新的批注内容" v-model="tips" />
    </view>
  </view>
</template>

<script>
import { RecordStatusText } from '../../../../../constants/index.js'
export default {
  data () {
    return {
      RecordStatusText,
      record: {},
      tips: '',
      statusRange: [
        { status: 0, text: '正常' },
        { status: 1, text: '无效签到' },
        { status: 2, text: '迟到' },
        { status: 3, text: '旷课' }
      ]
    }
  },
  onLoad (params) {
    this.record = JSON.parse(params.data)
  },
  methods: {
    changeTips () {
      const { peopleId, signId } = this.record
      this.$api.record.upRecordTips(peopleId, this.tips, signId).then((res) => {
        uni.showToast({
          title: '修改成功'
        })
        this.record.tips = this.tips
      })
    },
    handleChangeStauts (e) {
      const { value } = e.detail
      const { status } = this.statusRange[+value]
      const { peopleId, signId } = this.record
      this.$api.record.upRecordStatus(peopleId, status, signId).then((res) => {
        uni.showToast({
          title: '修改成功'
        })
        this.record.status = status
      })
    }
  }
}
</script>

<style>
</style>
