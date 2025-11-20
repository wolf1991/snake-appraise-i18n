<template>
  <div class="custommodule">
    <!-- <slot :name="datas.slotName" /> -->
    <slot />
  </div>
</template>

<script>
export default {
  name: 'custommodule',
  props: {
    datas: Object,
  },
};
</script>

<style scoped lang="scss">
.custommodule {
  height: 100%;
}
</style>
