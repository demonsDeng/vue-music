<template>
  <transition name="slide">
    <music-list :rank="rank" :songs="songs" :bgImage="bgImage" :title="title"></music-list>
  </transition>
</template>

<script>
  import musicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getMusicList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  export default {
    components: {
      musicList
    },
    computed: {
      bgImage() {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      },
      title() {
        return this.topList.topTitle
      },
      ...mapGetters([
        'topList'
      ])
    },
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    created() {
      this._getMusicList()
    },
    methods: {
      _getMusicList() {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalMusicList(res.songlist)
          }
        })
      },
      _normalMusicList(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.data.songid && musicData.data.albumid) {
            ret.push(createSong(musicData.data))
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>