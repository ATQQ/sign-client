<template>
  <view>
    <view>
      <van-empty
        v-if="records.length === 0"
        image="search"
        description="没有数据喔"
      />
      <van-cell-group>
        <van-collapse
          accordion
          :value="activeName"
          @change="handleActiveChange"
        >
          <van-collapse-item v-for="(d, idx) in records" :key="idx" :name="`${idx}`">
            <view slot="title">
              <view class="cell-title">
                <text class="time">
                  {{ new Date(d.date).Format("yyyy-MM-dd") }}
                </text>
                <view class="van-cell-text">第{{ idx + 1 }}次签到</view>
                <van-tag :type="RecordStatusTagType[d.status]">{{
                  RecordStatusText[d.status]
                }}</van-tag>
              </view>
            </view>
            <view v-if="d.status === RecordStatus.not"> 无签到详细数据 </view>
            <view v-else>
              <view v-show="d.rank">第 {{ d.rank }} 个参与签到</view>
              <view
                >时间:
                {{ new Date(d.lastTime).Format("yyyy-MM-dd hh:mm:ss") }}</view
              >
              <view>方式: {{ SignMethodText[d.method] }}</view>
            </view>
          </van-collapse-item>
        </van-collapse>
      </van-cell-group>
    </view>
  </view>
</template>

<script>
import {
  RecordStatusTagType,
  RecordStatus,
  RecordStatusText,
  SignMethodText
} from '../../../constants/index'
export default {
  data () {
    return {
      records: [],
      RecordStatusTagType,
      RecordStatus,
      RecordStatusText,
      SignMethodText,
      activeName: '0'
    }
  },
  onLoad (params) {
    this.$api.activity.getActivitySignDetail(params.id).then((res) => {
      this.records = res.data.records
    })
  },
  methods: {
    handleActiveChange (e) {
      this.activeName = e.detail
    }
  }
}
</script>

<style scoped lang="scss">
.cell-title {
  display: flex;
  align-items: center;
  .time {
    color: #999999;
  }
  .van-cell-text {
    margin: 0 20rpx;
  }

  .rank {
    margin-left: 20rpx;
  }
}
</style>
