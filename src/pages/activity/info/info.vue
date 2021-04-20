<template>
  <view>
    <view v-show="!!activity.activityId">
      <van-cell-group>
        <van-cell title="活动名称" :value="activity.name" />
        <van-cell title="活动简介">
          <view class="break-all">
            {{ activity.description }}
          </view>
        </van-cell>
        <van-cell
          title="要求姓名格式"
          label="名称处内容填写参照此格式"
          :value="activity.nameFormat"
        />
        <van-cell title="预计人数" :value="activity.peopleCount" />
        <van-cell
          @click="
            () => {
              setClipboardStr(activity.pwd)
            }
          "
          title="活动口令"
          :value="activity.pwd"
        />
      </van-cell-group>
    </view>
    <view class="btn-container">
      <van-button
        type="info"
        block
        @click="rewrite = !rewrite"
        v-show="!rewrite && isAdmin"
        >修改基本信息</van-button
      >
      <view v-show="rewrite && isAdmin">
        <van-button block type="danger" @click="rewrite = !rewrite">
          取消
        </van-button>
        <view style="margin-bottom: 20rpx; display: block"></view>
        <van-button
          :disabled="!isInputOk"
          block
          type="primary"
          @click="handleRewrite"
        >
          确定
        </van-button>
        <view style="text-align: center; padding: 10rpx; font-size: 0.8rem">
          至少修改一项
        </view>
      </view>
    </view>
    <view v-show="rewrite">
      <van-cell-group>
        <van-field
          label="活动名称"
          :value="newName"
          @input="
            e => {
              newName = e.detail
            }
          "
          placeholder="请输入新的活动名称"
          required
          input-align="right"
        />
        <van-field
          type="textarea"
          autosize
          label="简介"
          :value="newDes"
          @input="
            e => {
              newDes = e.detail
            }
          "
          placeholder="请输入新的简介"
          required
          input-align="right"
        />
        <van-field
          label="姓名格式"
          :value="newFormat"
          @input="
            e => {
              newFormat = e.detail
            }
          "
          placeholder="请输入新的姓名格式"
          required
          input-align="right"
        />
        <van-field
          label="预计人数"
          :value="newCount"
          @input="
            e => {
              newCount = e.detail
            }
          "
          placeholder="请输入预计人数"
          required
          input-align="right"
        />
      </van-cell-group>
    </view>
    <van-toast id="van-toast" />
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Toast from '../../../wxcomponents/@vant/weapp/dist/toast/toast'
import { setClipboardStr } from '../../../utils/device'
export default {
  data () {
    return {
      activity: {},
      rewrite: false,
      isAdmin: false,
      newName: '',
      newDes: '',
      newFormat: '',
      newCount: ''
    }
  },
  onLoad (params) {
    this.isAdmin = !!params.is_admin
    if (this.isAdmin) {
      this.activity = this.getActivityById(params.id)
      return
    }
    this.activity = this.getJoinActivityById(params.id)
  },
  computed: {
    ...mapGetters('activity', ['getActivityById', 'getJoinActivityById']),
    isInputOk () {
      return this.newName || this.newDes || this.newCount || this.newFormat
    }
  },
  methods: {
    ...mapActions('activity', ['updateActivityInfo']),
    setClipboardStr,
    handleRewrite () {
      let {
        activityId,
        nameFormat,
        peopleCount,
        name,
        description
      } = this.activity
      name = this.newName || name
      description = this.newDes || description
      nameFormat = this.newFormat || nameFormat
      peopleCount = this.newCount || peopleCount
      this.updateActivityInfo({
        id: activityId,
        name,
        description,
        nameFormat,
        peopleCount
      }).then(() => {
        Toast.success('修改成功')
        this.rewrite = !this.rewrite
        Object.assign(this.activity, {
          name,
          description,
          nameFormat,
          peopleCount
        })
      })
    }
  }
}
</script>

<style>
.item {
  text-align: center;
  margin: 10rpx;
}

.btn-container {
  padding: 20rpx;
}
</style>
