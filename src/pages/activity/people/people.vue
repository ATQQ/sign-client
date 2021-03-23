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
    <van-cell-group>
      <view class="group-title">成员列表</view>
      <van-cell
        v-for="p in people"
        :key="p.peopleId"
        :title="p.name"
        @click="handleClick(p)"
      />
    </van-cell-group>
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      searchWord: ''
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
    }
  },
  computed: {
    ...mapState('people', ['activityPeople']),
    people () {
      if (!this.searchWord) return this.activityPeople

      return this.activityPeople.filter((v) =>
        v.name.includes(this.searchWord)
      )
    }
  },
  onLoad (params) {
    // this.getActivityPeopleById(params.id)
    this.getActivityPeopleById('6056f8257be9880013360c4d')
  }
}
</script>

<style scoped lang="scss">
@import "./people.scss";
</style>
