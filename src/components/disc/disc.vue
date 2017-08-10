<template>
  <transition name="slide">
    <music-list :bgImage="bgImage" :title="title" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getMusicList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import musicList from 'components/music-list/music-list'
  import {createSong} from 'common/js/song'
  export default {
    data() {
      return {
        songs: []
      }
    },
    components: {
      musicList
    },
    computed: {
      bgImage() {
        return this.disc.imgurl
      },
      title() {
        return this.disc.dissname
      },
      ...mapGetters([
        'disc'
      ])
    },
    created() {
      this.$nextTick(() => {
        this._getSongList()
      })
    },
    methods: {
      _getSongList() {
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }
        getMusicList(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalSongList(res.cdlist[0].songlist)
            console.log(this.songs)
          }
        })
      },
      _normalSongList(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>