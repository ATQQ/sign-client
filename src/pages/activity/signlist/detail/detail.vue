<template>
  <view v-if="signDetail && signDetail.signId" class="p20">
    <view class="header">
      <van-divider
        contentPosition="center"
        customStyle="color: #1989fa; border-color: #1989fa; font-size: 1rem;"
      >
        加入活动口令
      </van-divider>
      <view class="pwd p20">{{ activityPwd }}</view>
      <!-- 状态 -->
      <view class="status p20">
        <van-tag :type="statusTag[signDetail.status]">
          {{ SignStatusText[signDetail.status] }}
        </van-tag>
        <!-- 倒计时 -->
        <van-count-down
          format="mm 分 ss 秒 SSS毫秒"
          v-if="signDetail.status === SignStatus.ing"
          millisecond
          :time="remainTime"
        />
      </view>
      <view v-show="SignStatus.ing === signDetail.status">
        <view class="qrcode p20">
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
        <!-- TODO:口令待确定 -->
        <view v-if="signDetail.method.includes(2)">
          <van-divider
            contentPosition="center"
            customStyle="color: #1989fa; border-color: #1989fa; font-size: 1rem;"
          >
            定位签到口令
          </van-divider>
          <view class="pwd p20">{{ signDetail.pwd }}</view>
        </view>
      </view>
    </view>
    <view class="control p20">
      <van-button
        block
        round
        type="primary"
        v-show="SignStatus.over === signDetail.status"
        @click="handleStart"
      >
        开始
      </van-button>
      <van-button
        block
        round
        type="danger"
        v-show="SignStatus.ing === signDetail.status"
        @click="handleOver"
      >
        立即结束
      </van-button>
      <van-button
        block
        round
        type="info"
        v-show="SignStatus.ing === signDetail.status"
        @click="handlePause"
      >
        暂停
      </van-button>
      <van-button
        block
        round
        type="info"
        v-show="SignStatus.pause === signDetail.status"
        @click="handleStart"
      >
        继续
      </van-button>
      <view v-show="SignStatus.ing !== signDetail.status">
        <van-divider
          contentPosition="center"
          customStyle="color: #1989fa; border-color: #1989fa; font-size: 1rem;"
        >
          需要延长的时间
        </van-divider>
        <picker
          mode="selector"
          :range="timeRange"
          @change="handleSelectorChange"
        >
          <view class="time">
            <van-button size="small" type="info" round>轻触修改</van-button>
            <text>{{ time }} mins </text>
          </view>
        </picker>
      </view>
    </view>
    <view>
      <van-divider
        contentPosition="center"
        customStyle="color: #1989fa; border-color: #1989fa; font-size: 1rem;"
      >
        签到概况
      </van-divider>
      <view class="p20">
        <van-progress :percentage="successPer" color="#07c160" />
      </view>
      <van-tabs :active="filter" swipeable @change="handleFilterChange">
        <van-tab title="全部" name="all"></van-tab>
        <van-tab title="未签到" name="not"></van-tab>
        <van-tab title="成功" name="success"></van-tab>
        <van-tab title="失败" name="fail"></van-tab>
        <van-tab title="迟到" name="late"></van-tab>
        <van-tab title="旷课" name="notArrived"></van-tab>
      </van-tabs>
      <view class="group-title">
        活动总人数:{{ activityPeople.length }},当前状态人数:{{ records.length }}
      </view>
      <view>
        <van-empty
          v-if="records.length === 0"
          image="search"
          description="没有数据喔"
        />
        <van-cell-group>
          <van-cell
            is-link
            v-for="(d, idx) in records"
            :key="idx"
            @click="handleCheckInfo(d)"
          >
            <view slot="title">
              <view class="cell-title">
                <view class="van-cell-text">{{ d.name }}</view>
                <van-tag :type="RecordStatusTagType[d.status]">{{
                  RecordStatusText[d.status]
                }}</van-tag>
                <text
                  class="rank"
                  v-show="
                    d.status === RecordStatus.success ||
                    d.status === RecordStatus.late
                  "
                  >{{ d.rank }}</text
                >
              </view>
            </view>
          </van-cell>
        </van-cell-group>
      </view>
    </view>
    <van-toast id="van-toast" />
  </view>
</template>

<script>
import tkiQrcode from 'tki-qrcode/components/tki-qrcode/tki-qrcode'
import { mapState, mapActions, mapGetters } from 'vuex'
import {
  SignStatusText,
  SignStatus,
  RecordStatusText,
  RecordStatus,
  RecordStatusTagType
} from '../../../../constants/index.js'
import Toast from '../../../../../wxcomponents/@vant/weapp/dist/toast/toast.js'
export default {
  data () {
    return {
      signId: '',
      SignStatusText,
      RecordStatusText,
      RecordStatus,
      SignStatus,
      RecordStatusTagType,
      signData: {},
      time: 0,
      stop: false,
      timer: null,
      filter: 'all',
      statusTag: {
        [SignStatus.ing]: 'success',
        [SignStatus.over]: 'danger',
        [SignStatus.pause]: 'primary'
      },
      timeRange: Array.from({
        length: 61
      }).map((_, i) => i),
      remainTime: 0
    }
  },
  components: {
    tkiQrcode
  },
  methods: {
    ...mapActions('people', ['getActivityPeopleById']),
    ...mapActions('record', ['getSignRecordsById']),
    handleFilterChange (e) {
      this.filter = e.detail.name
    },
    handleSelectorChange (e) {
      this.time = +e.detail.value
    },
    changeStatus (status) {
      this.$api.sign
        .updateSignStatus(this.signId, status, this.time)
        .then(() => {
          this.time = 0; Toast.success('状态切换成功')
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
    successPer () {
      const sum = this.activityPeople.length
      const success = this.signRecords.filter((s) => {
        return (
          s.status === this.RecordStatus.success ||
          s.status === this.RecordStatus.late
        )
      }).length
      return ((success / sum) * 100).toFixed(2)
    },
    activityPwd () {
      return (
        this?.signDetail?.activityId &&
        this.getActivityById(this.signDetail.activityId).pwd
      )
    },
    signDetail () {
      this.signData = this.signList.find((v) => v.signId === this.signId)
      const { status, endTime } = this.signData
      if (status === this.SignStatus.ing && this.remainTime === 0) {
        this.remainTime = new Date(endTime).getTime() - Date.now()
      } else if (status !== this.SignStatus.ing) {
        this.remainTime = 0
      }
      return this.signData
    },
    records () {
      const data = this.activityPeople
        .map((p) => {
          const record = this.signRecords.find(
            (v) => v.userId === p.userId
          ) || {
            status: -1,
            rank: 0,
            tips: ''
          }
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

<style scoped lang="scss">
@import "./detail.scss";
</style>
