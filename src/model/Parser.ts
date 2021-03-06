/**
 * 解析服务端返回的 XML
 */
import render from './Render';
import {
  isContainKoera,
  isContainJapanese,
  isContainChinese,
} from '../common/util';

// 解析返回的查询结果
const translateXML = (xmlnode) => {
  let hasBaseTrans = true;
  let hasWebTrans = true;
  const root = xmlnode.getElementsByTagName('yodaodict')[0];

  const retrieveDataMap = {
    phrase: 'return-phrase', // 查询的单词、短语
    speach: 'dictcn-speach', // 发音
    ukSpeech: 'uk-speech',
    usSpeech: 'us-speech',
    phonetic: 'phonetic-symbol', // 音标
    ukPhonetic: 'uk-phonetic-symbol',
    usPhonetic: 'us-phonetic-symbol',
    lang: 'lang',
  };
  const params = <any>{};
  Object.keys(retrieveDataMap).forEach((key) => {
    let node = retrieveDataMap[key];
    node = root.getElementsByTagName(node);
    if (node.length) {
      const el = node[0].childNodes[0];
      if (el !== 'undefined') {
        params[key] = el.nodeValue;
      } else {
        params[key] = '';
      }
    }
  });

  let baseTrans = '';
  const $translations = root.getElementsByTagName('translation');
  if (!$translations.length) {
    hasBaseTrans = false;
  } else if (typeof $translations[0].childNodes[0] === 'undefined') {
    hasBaseTrans = false;
  } else {
    for (let i = 0; i < $translations.length; i += 1) {
      const transContVal = $translations[i].getElementsByTagName('content')[0].textContent;
      baseTrans += `<div class="ydd-trans-container">${transContVal}</div>`;
    }
  }

  let webTrans = '';
  const $webtranslations = root.getElementsByTagName('web-translation');
  if (!$webtranslations.length) {
    hasWebTrans = false;
  } else if (typeof $webtranslations[0].childNodes[0] === 'undefined') {
    hasWebTrans = false;
  } else {
    for (let i = 0; i < $webtranslations.length; i += 1) {
      const key = $webtranslations[i].getElementsByTagName('key')[0].childNodes[0].nodeValue;
      const vals = Array.from($webtranslations[i].getElementsByTagName('trans')).map(trans => (trans as Node).textContent.trim());
      webTrans += `<div class="ydd-trans-container">
          <a href="https://dict.youdao.com/search?q=${encodeURIComponent(key)}&le=${params.lang}&keyfrom=chrome.extension" target=_blank>${key}:</a>
            ${vals.join('；')}<br />
          </div>`;
    }
  }
  return render.table({
    phrase: params.phrase,
    ukSpeech: params.ukSpeech,
    usSpeech: params.usSpeech,
    phonetic: params.phonetic,
    ukPhonetic: params.ukPhonetic,
    usPhonetic: params.usPhonetic,
    hasBaseTrans,
    hasWebTrans,
    baseTrans,
    webTrans,
  });
};

let transStrTmp;
let inputStrTmp;
const translateTransXML = (xmlnode) => {
  let s = xmlnode.indexOf('CDATA[');
  let e = xmlnode.indexOf(']]');
  const inputStr = xmlnode.substring(s + 6, e);
  const remain = xmlnode.substring(e + 2, xmlnode.length - 1);
  s = remain.indexOf('CDATA[');
  e = remain.indexOf(']]');
  const transStr = remain.substring(s + 6, e);
  transStrTmp = transStr.trim();
  inputStrTmp = inputStr.trim();
  if ((isContainChinese(inputStrTmp) || isContainJapanese(inputStrTmp)
    || isContainKoera(inputStrTmp)) && inputStrTmp.length > 15) {
    inputStrTmp = `${inputStrTmp.substring(0, 8)} ...`;
  } else if (inputStrTmp.length > 25) {
    inputStrTmp = `${inputStrTmp.substring(0, 15)} ...`;
  }
  if (transStrTmp === inputStrTmp) {
    return null;
  }
  const res = `<div id="yddContainer">
      <div class="yddTop" class="ydd-sp">
        <div class="yddTopBorderlr">
          <a class="ydd-icon" href="http://fanyi.youdao.com/translate?i=${encodeURIComponent(inputStr)}&keyfrom=chrome.extension" target=_blank">有道词典</a>
          <span>${inputStrTmp.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')}</span>
          <a href="http://fanyi.youdao.com/translate?i=${encodeURIComponent(inputStr)}&smartresult=dict&keyfrom=chrome.extension" target=_blank>详细</a>
          <a class="ydd-close">&times;</a>
        </div>
      </div>
      <div class="yddMiddle">
        <div class="ydd-trans-wrapper">
          <div class="ydd-trans-container">
            ${transStr.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')}
          </div>
        </div>
      </div>
    </div>`;
  return res;
};

export default {
  translateXML,
  translateTransXML
}