<template>
  <view>
    <view class="group-title">活动信息</view>
    <van-cell-group>
      <van-cell title="活动名称" :value="activity.name" />
      <van-cell title="活动简介">
        <view class="break-all">
          {{ activity.description }}
        </view>
      </van-cell>
      <van-cell
        title="活动口令"
        :value="activity.pwd"
        @click="
          () => {
            setClipboardStr(activity.pwd)
          }
        "
      />
    </van-cell-group>
    <view class="group-title" style="padding-top: 32px">需填写信息</view>
    <van-cell-group>
      <van-cell title="要求名称格式" label="名称处内容填写参照此格式">
        <view class="break-all" style="color: red">
          {{ activity.nameFormat }}
        </view>
      </van-cell>
      <van-field
        label="口令"
        :value="activity.pwd"
        @input="
          e => {
            activity.pwd = e.detail
          }
        "
        placeholder="请输入课程口令"
        required
        input-align="right"
        :maxlength="6"
      />
      <van-field
        label="名称"
        :value="name1"
        @input="
          e => {
            name1 = e.detail
          }
        "
        placeholder="按要求输入你的名称"
        required
        input-align="right"
      />
      <van-field
        label="二次确认名称"
        :value="name2"
        @input="
          e => {
            name2 = e.detail
          }
        "
        placeholder="请再次输入"
        required
        input-align="right"
      />
    </van-cell-group>
    <view class="sure-container">
      <van-button
        :plain="!isInputOk"
        :disabled="!isInputOk"
        :round="isInputOk"
        type="primary"
        size="large"
        @click="handleJoin"
        >确认加入</van-button
      >
    </view>
    <van-toast id="van-toast" />
  </view>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import Toast from '../../../../wxcomponents/@vant/weapp/dist/toast/toast'
import { setClipboardStr } from '../../../../utils/device'
export default {
  data () {
    return {
      activity: {},
      name1: '',
      name2: ''
    }
  },
  onLoad (params) {
    // const testData =   {"activityId":"6056105b35bde50007e9b4a0","nameFormat":"姓名","peopleCount":"100","pwd":"e9b4a0","name":"serverless","description":"真牛逼","userId":"o4g1P5Dz3edA4XlkirYshrAK7S5Y"}
    //    this.activity = testData
    this.activity = JSON.parse(params.activity)
  },
  computed: {
    isInputOk () {
      return (
        this.name1 &&
        this.name1 === this.name2 &&
        this.activity.pwd.length === 6
      )
    }
  },
  methods: {
    ...mapActions('activity', ['getJoinActivities']),
    ...mapMutations('sign', ['changeAutoSign']),
    setClipboardStr,
    handleJoin () {
      if (this.name1 !== this.name2) {
        Toast.fail('两次输入的姓名不一致')
        return
      }
      this.$api.people.joinActivity(this.name1, this.activity.pwd).then(res => {
        const { code } = res
        if (code === 10001) {
          Toast.fail('已经在活动中了')
          return
        }
        if (code === 10001) {
          Toast.fail('活动不存在')
          return
        }
        Toast.success({
          message: '加入成功',
          onClose: () => {
            this.changeAutoSign({
              status: true
            })
            uni.navigateBack({
              delta: 2
            })
          }
        })
        this.getJoinActivities()
      })
    }
  }
}
</script>

<style scoped>
.group-title {
  margin: 0;
  padding: 16px 18px;
  color: rgba(69, 90, 100, 0.6);
  font-weight: normal;
  font-size: 14px;
  background-color: rgb(248, 248, 248);
  line-height: 16px;
}
.break-all {
  word-break: break-all;
}
.sure-container {
  padding: 20rpx;
}
</style>
