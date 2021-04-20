<template>
  <view>
    <van-search
      clearable
      @change="handleInput"
      shape="round"
      :value="searchWord"
      input-align="center"
      placeholder="请输入搜索关键词"
    />
    <view>
      <view class="group-title">成员列表</view>
      <van-empty
        v-if="people.length === 0"
        image="search"
        description="空空如也,快去邀请成员吧"
      />
      <view v-for="p in people" :key="p.peopleId">
        <van-swipe-cell right-width="65">
          <van-cell-group>
            <van-cell
              @click="handleClick(p)"
              :title="p.name"
              link-type="navigateTo"
            />
          </van-cell-group>
          <view slot="right">
            <van-button type="danger" @click="handleDelete(p)">删除</van-button>
          </view>
        </van-swipe-cell>
      </view>
      <van-dialog id="van-dialog" />
      <van-toast id="van-toast" />
    </view>
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Toast from '../../../wxcomponents/@vant/weapp/dist/toast/toast'
import Dialog from '../../../wxcomponents/@vant/weapp/dist/dialog/dialog'
export default {
  data () {
    return {
      searchWord: '',
      activityId: ''
    }
  },
  methods: {
    ...mapActions('people', ['getActivityPeopleById']),
    handleClick (p) {
      uni.navigateTo({
        url: `info/info?people=${JSON.stringify(p)}`
      })
    },
    handleInput (e) {
      this.searchWord = e.detail
    },
    handleDelete (e) {
      Dialog.confirm({
        title: '确认删除此成员吗?',
        message: '此操作将会删除与该成员相关的一切数据'
      })
        .then(() => {
          this.$api.people
            .deleteActivityPeople(e.peopleId, this.activityId)
            .then(() => {
              this.getActivityPeopleById(this.activityId)
              Toast.success('删除成功')
            })
        })
        .catch(() => {
          // on cancel
        })
    }
  },
  computed: {
    ...mapState('people', ['activityPeople']),
    people () {
      if (!this.searchWord) return this.activityPeople

      return this.activityPeople.filter(v => v.name.includes(this.searchWord))
    }
  },
  onLoad (params) {
    this.activityId = params.id
    this.getActivityPeopleById(this.activityId)
  }
}
</script>

<style scoped lang="scss">
@import './people.scss';
</style>
