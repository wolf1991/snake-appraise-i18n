<template v-if="datas.imageTypeObj">
  <view
    class="magiccube"
    :style="{
      'padding-left': datas.pageMargin + 'rpx',
      'padding-right': datas.pageMargin + 'rpx',
      background: datas.bgColor,
    }">
    <!-- 一行最多6个 -->
    <section class="buju buju0" v-if="datas.rubiksCubeType === 0">
      <view
        class="rubiksCubeType rubiksCubeType0"
        v-for="(item, index) in datas.rowNum"
        :key="index"
        :style="{ width: 100 / datas.rowNum + '%' }">
        <view
          class="image"
          v-if="
            datas.imageTypeObj[datas.rubiksCubeType] &&
            datas.imageTypeObj[datas.rubiksCubeType][index] &&
            datas.imageTypeObj[datas.rubiksCubeType][index].length
          "
          :style="{ width: '100%', padding: `0 ${datas.imgMargin}rpx` }">
          <pictureads
            :datas="{
              swiperType: 1,
              height: datas.heights,
              borderRadius: datas.borderRadius,
              imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][index]),
            }"></pictureads>
        </view>
      </view>
    </section>

    <!-- 二左二右 -->
    <section class="buju buju0" v-if="datas.rubiksCubeType === 1">
      <view class="rubiksCubeType rubiksCubeType1" v-for="(item, index) in 4" :key="index" :style="heightStyle">
        <view
          v-if="
            datas.imageTypeObj[datas.rubiksCubeType] &&
            datas.imageTypeObj[datas.rubiksCubeType][index] &&
            datas.imageTypeObj[datas.rubiksCubeType][index].length
          "
          :style="{ width: '100%', padding: `0 ${datas.imgMargin}rpx` }">
          <pictureads
            :datas="{
              swiperType: 1,
              height: datas.heights,
              borderRadius: datas.borderRadius,
              imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][index]),
            }"></pictureads>
        </view>
      </view>
    </section>

    <!-- 一左二右 -->
    <view class="buju buju2" :style="[heightStyle]" v-if="datas.rubiksCubeType === 2">
      <view class="rubiksCubeType rubiksCubeType2">
        <view
          v-if="
            datas.imageTypeObj[datas.rubiksCubeType] &&
            datas.imageTypeObj[datas.rubiksCubeType][0] &&
            datas.imageTypeObj[datas.rubiksCubeType][0].length
          "
          :style="{ width: '100%', paddingRight: `${datas.imgMargin}rpx` }">
          <pictureads
            :datas="{
              swiperType: 1,
              height: datas.heights,
              borderRadius: datas.borderRadius,
              imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][0]),
            }"></pictureads>
        </view>
      </view>
      <view style="width: 100%; display: flex; flex-direction: column; justify-content: space-between">
        <block v-for="(item, index) in 2" :key="index">
          <view
            v-if="
              datas.imageTypeObj[datas.rubiksCubeType] &&
              datas.imageTypeObj[datas.rubiksCubeType][index + 1] &&
              datas.imageTypeObj[datas.rubiksCubeType][index + 1].length
            ">
            <pictureads
              :datas="{
                swiperType: 1,
                height: datas.heights / 2 - datas.imgMargin / 2,
                borderRadius: datas.borderRadius,
                imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][index + 1]),
              }"></pictureads>
          </view>
        </block>
      </view>
    </view>

    <!-- 一上二下 -->
    <section class="buju buju5" v-if="datas.rubiksCubeType === 3" :style="[heightStyle]">
      <view class="rubiksCubeType hw" :style="{ height: datas.topHeight + '%' }">
        <view
          v-if="
            datas.imageTypeObj[datas.rubiksCubeType] &&
            datas.imageTypeObj[datas.rubiksCubeType][0] &&
            datas.imageTypeObj[datas.rubiksCubeType][0].length
          "
          :style="{ width: '100%', padding: `0 ${datas.imgMargin}rpx ${datas.imgMargin}rpx` }">
          <pictureads
            :datas="{
              swiperType: 1,
              height: datas.heights * (datas.topHeights / 100),
              borderRadius: datas.borderRadius,
              imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][0]),
            }"></pictureads>
        </view>
      </view>
      <view style="display: flex; width: 100%" :style="{ height: 100 - datas.topHeights + '%' }">
        <view class="rubiksCubeType hw imgtow" v-for="(item, index) in 2" :key="index">
          <view
            v-if="
              datas.imageTypeObj[datas.rubiksCubeType] &&
              datas.imageTypeObj[datas.rubiksCubeType][index + 1] &&
              datas.imageTypeObj[datas.rubiksCubeType][index + 1].length
            "
            :style="{ width: '100%', padding: `${datas.imgMargin}rpx ${datas.imgMargin}rpx 0` }">
            <pictureads
              :datas="{
                swiperType: 1,
                height: datas.heights * ((100 - datas.topHeights) / 100),
                borderRadius: datas.borderRadius,
                imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][index + 1]),
              }"></pictureads>
          </view>
        </view>
      </view>
    </section>

    <!-- 一左三右 -->
    <section class="buju buju4" :style="heightStyle" v-if="datas.rubiksCubeType === 4">
      <!-- 左侧 -->
      <view class="rubiksCubeType hw">
        <view
          v-if="
            datas.imageTypeObj[datas.rubiksCubeType] &&
            datas.imageTypeObj[datas.rubiksCubeType][0] &&
            datas.imageTypeObj[datas.rubiksCubeType][0].length
          "
          :style="{ width: '100%', paddingRight: `${datas.imgMargin}rpx` }">
          <pictureads
            :datas="{
              swiperType: 1,
              height: datas.heights,
              borderRadius: datas.borderRadius,
              imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][0]),
            }"></pictureads>
        </view>
      </view>
      <!-- 右侧 -->
      <view style="display: flex; flex-direction: column; width: 100%">
        <view class="rubiksCubeType hw" :style="{ height: datas.topHeights + '%' }">
          <view
            v-if="
              datas.imageTypeObj[datas.rubiksCubeType] &&
              datas.imageTypeObj[datas.rubiksCubeType][1] &&
              datas.imageTypeObj[datas.rubiksCubeType][1].length
            "
            :style="{ width: '100%' }">
            <pictureads
              :datas="{
                swiperType: 1,
                height: (datas.heights - datas.imgMargin) * (datas.topHeights / 100),
                borderRadius: datas.borderRadius,
                imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][1]),
              }"></pictureads>
          </view>
        </view>
        <view class="rubiksCubeType">
          <view
            class="hw"
            style="display: flex; justify-content: center; align-items: center"
            v-for="(item, index) in 2"
            :key="index">
            <view
              v-if="
                datas.imageTypeObj[datas.rubiksCubeType] &&
                datas.imageTypeObj[datas.rubiksCubeType][index + 2] &&
                datas.imageTypeObj[datas.rubiksCubeType][index + 2].length
              "
              :style="{
                width: '100%',
                paddingTop: datas.imgMargin + 'rpx',
                paddingRight: index == 0 ? datas.imgMargin + 'rpx' : 0,
              }">
              <pictureads
                :datas="{
                  swiperType: 1,
                  height: (datas.heights - datas.imgMargin) * ((100 - datas.topHeights) / 100),
                  borderRadius: datas.borderRadius,
                  imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][index + 2]),
                }"></pictureads>
            </view>
          </view>
        </view>
      </view>
    </section>

    <!-- 二左一右 -->
    <section class="buju buju4" v-if="datas.rubiksCubeType === 5">
      <view style="display: inline-flex; flex-direction: column; width: 100%">
        <view class="hw imgone" v-for="(item, index) in 2" :key="index" :style="{ height: datas.heights / 2 + 'rpx' }">
          <view
            v-if="
              datas.imageTypeObj[datas.rubiksCubeType] &&
              datas.imageTypeObj[datas.rubiksCubeType][index + 1] &&
              datas.imageTypeObj[datas.rubiksCubeType][index + 1].length
            "
            :style="{ width: '100%', padding: `0 ${datas.imgMargin}rpx` }">
            <pictureads
              :datas="{
                swiperType: 1,
                height: datas.heights / 2,
                borderRadius: datas.borderRadius,
                imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][index + 1]),
              }"></pictureads>
          </view>
        </view>
      </view>
      <view class="rubiksCubeType hw">
        <!-- 左侧轮播 -->
        <view
          v-if="
            datas.imageTypeObj[datas.rubiksCubeType] &&
            datas.imageTypeObj[datas.rubiksCubeType][0] &&
            datas.imageTypeObj[datas.rubiksCubeType][0].length
          "
          :style="{ width: '100%', padding: `0 ${datas.imgMargin}rpx` }">
          <pictureads
            :datas="{
              swiperType: 1,
              height: datas.heights,
              borderRadius: datas.borderRadius,
              imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][0]),
            }"></pictureads>
        </view>
      </view>
    </section>

    <!-- 三左一右 -->
    <section class="buju buju4" :style="heightStyle" v-if="datas.rubiksCubeType === 6">
      <!-- 左侧 -->
      <view style="display: flex; flex-direction: column; width: 100%" :style="heightStyle">
        <view class="rubiksCubeType hw" :style="{ height: datas.topHeights + '%' }">
          <view
            v-if="
              datas.imageTypeObj[datas.rubiksCubeType] &&
              datas.imageTypeObj[datas.rubiksCubeType][1] &&
              datas.imageTypeObj[datas.rubiksCubeType][1].length
            "
            :style="{ width: '100%' }">
            <pictureads
              :datas="{
                swiperType: 1,
                height: (datas.heights - datas.imgMargin) * (datas.topHeights / 100),
                borderRadius: datas.borderRadius,
                imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][1]),
              }"></pictureads>
          </view>
        </view>
        <view class="rubiksCubeType">
          <view
            class="hw"
            style="display: inline-flex; justify-content: center; align-items: center"
            v-for="(item, index) in 2"
            :key="index">
            <view
              v-if="
                datas.imageTypeObj[datas.rubiksCubeType] &&
                datas.imageTypeObj[datas.rubiksCubeType][index + 2] &&
                datas.imageTypeObj[datas.rubiksCubeType][index + 2].length
              "
              :style="{
                width: '100%',
                paddingTop: datas.imgMargin + 'rpx',
                paddingRight: index == 0 ? datas.imgMargin + 'rpx' : 0,
              }">
              <pictureads
                :datas="{
                  swiperType: 1,
                  height: (datas.heights - datas.imgMargin) * ((100 - datas.topHeights) / 100),
                  borderRadius: datas.borderRadius,
                  imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][index + 2]),
                }"></pictureads>
            </view>
          </view>
        </view>
      </view>
      <!-- 右侧 -->
      <view class="rubiksCubeType hw">
        <view
          v-if="
            datas.imageTypeObj[datas.rubiksCubeType] &&
            datas.imageTypeObj[datas.rubiksCubeType][0] &&
            datas.imageTypeObj[datas.rubiksCubeType][0].length
          "
          :style="{ width: '100%', paddingLeft: `${datas.imgMargin}rpx` }">
          <pictureads
            :datas="{
              swiperType: 1,
              height: datas.heights,
              borderRadius: datas.borderRadius,
              imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][0]),
            }"></pictureads>
        </view>
      </view>
    </section>
  </view>
</template>

<script>
import pictureads from '../pictureads/index.vue';
export default {
  name: 'magiccube',
  props: { datas: Object },
  components: { pictureads },
  computed: {
    imageList() {
      return (imageList) => {
        const list = [...imageList];
        list.forEach((item) => {
          if (item.isExpire && item?.datetime) {
            const now = new Date();
            const startTime = new Date(item?.datetime[0]);
            const endTime = new Date(item?.datetime[1]);
            // 检查当前时间是否在 startTime 和 endTime 之间（包括边界）
            const isCurrentTimeValid = now >= startTime && now <= endTime;
            item.src = isCurrentTimeValid ? item.src : item.expireSrc;
          }
        });
        return list;
      };
    },
    heightStyle() {
      const style = {};
      style.height = this.$u.pxTorpx(this.datas.heights);
      return style;
    },
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.magiccube {
  position: relative;

  // 一左二右 布局
  .imgone {
    &:last-of-type {
      .image {
        padding-bottom: 0 !important;
        padding-right: 0 !important;
      }
    }

    &:first-of-type {
      .image {
        padding-top: 0 !important;
        padding-right: 0 !important;
      }
    }

    .image {
      box-sizing: border-box;
    }
  }

  // 一上二下 布局
  .imgtow {
    &:first-of-type {
      .image {
        padding-bottom: 0 !important;
        padding-left: 0 !important;
      }
    }

    &:last-of-type {
      .image {
        padding-bottom: 0 !important;
        padding-right: 0 !important;
      }
    }
  }

  .hw {
    width: 100%;
    position: relative;

    .image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
  }

  .buju {
    &.buju0 {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
    }

    &.buju2 {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }

    &.buju4 {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }

    .rubiksCubeType {
      display: flex;
      justify-content: center;
      align-items: center;
      // cursor: pointer;

      // 一行多个
      &.rubiksCubeType0 {
        height: 100%;

        &:first-of-type {
          .image {
            padding-left: 0 !important;
          }
        }

        .image {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          padding-right: 0 !important;
        }
      }

      // 二左二右
      &.rubiksCubeType1 {
        width: 50%;
        position: relative;

        &:nth-of-type(1) {
          .image {
            padding-top: 0 !important;
            padding-left: 0 !important;
          }
        }

        &:nth-of-type(2) {
          .image {
            padding-top: 0 !important;
            padding-right: 0 !important;
          }
        }

        &:nth-of-type(3) {
          .image {
            padding-bottom: 0 !important;
            padding-left: 0 !important;
          }
        }

        &:nth-of-type(4) {
          .image {
            padding-bottom: 0 !important;
            padding-right: 0 !important;
          }
        }

        .image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
        }
      }

      &.rubiksCubeType2 {
        width: 100%;
      }
    }
  }
}
</style>
