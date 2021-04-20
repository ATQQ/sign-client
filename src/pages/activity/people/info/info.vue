<template>
  <view v-if="peopleInfo.peopleId">
    <view class="group-title">成员基本信息</view>
    <van-cell-group>
      <van-field
        v-if="rewrite"
        clearable
        label="成员名称"
        :value="name"
        @input="
          e => {
            name = e.detail
          }
        "
        placeholder="请输入新的名字"
        required
        input-align="right"
      />
      <van-cell v-else title="成员名称" :value="peopleInfo.name" />
      <van-cell
        title="加入时间"
        :value="new Date(peopleInfo.joinTime).Format('yyyy-MM-dd hh:mm:ss')"
      />
    </van-cell-group>
    <view class="sure-container">
      <van-button v-if="!rewrite" @click="rewrite = !rewrite" type="info" block
        >修改成员名称</van-button
      >
      <view v-else>
        <van-button block type="danger" @click="rewrite = !rewrite">
          取消
        </van-button>
        <view style="margin-bottom: 20rpx; display: block"></view>
        <van-button :disabled="!name" block type="primary" @click="handleSure">
          确定
        </van-button>
      </view>
    </view>
    <van-toast id="van-toast" />
  </view>
</template>

<script>
import { mapActions } from 'vuex'
import Toast from '../../../../wxcomponents/@vant/weapp/dist/toast/toast'
export default {
  data () {
    return {
      peopleInfo: {},
      rewrite: false,
      name: ''
    }
  },
  onLoad (params) {
    this.peopleInfo = JSON.parse(params.people)
  },
  methods: {
    ...mapActions('people', ['rewritePeopleName']),
    handleSure () {
      const { peopleId, activityId } = this.peopleInfo
      this.rewritePeopleName({
        peopleId,
        name: this.name,
        activityId
      }).then(() => {
        Toast.success('修改完成')
        this.rewrite = !this.rewrite
        this.peopleInfo.name = this.name
        this.name = ''
      })
    }
  }
}
</script>

<style scoped>
.sure-container {
  padding: 20rpx;
}
</style>
