import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_LEN = 15

const PLAY_KEY = '__play__'
const MAX_LEN = 200

function insertSearch(arr, val, compare, maxLen) {
  let index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function delSearch(arr, compare) {
  let index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function searchStorage(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertSearch(searches, query, (item) => {
    return item === query
  }, SEARCH_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function searchDel(query) {
  let searches = storage.get(SEARCH_KEY, [])
  delSearch(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function searchDelAll() {
  storage.remove(SEARCH_KEY)
  return []
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function playStorage(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertSearch(songs, song, (item) => {
    return item.id === song.id
  }, MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlayStorage() {
  return storage.get(PLAY_KEY, [])
}