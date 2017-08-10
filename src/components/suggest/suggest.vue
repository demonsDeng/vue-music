<template>
  <scroll 
    :data="result" 
    class="suggest" 
    ref="suggest"
    :beforeScroll="beforeScroll"
    :pullup="pullup"
    :pulldown="pulldown"
    @scrollToEnd="searchMore"
    @scrollRefresh="searchRefresh"
    @scrollStart="inputBlur"
  >
    <ul class="suggest-list">
      <loading v-show="hasNew" title=''></loading>
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getMusicName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=''></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索数据"></no-result>
    </div>
  </scroll>
</template>

<script>
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import loading from 'base/loading/loading'
  import Song from 'common/js/singer'
  import {mapMutations, mapActions} from 'vuex'
  import noResult from 'base/no-result/no-result'

  const TYPE_SINGER = 'singer'
  const perpage = 20

  export default {
    components: {
      Scroll,
      loading,
      noResult
    },
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        pullup: true,
        pulldown: true,
        hasMore: true,
        hasNew: false,
        beforeScroll: true
      }
    },
    methods: {
      inputBlur() {
        this.$emit('letBlur')
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          let song = new Song({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${song.id}`
          })
          this.setSinger(song)
        } else {
          this.insertSong(item)
        }
        this.$emit('select')
      },
      searchRefresh() {
        this.hasNew = true
        setTimeout(() => {
          this._search()
        }, 500)
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._getResult(res.data))
            this._checkMore(res.data.song)
          }
        })
      },
      getReresh() {
        this.$refs.suggest.refresh()
      },
      getMusicName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name} - ${item.singer}`
        }
      },
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      _search() {
        this.page = 1
        this.hasMore = true
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._getResult(res.data)
            this._checkMore(res.data.song)
            this.hasNew = false
          }
        })
      },
      _checkMore(data) {
        if (!data.list.length || (data.curnum + data.curpage * perpage) >= data.totalnum) {
          this.hasMore = false
        }
      },
      _getResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalSongs(data.song.list))
        }
        return ret
      },
      _normalSongs(songs) {
        let ret = []
        songs.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query() {
        this._search()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>