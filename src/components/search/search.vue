<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll ref="scroll" class="shortcut" :data="shortCut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="selectItem(item.k)" class="item" v-for="item in hotKey">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="show">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" @select="selectItem" @deleteOne="delSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest @select="saveSearch" @letBlur="blur" ref="suggest" :query="query"></suggest>
    </div>
    <router-view></router-view>
    <confirm-wrap ref="confirm" text="确定清空搜索历史吗" @confirm="delAllSearch"></confirm-wrap>
  </div>
</template>

<script>
  import searchBox from 'base/search-box/search-box'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import Suggest from 'components/suggest/suggest'
  import {playerMinxin, searchMixin} from 'common/js/mixin'
  import ConfirmWrap from 'base/confirm/confirm'
  import {mapActions} from 'vuex'
  import Scroll from 'base/scroll/scroll'
  import SearchList from 'base/search-list/search-list'

  export default {
    mixins: [playerMinxin, searchMixin],
    components: {
      searchBox,
      Suggest,
      SearchList,
      ConfirmWrap,
      Scroll
    },
    computed: {
      shortCut() {
        return this.hotKey.concat(this.searchHistory)
      }
    },
    created() {
      this._getHotKey()
    },
    data() {
      return {
        hotKey: []
      }
    },
    methods: {
      show() {
        this.$refs.confirm.show()
      },
      suiPlayList(playList) {
        const bottom = playList.length ? '60px' : ''
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.getReresh()

        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      _getHotKey() {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      ...mapActions([
        'delAllSearch'
      ])
    },
    watch: {
      query(newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.scroll.refresh()
          }, 20)
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>