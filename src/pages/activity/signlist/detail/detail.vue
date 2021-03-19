<template>
  <view v-if="signDetail && signDetail.signId">
    <view class="header">
      <view v-show="SignStatus.ing === signDetail.status">
        <view>
          二维码:<text>{{ signDetail.qrcode }}</text>
          <tki-qrcode
            :size="400"
            ref="qrcode"
            :val="qcValue"
            background="#fff"
            foreground="#000"
            pdground="#000"
            :onval="true"
            :showLoading="false"
          />
        </view>
        <view v-if="signDetail.method.includes(2)">
          口令:<text>{{ signDetail.pwd }}</text>
        </view>
      </view>
      <view class=""> 状态: {{ SignStatusText[signDetail.status] }} </view>
    </view>
    <view class="control">
      <button
        v-show="SignStatus.over === signDetail.status"
        type="default"
        @click="handleStart"
      >
        开始
      </button>
      <button
        v-show="SignStatus.ing === signDetail.status"
        type="default"
        @click="handleOver"
      >
        立即结束
      </button>
      <button
        v-show="SignStatus.ing === signDetail.status"
        type="default"
        @click="handlePause"
      >
        暂停
      </button>
      <button
        v-show="SignStatus.pause === signDetail.status"
        type="default"
        @click="handleStart"
      >
        继续
      </button>
      <input
        v-show="SignStatus.ing !== signDetail.status"
        placeholder="要延长的时间"
        type="number"
        v-model="time"
      />
    </view>
  </view>
</template>

<script>
import tkiQrcode from 'tki-qrcode/components/tki-qrcode/tki-qrcode'
import { mapState } from 'vuex'
import { SignStatusText, SignStatus } from '../../../../constants/index.js'
export default {
  data () {
    return {
      signId: '',
      SignStatusText,
      SignStatus,
      signData: {},
      time: 0
    }
  },
  components: {
    tkiQrcode
  },
  methods: {
    changeStatus (status) {
      this.$api.sign
        .updateSignStatus(this.signId, status, this.time)
        .then(() => {
          this.time = 0
          uni.showToast({
            icon: 'success',
            title: '状态切换成功'
          })
        })
    },
    handleStart () {
      this.changeStatus(SignStatus.ing)
    },
    handleOver () {
      this.changeStatus(SignStatus.over)
    },
    handlePause () {
      this.changeStatus(SignStatus.pause)
    }
  },
  computed: {
    ...mapState('sign', ['signList']),
    signDetail () {
      this.signData = this.signList.find((v) => v.signId === this.signId)
      return this.signData
    },
    qcValue () {
      if (this?.signDetail?.qrcode) {
        return JSON.stringify({
          type: 'sign',
          qrcode: this.signDetail.qrcode
        })
      }
      return JSON.stringify({
        type: 'sign',
        qrcode: 'none'
      })
    }
  },
  watch: {
    signData (to, from) {
      if (!to || !from || to.qrcode !== from.qrcode) {
        this?.$refs?.qrcode?._makeCode()
      }
    }
  },
  onLoad (params) {
    this.signId = params.id
  }
}
</script>

<style>
</style>
