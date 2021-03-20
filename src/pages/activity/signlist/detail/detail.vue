<template>
  <view v-if="signDetail && signDetail.signId">
    <view class="header">
      <view>活动序号：{{ getActivityById(signDetail.activityId).pwd }}</view>
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
          签到口令:<text>{{ signDetail.pwd }}</text>
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
    <view>
      <text style="text-align: center">签到状况</text>
      <button type="default" @click="filter = 'all'">全部</button>
      <button type="default" @click="filter = 'not'">未签到</button>
      <button type="default" @click="filter = 'success'">签到成功</button>
      <button type="default" @click="filter = 'fail'">签到失败</button>
      <button type="default" @click="filter = 'late'">迟到</button>
      <button type="default" @click="filter = 'notArrived'">旷课</button>
      <view>
        <view
          v-for="(d, idx) in records"
          :key="idx"
          @click="handleCheckInfo(d)"
        >
          <text>{{ d.name }}</text>
          <text
            >--{{
              d.status === -1 ? "未签到" : RecordStatusText[d.status]
            }}</text
          >
          <text v-show="d.status === RecordStatus.success">--{{ d.rank }}</text>
        </view>
        <view v-if="records.length === 0"> 没有记录 </view>
      </view>
    </view>
  </view>
</template>

<script>
import tkiQrcode from 'tki-qrcode/components/tki-qrcode/tki-qrcode'
import { mapState, mapActions, mapGetters } from 'vuex'
import {
  SignStatusText,
  SignStatus,
  RecordStatusText,
  RecordStatus
} from '../../../../constants/index.js'
export default {
  data () {
    return {
      signId: '',
      SignStatusText,
      RecordStatusText,
      RecordStatus,
      SignStatus,
      signData: {},
      time: 0,
      stop: false,
      timer: null,
      filter: 'all'
    }
  },
  components: {
    tkiQrcode
  },
  methods: {
    ...mapActions('people', ['getActivityPeopleById']),
    ...mapActions('record', ['getSignRecordsById']),
    changeStatus (status) {
      this.$api.sign
        .updateSignStatus(this.signId, status, this.time)
        .then(() => {
          this.time = 0
          uni.showToast({
            icon: 'success',
            title: '状态切换成功'
          })
          this?.$refs?.qrcode?._makeCode()
        })
    },
    handleCheckInfo (data) {
      uni.navigateTo({
        url: `info/info?data=${JSON.stringify(data)}`
      })
    },
    refresh () {
      if (this.stop) return
      if (!this.signData.activityId) {
        this.timer = setTimeout(this.refresh, 1200)
      } else {
        this.getActivityPeopleById(this.signData.activityId)
          .then(() => {
            return this.getSignRecordsById(this.signData.signId)
          })
          .then(() => {
            this.timer = setTimeout(this.refresh, 1200)
          })
          .catch(() => {
            this.timer = setTimeout(this.refresh, 1200)
          })
      }
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
    ...mapGetters('activity', ['getActivityById']),
    ...mapState('people', ['activityPeople']),
    ...mapState('record', ['signRecords']),
    signDetail () {
      this.signData = this.signList.find((v) => v.signId === this.signId)
      return this.signData
    },
    records () {
      const data = this.activityPeople
        .map((p) => {
          const record = this.signRecords.find(
            (v) => v.userId === p.userId
          ) || { status: -1, rank: 0, tips: '' }
          return {
            name: p.name,
            userId: p.userId,
            peopleId: p.peopleId,
            status: record.status,
            rank: record.rank,
            recordId: record.recordId,
            tips: record.tips,
            signId: this.signId
          }
        })
        .filter((d) => {
          if (this.filter === 'all') return true
          if (this.filter === 'not') return d.status === -1
          return d.status === RecordStatus[this.filter]
        })
        .sort((a, b) => {
          return a.rank - b.rank
        })
      return data
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
    // signData (to, from) {
    //   if (!to || !from || to.qrcode !== from.qrcode) {
    // // this?.$refs?.qrcode?._makeCode()
    //   }
    // }
  },
  onLoad (params) {
    this.signId = params.id
    this.timer = setTimeout(() => {
      this.refresh()
      this?.$refs?.qrcode?._makeCode()
    }, 500)
  },
  onUnload () {
    this.stop = true
  }
}
</script>

<style>
</style>
