/**
 * 句摘
 * 句子摘抄
 */

import * as localforage from 'localforage';
import { ISentence } from '../types';

export const STORE_KEY = 'sentence';

/**
 * 复写所有
 * @param words
 */
const cover = (sentences: ISentence[])=>{
  return localforage.setItem(STORE_KEY, sentences);
};

/**
 * 缓存
 * @param word string
 */
const add = async (item: ISentence) => {
  if( item && item.sentence === '' || item.sentence.trim() === '') {
    return;
  }
  let cache = await localforage.getItem<ISentence[]>(STORE_KEY);
  if (!cache) {
    cache = [];
  }
  cache.unshift(item);
  return cover(cache);
};

/**
 * 读取所有
 * @param limit Number
 */
const getAll = async () => {
  let cache = await localforage.getItem<ISentence[]>(STORE_KEY);
  if (cache && cache.length) {
    return cache;
  }
  return [];
};

/**
 * 读取指定条数
 * @param limit Number
 */
const get = async (limit) => {
  if (!(limit > 0)) {
    return;
  }
  let cache = await getAll();
  if (cache && cache.length) {
    return cache.slice(0, limit);
  }
  return [];
};

/**
 * 删除一条记录
 */
const deleteOne = async (sentence)=>{
  const items = await getAll();
  const index = items.findIndex(item=>item.sentence === sentence);
  if( index > -1 ) {
    items.splice(index, 1);
    return cover(items);
  }
};

interface Window {
  saveAs(blob: Blob, filename: string): void;
}

export default {
  cover,
  add,
  get,
  getAll,
  deleteOne,
}