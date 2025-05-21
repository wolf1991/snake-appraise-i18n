<template>
  <view class="listswitching" :ref="listSwitchName" :style="{ backgroundImage: 'url(' + datas.bgImg + ')' }">
    <!-- 类型一 -->
    <!-- 没有数据展示默认 -->
    <section
      v-if="!datas.imageList[0] && datas.commoditylisttype === 0"
      :class="[
        datas.commodityType === 5 ? 'defaultcommodityList5' : '',
        datas.commodityType === 1 ? 'defaultcommodityListFlex' : '',
      ]"
      class="defaultcommodity"
      :style="{
        'padding-top': datas.commodityMargin + 'px',
        'padding-left': datas.pageMargin + 'px',
        'padding-right': datas.pageMargin + 'px',
      }">
      <view
        v-for="index in 4"
        :key="index"
        class="defaultcommodityList"
        :class="[
          datas.commodityType === 0 ? 'defaultcommodityList0' : '',
          datas.commodityType === 1 ? 'defaultcommodityList1' : '',
          datas.commodityType === 2 ? 'defaultcommodityList2' : '',
          datas.commodityType === 3 ? 'defaultcommodityList3' : '',
          datas.commodityType === 4 ? 'defaultcommodityList4' : '',
          datas.commodityType === 5 ? 'defaultcommodityList5' : '',
        ]"
        :style="{
          border: datas.moditystyle === 2 ? '1px solid rgba(50,50,51,0.1)' : '',
          'box-shadow': datas.moditystyle === 1 ? '0 2px 8px rgba(93,113,127,0.08)' : '',
          margin: datas.commodityMargin + 'px',
          width:
            datas.commodityType === 1
              ? 50 - datas.commodityMargin / 6.5 + '%'
              : datas.commodityType === 2
                ? 33 - datas.commodityMargin / 5 + '%'
                : datas.commodityType === 4
                  ? 50 - datas.commodityMargin / 5 + '%'
                  : '',
          'border-radius': datas.borderRadius + 'px',
        }">
        <!-- 图片 -->
        <view class="bg-pic">
          <image
            src="https://s.qiuxietang.com/images/1672886064118/CdkQmBXNCs.png"
            :style="[radiusStyle('img')]"
            mode="aspectFill"></image>
          <!-- 标签 -->
          <view mark :style="[styleString]" class="marks" v-show="datas.commoditycorner && datas.commoditycornertype === 0">
            新品
          </view>
          <view
            :color="datas.commodityTagColor || tagColor"
            :style="[styleString]"
            class="marks"
            v-show="datas.commoditycorner && datas.commoditycornertype === 1">
            热
            <br />
            卖
          </view>
          <view
            :color="datas.commodityTagColor || tagColor"
            :style="[styleString]"
            class="marks"
            v-show="datas.commoditycorner && datas.commoditycornertype === 2">
            NEW
          </view>
          <view
            plain
            :color="datas.commodityTagColor || tagColor"
            :style="[styleString]"
            class="marks"
            v-show="datas.commoditycorner && datas.commoditycornertype === 3">
            HOT
          </view>
        </view>

        <!-- 文字内容 -->
        <view class="text" :style="[{ background: datas.moditystyle !== 3 ? '#fff' : 'none' }, radiusStyle()]">
          <!-- 视频名称 -->
          <h5 :style="{ 'font-weight': datas.textWeight, 'text-align': datas.positions === 'center' ? 'center' : '' }">
            这里显示商品名称，最多显示1行
          </h5>
          <!-- 视频描述 -->
          <p :style="{ 'text-align': datas.positions === 'center' ? 'center' : '' }">这里显示商品描述，最多显示1行</p>
          <view class="mony">
            <span v-show="datas.priceofcommodity">
              <i>￥</i>
              99
            </span>
            <view v-show="datas.purchasebutton">
              <!-- <u-icon name="" size="23" v-show="datas.purchasebuttonType === 0" />
							<u-icon name="" size="23" v-show="datas.purchasebuttonType === 1" />
							<u-icon name="" size="23" v-show="datas.purchasebuttonType === 2" />
							<u-icon name="" size="23" v-show="datas.purchasebuttonType === 3" /> -->
              <em v-if="[4, 5, 6, 7].includes(datas.purchasebuttonType)">{{ datas.purchase }}</em>
            </view>
          </view>
        </view>
      </view>
    </section>
    <section
      v-show="datas.imageList[0] && datas.commoditylisttype === 0"
      :class="[
        datas.commodityType === 5 ? 'defaultcommodityList5' : '',
        datas.commodityType === 1 ? 'defaultcommodityListFlex' : '',
      ]"
      class="defaultcommodity defaultcommodityListFlex"
      :style="{
        'padding-top': datas.commodityMargin + 'px',
        'padding-left': datas.pageMargin + 'px',
        'padding-right': datas.pageMargin + 'px',
      }">
      <view
        v-for="(item, index) in datas.imageList"
        :key="index"
        class="defaultcommodityList"
        :class="[
          datas.commodityType === 0 ? 'defaultcommodityList0' : '',
          datas.commodityType === 1 ? 'defaultcommodityList1' : '',
          datas.commodityType === 2 ? 'defaultcommodityList2' : '',
          datas.commodityType === 3 ? 'defaultcommodityList3' : '',
          datas.commodityType === 4 ? 'defaultcommodityList4' : '',
          datas.commodityType === 5 ? 'defaultcommodityList5' : '',
        ]"
        :style="{
          border: datas.moditystyle === 2 ? '1px solid rgba(50,50,51,0.1)' : '',
          'box-shadow': datas.moditystyle === 1 ? '0 2px 8px rgba(93,113,127,0.08)' : '',
          margin: datas.commodityMargin + 'px',
          width:
            datas.commodityType === 1
              ? 50 - datas.commodityMargin / 6.5 + '%'
              : datas.commodityType === 2
                ? 33 - datas.commodityMargin / 5 + '%'
                : datas.commodityType === 4
                  ? 50 - datas.commodityMargin / 5 + '%'
                  : '',
          'border-radius': datas.borderRadius + 'px',
        }"
        @click="habdleToDetails(item)">
        <!-- 图片 -->
        <view class="bg-pic">
          <image :src="imageFilter(item)" mode="aspectFit" :style="[radiusStyle('img')]"></image>
          <!-- 标签 -->
          <view :style="[styleString]" class="marks" v-if="datas.commoditycorner && datas.commoditycornertype === 0">新品</view>
          <view :style="[styleString]" class="marks" v-if="datas.commoditycorner && datas.commoditycornertype === 1">
            热
            <br />
            卖
          </view>
          <view :style="[styleString]" class="marks" v-if="datas.commoditycorner && datas.commoditycornertype === 2">NEW</view>
          <view :style="[styleString]" class="marks" v-if="datas.commoditycorner && datas.commoditycornertype === 3">HOT</view>
        </view>

        <!-- 文字内容 -->
        <view class="text" :style="[{ background: datas.moditystyle !== 3 ? '#fff' : 'none' }, radiusStyle()]">
          <!-- 商品名称 -->
          <h5 :style="{ 'font-weight': datas.textWeight, 'text-align': datas.positions === 'center' ? 'center' : '' }">
            {{ item.name }}
          </h5>
          <!-- 商品描述 -->
          <p :style="{ 'text-align': datas.positions === 'center' ? 'center' : '' }" v-if="item.introduce">
            {{ item.introduce }}
          </p>
          <view class="mony" v-if="datas.priceofcommodity || datas.purchasebutton">
            <view v-if="datas.priceofcommodity">
              <text>￥</text>
              {{ item.price }}
            </view>
            <view v-if="datas.purchasebutton">
              <!-- <u-icon name="" size="23" v-if="datas.purchasebuttonType === 0" />
							<u-icon name="" size="23" v-if="datas.purchasebuttonType === 1" />
							<u-icon name="" size="23" v-if="datas.purchasebuttonType === 2" />
							<u-icon name="" size="23" v-if="datas.purchasebuttonType === 3" /> -->
              <em v-if="[4, 5, 6, 7].includes(datas.purchasebuttonType)">{{ datas.purchase }}</em>
            </view>
          </view>
        </view>
      </view>
    </section>

    <!-- 类型二 -->
    <view class="tab-type2" v-if="datas.commoditylisttype == 1">
      <u-tabs :list="datas.commoditylisttypetab" :current="active1" :lineColor="datas.tabColor" @change="changeTabs"></u-tabs>
      <!-- 无数据默认展示 -->
      <section
        v-show="!datas.commoditylisttypetab[active1].imageList[0] && datas.commoditylisttype === 1"
        :class="[datas.commodityType === 5 ? 'defaultcommodityList5' : '']"
        class="defaultcommodity defaultcommodityListFlex"
        :style="{
          'padding-top': datas.commodityMargin + 'px',
          'padding-left': datas.pageMargin + 'px',
          'padding-right': datas.pageMargin + 'px',
        }">
        <view
          v-for="index in 4"
          :key="index"
          class="defaultcommodityList"
          :class="[
            datas.commodityType === 0 ? 'defaultcommodityList0' : '',
            datas.commodityType === 1 ? 'defaultcommodityList1' : '',
            datas.commodityType === 2 ? 'defaultcommodityList2' : '',
            datas.commodityType === 3 ? 'defaultcommodityList3' : '',
            datas.commodityType === 4 ? 'defaultcommodityList4' : '',
            datas.commodityType === 5 ? 'defaultcommodityList5' : '',
          ]"
          :style="{
            border: datas.moditystyle === 2 ? '1px solid rgba(50,50,51,0.1)' : '',
            'box-shadow': datas.moditystyle === 1 ? '0 2px 8px rgba(93,113,127,0.08)' : '',
            margin: datas.commodityMargin + 'px',
            width:
              datas.commodityType === 1
                ? 50 - datas.commodityMargin / 6.5 + '%'
                : datas.commodityType === 2
                  ? 33 - datas.commodityMargin / 5 + '%'
                  : datas.commodityType === 4
                    ? 50 - datas.commodityMargin / 5 + '%'
                    : '',
            'border-radius': datas.borderRadius + 'px',
          }">
          <!-- 视频图片 -->
          <view class="bg-pic">
            <image src="https://s.qiuxietang.com/images/1672886064118/CdkQmBXNCs.png" :style="[radiusStyle('img')]"></image>
            <!-- 标签 -->
            <view :style="[styleString]" class="marks" v-show="datas.commoditycorner && datas.commoditycornertype === 0">
              新品
            </view>
            <view :style="[styleString]" class="marks" v-show="datas.commoditycorner && datas.commoditycornertype === 1">
              热
              <br />
              卖
            </view>
            <view :style="[styleString]" class="marks" v-show="datas.commoditycorner && datas.commoditycornertype === 2">
              NEW
            </view>
            <view :style="[styleString]" class="marks" v-show="datas.commoditycorner && datas.commoditycornertype === 3">
              HOT
            </view>
          </view>

          <!-- 文字内容 -->
          <view class="text" :style="[{ background: datas.moditystyle !== 3 ? '#fff' : 'none' }, radiusStyle()]">
            <!-- 视频名称 -->
            <h5 :style="{ 'font-weight': datas.textWeight, 'text-align': datas.positions === 'center' ? 'center' : '' }">
              这里显示商品名称，最多显示1行
            </h5>
            <!-- 视频描述 -->
            <p :style="{ 'text-align': datas.positions === 'center' ? 'center' : '' }">这里显示商品描述，最多显示1行</p>
            <view class="mony">
              <span v-if="datas.priceofcommodity">
                <i>￥</i>
                99
              </span>
              <view v-if="datas.purchasebutton">
                <!-- <u-icon name="" size="23" v-if="datas.purchasebuttonType === 0" />
								<u-icon name="" size="23" v-if="datas.purchasebuttonType === 1" />
								<u-icon name="" size="23" v-if="datas.purchasebuttonType === 2" />
								<u-icon name="" size="23" v-if="datas.purchasebuttonType === 3" /> -->
                <em v-if="[4, 5, 6, 7].includes(datas.purchasebuttonType)">{{ datas.purchase }}</em>
              </view>
            </view>
          </view>
        </view>
      </section>
      <section
        v-show="datas.commoditylisttypetab[active1].imageList[0] && datas.commoditylisttype === 1"
        :class="[datas.commodityType === 5 ? 'defaultcommodityList5' : '']"
        class="defaultcommodity"
        :style="{
          'padding-top': datas.commodityMargin + 'px',
          'padding-left': datas.pageMargin + 'px',
          'padding-right': datas.pageMargin + 'px',
        }">
        <view
          v-for="(item, index) in datas.commoditylisttypetab[active1].imageList"
          :key="index"
          class="defaultcommodityList"
          :class="[
            datas.commodityType === 0 ? 'defaultcommodityList0' : '',
            datas.commodityType === 1 ? 'defaultcommodityList1' : '',
            datas.commodityType === 2 ? 'defaultcommodityList2' : '',
            datas.commodityType === 3 ? 'defaultcommodityList3' : '',
            datas.commodityType === 4 ? 'defaultcommodityList4' : '',
            datas.commodityType === 5 ? 'defaultcommodityList5' : '',
          ]"
          :style="{
            border: datas.moditystyle === 2 ? '1px solid rgba(50,50,51,0.1)' : '',
            'box-shadow': datas.moditystyle === 1 ? '0 2px 8px rgba(93,113,127,0.08)' : '',
            margin: datas.commodityMargin + 'px',
            width:
              datas.commodityType === 1
                ? 50 - datas.commodityMargin / 6.5 + '%'
                : datas.commodityType === 2
                  ? 33 - datas.commodityMargin / 5 + '%'
                  : datas.commodityType === 4
                    ? 50 - datas.commodityMargin / 5 + '%'
                    : '',
            'border-radius': datas.borderRadius + 'px',
          }"
          @click="habdleToDetails(item)">
          <!-- 视频图片 -->
          <view class="bg-pic">
            <image :src="item.image" mode="aspectFit" :style="[radiusStyle('img')]"></image>
            <!-- 标签 -->
            <view :style="[styleString]" class="marks" v-show="datas.commoditycorner && datas.commoditycornertype === 0">
              新品
            </view>
            <view :style="[styleString]" class="marks" v-show="datas.commoditycorner && datas.commoditycornertype === 1">
              热
              <br />
              卖
            </view>
            <view :style="[styleString]" class="marks" v-show="datas.commoditycorner && datas.commoditycornertype === 2">
              NEW
            </view>
            <view :style="[styleString]" class="marks" v-show="datas.commoditycorner && datas.commoditycornertype === 3">
              HOT
            </view>
          </view>

          <!-- 文字内容 -->
          <view class="text" :style="[{ background: datas.moditystyle !== 3 ? '#fff' : 'none' }, radiusStyle()]">
            <!-- 视频名称 -->
            <h5 :style="{ 'font-weight': datas.textWeight, 'text-align': datas.positions === 'center' ? 'center' : '' }">
              {{ item.name }}
            </h5>
            <!-- 视频描述 -->
            <p :style="{ 'text-align': datas.positions === 'center' ? 'center' : '' }">
              {{ item.introduce }}
            </p>
            <view class="mony" v-if="datas.priceofcommodity || datas.purchasebutton">
              <span v-if="datas.priceofcommodity">
                <i>￥</i>
                {{ item.price }}
              </span>
              <view v-if="datas.purchasebutton">
                <!-- <u-icon name="" size="23" v-if="datas.purchasebuttonType === 0" />
								<u-icon name="" size="23" v-if="datas.purchasebuttonType === 1" />
								<u-icon name="" size="23" v-if="datas.purchasebuttonType === 2" />
								<u-icon name="" size="23" v-if="datas.purchasebuttonType === 3" /> -->
                <em v-if="[4, 5, 6, 7].includes(datas.purchasebuttonType)">{{ datas.purchase }}</em>
              </view>
            </view>
          </view>
        </view>
      </section>
    </view>

    <!-- 类型三 -->
    <view v-if="datas.commoditylisttype === 2">
      <!-- <view class="more" v-show="datas.showMore"
				:style="{ 'margin-right': datas.pageMargin + 'px', 'margin-top': '0px', }">
				更多》
			</view> -->
      <tree-select :items="datas.commoditylisttypetab" :current="active" @click-nav="treeSelect" class="type3">
        <template v-slot:content>
          <view style="width: 100%">
            <section
              v-if="!datas.commoditylisttypetab[active].imageList[0]"
              class="defaultcommodity"
              :style="{
                'padding-top': datas.commodityMargin + 'px',
                'padding-left': datas.pageMargin + 'px',
                'padding-right': datas.pageMargin + 'px',
              }">
              <view
                v-for="index in 4"
                :key="index"
                class="defaultcommodityList defaultcommodityList3"
                :style="{
                  border: datas.moditystyle === 2 ? '1px solid rgba(50,50,51,0.1)' : '',
                  'box-shadow': datas.moditystyle === 1 ? '0 2px 8px rgba(93,113,127,0.08)' : '',
                  margin: datas.commodityMargin + 'px',
                  'border-radius': datas.borderRadius + 'px',
                }">
                <!-- 视频图片 -->
                <view class="bg-pic">
                  <image src="https://s.qiuxietang.com/images/1672886064118/CdkQmBXNCs.png" :style="[radiusStyle('img')]"></image>
                  <!-- 标签 -->
                  <view :style="[styleString]" class="marks" v-show="datas.commoditycorner && datas.commoditycornertype === 0">
                    新品
                  </view>
                  <view :style="[styleString]" class="marks" v-show="datas.commoditycorner && datas.commoditycornertype === 1">
                    热
                    <br />
                    卖
                  </view>
                  <view :style="[styleString]" class="marks" v-show="datas.commoditycorner && datas.commoditycornertype === 2">
                    NEW
                  </view>
                  <view :style="[styleString]" class="marks" v-show="datas.commoditycorner && datas.commoditycornertype === 3">
                    HOT
                  </view>
                </view>

                <!-- 文字内容 -->
                <view class="text" :style="[{ background: datas.moditystyle !== 3 ? '#fff' : 'none' }, radiusStyle()]">
                  <!-- 视频名称 -->
                  <h5
                    :style="{
                      'font-weight': datas.textWeight,
                      'text-align': datas.positions === 'center' ? 'center' : '',
                    }">
                    这里显示商品名称，最多显示1行
                  </h5>
                  <!-- 视频描述 -->
                  <p :style="{ 'text-align': datas.positions === 'center' ? 'center' : '' }">这里显示商品描述，最多显示1行</p>
                  <view class="mony">
                    <span v-if="datas.priceofcommodity">
                      <i>￥</i>
                      99
                    </span>
                    <view v-if="datas.purchasebutton">
                      <!-- <u-icon name="" size="23" v-if="datas.purchasebuttonType === 0" />
											<u-icon name="" size="23" v-if="datas.purchasebuttonType === 1" />
											<u-icon name="" size="23" v-if="datas.purchasebuttonType === 2" />
											<u-icon name="" size="23" v-if="datas.purchasebuttonType === 3" /> -->
                      <em v-if="[4, 5, 6, 7].includes(datas.purchasebuttonType)">{{ datas.purchase }}</em>
                    </view>
                  </view>
                </view>
              </view>
            </section>
            <section
              v-if="datas.commoditylisttypetab[active].imageList[0]"
              class="defaultcommodity"
              :style="{
                'padding-top': datas.commodityMargin + 'px',
                'padding-left': datas.pageMargin + 'px',
                'padding-right': datas.pageMargin + 'px',
              }">
              <view
                v-for="(item, index) in datas.commoditylisttypetab[active].imageList"
                :key="index"
                class="defaultcommodityList defaultcommodityList3"
                :style="{
                  border: datas.moditystyle === 2 ? '1px solid rgba(50,50,51,0.1)' : '',
                  'box-shadow': datas.moditystyle === 1 ? '0 2px 8px rgba(93,113,127,0.08)' : '',
                  margin: datas.commodityMargin + 'px',
                  'border-radius': datas.borderRadius + 'px',
                }"
                @click="habdleToDetails(item)">
                <!-- 图片 -->
                <view class="bg-pic">
                  <image :src="item.image" :style="[radiusStyle('img')]"></image>
                  <!-- 标签 -->
                  <view class="marks" :style="[styleString]" v-if="datas.commoditycorner && datas.commoditycornertype === 0">
                    新品
                  </view>
                  <view :style="[styleString]" class="marks" v-if="datas.commoditycorner && datas.commoditycornertype === 1">
                    热
                    <br />
                    卖
                  </view>
                  <view class="marks" :style="[styleString]" v-if="datas.commoditycorner && datas.commoditycornertype === 2">
                    NEW
                  </view>
                  <view class="marks" :style="[styleString]" v-if="datas.commoditycorner && datas.commoditycornertype === 3">
                    HOT
                  </view>
                </view>

                <!-- 文字内容 -->
                <view class="text" :style="[{ background: datas.moditystyle !== 3 ? '#fff' : 'none' }, radiusStyle()]">
                  <!-- 视频名称 -->
                  <h5
                    :style="{
                      'font-weight': datas.textWeight,
                      'text-align': datas.positions === 'center' ? 'center' : '',
                    }">
                    {{ item.name }}
                  </h5>
                  <!-- 视频描述 -->
                  <p :style="{ 'text-align': datas.positions === 'center' ? 'center' : '' }" v-if="item.introduce">
                    {{ item.introduce }}
                  </p>
                  <view class="mony" v-if="datas.priceofcommodity || datas.purchasebutton">
                    <span v-show="datas.priceofcommodity">
                      <i>￥</i>
                      {{ item.price }}
                    </span>
                    <view v-show="datas.purchasebutton">
                      <!-- 	<u-icon name="" size="23" v-show="datas.purchasebuttonType === 0" />
											<u-icon name="" size="23" v-show="datas.purchasebuttonType === 1" />
											<u-icon name="" size="23" v-show="datas.purchasebuttonType === 2" />
											<u-icon name="" size="23" v-show="datas.purchasebuttonType === 3" /> -->
                      <em v-if="[4, 5, 6, 7].includes(datas.purchasebuttonType)">{{ datas.purchase }}</em>
                    </view>
                  </view>
                </view>
              </view>
            </section>
          </view>
        </template>
      </tree-select>
    </view>
  </view>
</template>

<script>
import treeSelect from './components/tree-select/index.vue';
export default {
  name: 'listswitching',
  components: {
    treeSelect,
  },
  props: {
    datas: Object,
  },
  data() {
    return {
      active1: 0,
      active: 0,
      listSwitchName: null,
      tagColor: '#07c160',
      styleString: {},
      scrollTop: 0, // tab标题的滚动条位置
    };
  },
  computed: {
    radiusStyle() {
      return (type = 'text') => {
        const style = {};
        switch (this.datas.commodityType) {
          case 0:
          case 1:
          case 2:
          case 4:
          case 5:
            if (type === 'img') {
              style['border-top-left-radius'] = this.datas.borderRadius + 'px';
              style['border-top-right-radius'] = this.datas.borderRadius + 'px';
            } else {
              style['border-bottom-left-radius'] = this.datas.borderRadius + 'px';
              style['border-bottom-right-radius'] = this.datas.borderRadius + 'px';
            }
            break;
          case 3:
            if (type === 'img') {
              style['border-top-left-radius'] = this.datas.borderRadius + 'px';
              style['border-bottom-left-radius'] = this.datas.borderRadius + 'px';
            } else {
              style['border-top-right-radius'] = this.datas.borderRadius + 'px';
              style['border-bottom-right-radius'] = this.datas.borderRadius + 'px';
            }
            break;
        }
        return style;
      };
    },
  },
  created() {
    // console.log(this.datas, '--------------listswitching datas')
  },
  mounted() {
    this.$nextTick(() => {
      this.tagPositionStyle();
    });
  },
  methods: {
    imageFilter(item) {
      if (item.name && item.name.includes('潮服')) {
        return `${item.image}?x-oss-process=style/ys`;
      } else {
        return `${item.image}?x-oss-process=style/baidi`;
      }
    },
    habdleToDetails(item) {
      this.navTo('/pages/buy/detail', {
        id: item.id,
      });
    },
    // 类型二
    changeTabs(itme = {}, index) {
      this.active1 = itme.index;
    },
    // 类型三
    treeSelect(item, index) {
      this.active = index;
    },
    // 处理标记位置
    tagPositionStyle() {
      this.styleString = {
        position: 'absolute',
        color: '#fff',
        padding: '0 8rpx',
        fontSize: '24rpx',
        borderRadius: '2px',
        backgroundColor: this.datas.commodityTagColor || this.datastagColor,
      };
      if (this.datas.commoditycornertype === 3) {
        this.styleString.backgroundColor = '';
        this.styleString.border = `1rpx solid ${this.datas.commodityTagColor || this.datastagColor}`;
        this.styleString.color = this.datas.commodityTagColor || this.datastagColor;
      }
      /* '左上',
				  '左下',
				  '又上',
				  '又下' */
      switch (this.datas.tagPosition) {
        case 0: // 左上
          this.styleString.top = '5px';
          this.styleString.left = '0px';
          if (this.datas.commoditycornertype === 0) {
            this.styleString.borderRadius = '0 10px 10px 0 !important';
          }
          break;
        case 1: // 左下
          this.styleString.bottom = '5px';
          this.styleString.left = '0px';
          if (this.datas.commoditycornertype === 0) {
            this.styleString.borderRadius = '0 10px 10px 0 !important';
          }
          break;
        case 2: // 右上
          this.styleString.top = '5px';
          this.styleString.right = '0px';
          if (this.datas.commoditycornertype === 0) {
            this.styleString.borderRadius = '10px 0px 0px 10px !important';
          }
          break;
        case 3: // 右下
          this.styleString.bottom = '5px';
          this.styleString.right = '0px';
          if (this.datas.commoditycornertype === 0) {
            this.styleString.borderRadius = '10px 0px 0px 10px !important';
          }
          break;
      }
    },
  },
  watch: {
    'datas.tagPosition': function () {
      this.tagPositionStyle();
    },
    'datas.commoditycornertype': function () {
      this.tagPositionStyle();
    },
  },
};
</script>

<style scoped lang="scss">
.listswitching {
  position: relative;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 10px 0;

  .more {
    margin-top: 10px;
    height: 25px;
    line-height: 25px;
    text-align: right;
    font-size: 12px;
    color: #999;
    cursor: pointer;
  }

  /* 默认商品 */
  .defaultcommodity {
    box-sizing: border-box;

    &.defaultcommodityList5 {
      overflow-x: scroll;
      display: flex;
      flex-wrap: nowrap;

      /* 滚动条 */
      &::-webkit-scrollbar {
        height: 1px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #155bd4;
      }
    }

    .bg-pic {
      width: 100%;
      height: 240px;
      position: relative;
    }

    .defaultcommodityList {
      position: relative;
      display: flex;
      flex-direction: column;
      background-color: #fff;

      &.defaultcommodityList0 {
        width: 100%;
        // height: 340px;
        margin-left: 0 !important;
        margin-right: 0 !important;
        margin-top: 0 !important;

        &:nth-of-type(1) {
          margin-top: 0 !important;
        }

        .bg-pic {
          width: 100%;
          height: 240px;
        }
      }

      &.defaultcommodityList1 {
        // border: none !important;
        margin-top: 0 !important;
        box-sizing: border-box;

        &:nth-of-type(even) {
          margin-left: 0 !important;
          margin-right: 0 !important;
        }

        &:nth-of-type(odd) {
          margin-left: 0 !important;
        }

        .bg-pic {
          width: 100%;
          height: 360rpx;
        }

        .text {
          padding: 12rpx 8rpx 20rpx;
        }
      }

      &.defaultcommodityList2 {
        max-width: 33%;
        margin-top: 0 !important;
        margin-left: 0 !important;

        &:nth-of-type(3n) {
          margin-right: 0 !important;
        }

        .text {
          h5 {
            font-size: 12px !important;
          }

          p {
            font-size: 10px !important;
          }

          .mony {
            span {
              display: flex;
              flex-direction: row;
              font-size: 12px !important;

              i {
                font-size: 12px !important;
              }
            }

            i {
              font-size: 14px !important;
            }

            em {
              font-size: 5px !important;
              padding: 1px 5px !important;
            }
          }
        }

        .bg-pic {
          width: 100%;
          height: 70px;
        }
      }

      &.defaultcommodityList3 {
        width: 100%;
        height: 240rpx;
        display: flex !important;
        flex-direction: row !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        margin-top: 0 !important;

        .bg-pic {
          max-width: 240rpx !important;
          height: 240rpx !important;
        }

        .text {
          width: 100%;
          height: 100%;
        }
      }

      &.defaultcommodityList4 {
        &:nth-of-type(3n-2) {
          width: 100% !important;
          margin-left: 0px !important;
          margin-right: 0px !important;

          .bg-pic {
            width: 100%;
            height: 240px;
          }
        }

        &:nth-of-type(3n-1) {
          margin-left: 0px !important;

          .bg-pic {
            width: 100%;
            height: 120px;
          }
        }

        &:nth-of-type(3n) {
          margin-left: 0px !important;
          margin-right: 0px !important;

          .bg-pic {
            width: 100%;
            height: 120px;
          }
        }
      }

      &.defaultcommodityList5 {
        width: 100px;
        // height: 160px;
        margin-top: 0 !important;
        margin-right: 0px !important;

        &:first-of-type {
          margin-left: 0px !important;
        }

        .text {
          h5 {
            font-size: 12px !important;
          }

          p {
            font-size: 10px !important;
          }

          .mony {
            span {
              display: flex;
              flex-direction: row;
              font-size: 12px !important;

              i {
                font-size: 12px !important;
              }
            }

            i {
              font-size: 14px !important;
            }

            em {
              font-size: 5px !important;
              padding: 1px 5px !important;
            }
          }
        }

        .bg-pic {
          width: 100px;
          height: 70px;
        }
      }

      image {
        width: 100%;
        height: 100%;
      }

      /* 文字 */
      .text {
        padding: 36rpx 24rpx 43rpx;
        width: 100%;
        box-sizing: border-box;
        // height: 100%;

        /* 商品名称 */
        h5 {
          font-size: 22rpx;
          margin: 0 0 5px;
          color: #0f1113;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          word-break: break-all;
          -webkit-box-orient: vertical;
          white-space: normal;
        }

        /* 商品描述 */
        p {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 16px;
          color: #999;
          font-size: 12px;
          line-height: 16px;
        }

        /* 视频价格 */
        .mony {
          // height: 44px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;

          view {
            display: flex;
            align-items: center;
            font-size: 16px;
            color: #65c4aa;
          }

          span {
            display: flex;
            align-items: center;
            font-size: 16px;
            color: #65c4aa;

            i {
              font-size: 12px;
            }
          }

          i {
            font-size: 16px;
            line-height: 44px;
            color: #65c4aa;
          }

          em {
            font-style: normal;
            padding: 2px 7px;
            font-size: 12px;
            border: 1px solid rgb(101, 196, 170);

            &:nth-of-type(1) {
              border-radius: 10px;
              color: rgb(101, 196, 170);
            }

            &:nth-of-type(2) {
              background-color: rgb(101, 196, 170);
              border-radius: 10px;
              color: #fff;
            }

            &:nth-of-type(3) {
              color: rgb(101, 196, 170);
            }

            &:nth-of-type(4) {
              background-color: rgb(101, 196, 170);
              color: #fff;
            }
          }
        }
      }
    }
  }

  .defaultcommodityListFlex {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .tab-type2 {
  }

  .type3 {
    ::v-deep .content {
      flex: 3.9 !important;

      .defaultcommodityList3 {
        // height: 84px !important;

        .bg-pic {
          // height: 84px !important;
        }
      }

      .text {
        h5 {
          font-size: 12px !important;
        }

        p {
          font-size: 10px !important;
        }

        .mony {
          span {
            font-size: 12px !important;

            i {
              font-size: 12px !important;
            }
          }

          i {
            font-size: 14px !important;
          }

          em {
            font-size: 5px !important;
            padding: 1px 5px !important;
          }
        }
      }
    }
  }
}
</style>
