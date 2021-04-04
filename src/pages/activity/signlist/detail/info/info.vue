<template>
  <view class="p20">
    <view v-if="record.name">
      <view class="group-title">成员签到详情</view>
      <van-cell-group>
        <van-cell title="成员名称" :value="record.name" />
        <van-cell
          v-show="record.rank > 0"
          title="签到排名"
          :value="record.rank"
        />
        <van-cell title="状态">
          <van-tag :type="RecordStatusTagType[record.status]">
            {{ RecordStatusText[record.status] }}
          </van-tag>
        </van-cell>
        <van-cell title="批注" :value="record.tips" />
      </van-cell-group>
      <picker
        class="p20"
        mode="selector"
        :range="statusRange"
        range-key="text"
        @change="handleChangeStauts"
      >
        <van-button round type="info" block>更改状态</van-button>
      </picker>
      <view class="p20">
        <van-button
          @click="changeTips"
          :disabled="!tips"
          round
          type="info"
          block
          >更新批注</van-button
        >
      </view>
      <van-cell-group>
        <van-field
          autosize
          placeholder="在此处输入新的批注内容"
          label="成员名称"
          :value="tips"
          @input="
            (e) => {
              tips = e.detail;
            }
          "
        />
      </van-cell-group>
    </view>
    <van-toast id="van-toast" />
  </view>
</template>

<script>
import Toast from '../../../../../../wxcomponents/@vant/weapp/dist/toast/toast.js'
import {
  RecordStatusText,
  RecordStatusTagType
} from '../../../../../constants/index.js'
export default {
  data () {
    return {
      RecordStatusText,
      RecordStatusTagType,
      record: {},
      tips: '',
      statusRange: [
        {
          status: 0,
          text: '正常'
        },
        {
          status: 1,
          text: '无效签到'
        },
        {
          status: 2,
          text: '迟到'
        },
        {
          status: 3,
          text: '旷课'
        }
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
        Toast.success('修改成功')
        this.record.tips = this.tips
        this.tips = ''
      })
    },
    handleChangeStauts (e) {
      const { value } = e.detail
      const { status } = this.statusRange[+value]
      const { peopleId, signId } = this.record
      this.$api.record.upRecordStatus(peopleId, status, signId).then((res) => {
        Toast.success('修改成功')
        this.record.status = status
      })
    }
  }
}
</script>

<style>
</style>
