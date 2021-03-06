export interface IWord {
  word: string,
  speech?: string,
  ukSpeech?: string, // 发音,eg."proactive&type=1"
  usSpeech?: string,
  phonetic?: string, // 音标
  ukPhonetic?: string,
  usPhonetic?: string,
  baseTrans?: string,
  webTrans?: string,
  createTime?: number, // 添加时间
  lastView?: number, // 最后查看时间
  phrase?: string, // 接口返回的查询词
  type?: string, // 类型
}

export interface ITranslator {
  word: string;

  query: ()=>any;
  parse: (resp) => IWord;
}

export interface SpeachInfo {
  /** 朗读单词 */
  word: string;
  /** 朗读类型 */
  type?: string;
}