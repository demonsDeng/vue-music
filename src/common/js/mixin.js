import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {unshif} from 'common/js/util'

export const playerMinxin = {
  mounted() {
    this.suiPlayList(this.playList)
  },
  activated() {
    this.suiPlayList(this.playList)
  },
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  watch: {
    playList(newPlayList) {
      this.suiPlayList(newPlayList)
    }
  },
  methods: {
    suiPlayList(playList) {
      throw new Error('组件匹配必须注册"suiPlayList"方法')
    }
  }
}

export const playMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'mode',
      'sequenceList',
      'playList',
      'currentSong'
    ])
  },
  methods: {
    changeMode() {
      let mode = this.mode
      mode = (mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (this.mode === playMode.random) {
        list = unshif(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.checkCurrenIndex(list)
      this.setPlayList(list)
    },
    checkCurrenIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayList: 'SET_PLAYLIST',
      setPlayState: 'SET_PLAYING_STATE'
    })
  }
}

export const searchMixin = {
  data() {
    return {
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    blur() {
      this.$refs.searchBox.inputBlur()
    },
    onQueryChange(newQuery) {
      this.query = newQuery
    },
    selectItem(query) {
      this.$refs.searchBox.select(query)
    },
    ...mapActions([
      'saveSearchHistory',
      'delSearchHistory'
    ])
  }
}