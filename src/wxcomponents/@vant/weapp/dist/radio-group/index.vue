<template>
<uni-shadow-root class="@vant-weapp-dist-radio-group-index"><view :class="utils.bem('radio-group', [direction])">
  <slot></slot>
</view></uni-shadow-root>
</template>
<wxs src="../wxs/utils.wxs" module="utils"></wxs>
<script>

global['__wxRoute'] = '@vant/weapp/dist/radio-group/index'
import { VantComponent } from '../common/component';
import { useChildren } from '../common/relation';
VantComponent({
  field: true,
  relation: useChildren('radio', function (target) {
    this.updateChild(target);
  }),
  props: {
    value: {
      type: null,
      observer: 'updateChildren',
    },
    direction: String,
    disabled: {
      type: Boolean,
      observer: 'updateChildren',
    },
  },
  methods: {
    updateChildren() {
      this.children.forEach((child) => this.updateChild(child));
    },
    updateChild(child) {
      const { value, disabled, direction } = this.data;
      child.setData({
        value,
        direction,
        disabled: disabled || child.data.disabled,
      });
    },
  },
});
export default global['__wxComponents']['@vant/weapp/dist/radio-group/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-radio-group--horizontal{display:-webkit-flex;display:flex;-webkit-flex-wrap:wrap;flex-wrap:wrap}
</style>