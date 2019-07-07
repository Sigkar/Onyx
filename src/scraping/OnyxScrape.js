import axios from "axios";
import htmlparser from "htmlparser2";

export class OnyxScrape {
  constructor(url, targetAttr, includeString = false) {
    this.url = url;
    this.targetAttr = targetAttr;
    switch (includeString) {
      case false:
        break;
      default:
        this.includeString = includeString;
    }
    return new Promise(async resolve => {
      const content = await this.__requestData();
      const parse = await this.__parseData(content);
      resolve(parse);
    });
  }

  async __requestData() {
    const data = await axios
      .get(this.url)
      .then(function(response) {
        return response;
      })
      .catch(function(error) {
        return [false, error];
      });
    return data;
  }

  async __parseData(htmlToParse) {
    let text;
    const targetAttr = this.targetAttr;
    let handler = new htmlparser.DomHandler(function(error, dom) {
      if(error) return false;
      const output = htmlparser.DomUtils.getElementsByTagName(targetAttr, dom);
      text = htmlparser.DomUtils.getText(output);
    }, {normalizeWhitespace: true});
    let parser = new htmlparser.Parser(handler, {decodeEntities: true});
    parser.write(htmlToParse.data);
    parser.end();
    text = text.split(" ");
    return text;
  }
}
