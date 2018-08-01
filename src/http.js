import {
	isContainKoera,
	ajax,
} from './util';

const CommonParams = {
  client: 'deskdict',
  keyfrom: 'chrome.extension',
  xmlVersion: '3.2',
  dogVersion: '1.0',
  ue: 'utf8',
  doctype: 'xml',
  pos: '-1',
  vendor: 'g8up',
  appVer: '3.1.17.4208',
};

const YouDaoAddWordUrl = 'http://dict.youdao.com/wordbook/ajax';
/**
 * 添加到单词本
 * @param {String} word
 */
export const addWord = (word) => {
  return ajax({
		url: YouDaoAddWordUrl,
		data:{
			q: word,
			action: 'addword',
			le: 'eng',
		},
		dataType: 'json',
	}).then((ret) => {
    let msg = ret.message;
    if (msg === "adddone") {
      Promise.resolve();
    }
    else if (msg === 'nouser') {
      Promise.reject();
    }
  });
};

export const fetchWordOnline = (word) =>{
  if( word === ''){
    return Promise.reject();
  }
	return ajax({
		url: 'http://dict.youdao.com/fsearch',
		dataType: 'xml',
		data: {
			q: word,
      le: isContainKoera(word) ? 'ko' : 'eng',
      ...CommonParams,
		},
	});
};

/**
 * 查询英文之外的语言
 * @param {String} words
 */
export const fetchTranslate = (words) =>{
	return ajax({
		url: 'http://fanyi.youdao.com/translate',
		data:{
			i: words,
      ...CommonParams,
		},
		dataType: 'xml',
	});
};