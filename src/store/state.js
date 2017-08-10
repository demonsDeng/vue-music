import {playMode} from 'common/js/config'
import {loadSearch, loadPlayStorage} from 'common/js/cache'

const state = {
  singer: {},
  playing: false, // 播放/暂停
  fullScreen: false, // 是否全屏
  playList: [], // 播放列表
  sequenceList: [], // 顺序列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前播放歌曲索引
  disc: {},
  topList: [],
  searchHistory: loadSearch(),
  playHistory: loadPlayStorage()
}

export default state