import {
	isContainKoera,
	isContainJapanese,
} from './util';

const renderTransDetail = (title, body) => {
  return `<div class="ydd-trans-wrapper">
			<div class="ydd-tabs">
				<span class="ydd-tab">
					${title}
				</span>
			</div>
			${body}
		</div>`;
};

// 页面中弹出的的面板
export const table  = (word, speach, strpho, noBaseTrans, noWebTrans, baseTrans, webTrans) => {
  let lan = '';
  if (isContainKoera(word)) {
    lan = "&le=ko";
  }
  if (isContainJapanese(word)) {
    lan = "&le=jap";
  }
  let fmt = '';
  let searchUrlPrefix = (noBaseTrans && noWebTrans) ? 'http://www.youdao.com/search?keyfrom=chrome.extension&ue=utf8'
    : 'http://dict.youdao.com/search?keyfrom=chrome.extension';
  let searchUrl = searchUrlPrefix + '&q=' + encodeURIComponent(word) + lan;

  fmt = `<div id="yddContainer">
				  <div class="yddTop" class="ydd-sp">
					<div class="yddTopBorderlr">
						<a class="yddKeyTitle" href="${searchUrl}" target=_blank title="查看完整释义">${word}</a>
						<span class="ydd-phonetic" style="font-size:10px;">${strpho}</span>
						<span class="ydd-voice">${speach}</span>
						<a class="ydd-detail" href="http://www.youdao.com/search?q=${encodeURIComponent(word)}&ue=utf8&keyfrom=chrome.extension" target=_blank>详细</a>
						<a class="ydd-detail" href="#" id="addToNote" title="添加到单词本">+</a>
						<a class="ydd-close" href="javascript:void(0);">&times;</a>
					</div>
				</div>
				<div class="yddMiddle">`;

  if (noBaseTrans && noWebTrans) {
    fmt += `&nbsp;&nbsp;没有英汉互译结果<br/>&nbsp;&nbsp;<a href="${searchUrl}" target=_blank>请尝试网页搜索</a>`;
  } else {
    fmt += (noBaseTrans == false ? renderTransDetail('基本翻译', baseTrans) : '');
    fmt += (noWebTrans == false ? renderTransDetail('网络释义', webTrans) : '');
  }
  fmt += `</div></div>`;
  return fmt;
};

export default {
  table,
}