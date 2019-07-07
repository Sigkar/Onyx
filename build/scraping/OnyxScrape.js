"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OnyxScrape = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _htmlparser = _interopRequireDefault(require("htmlparser2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class OnyxScrape {
  constructor(url, targetAttr, includeString = false) {
    this.url = url;
    this.targetAttr = targetAttr;

    switch (includeString) {
      case false:
        break;

      default:
        this.includeString = includeString;
    }
  }

  async sendRequest() {
    try {
      return new Promise(async resolve => {
        const content = await this.__requestData();
        const parse = await this.__parseData(content);
        resolve(parse);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async __requestData() {
    const data = await _axios.default.get(this.url).then(function (response) {
      return response;
    }).catch(function (error) {
      return [false, error];
    });
    return data;
  }

  async __parseData(htmlToParse) {
    let text;
    const targetAttr = this.targetAttr;
    let handler = new _htmlparser.default.DomHandler(function (error, dom) {
      if (error) return false;

      const output = _htmlparser.default.DomUtils.getElementsByTagName(targetAttr, dom);

      text = _htmlparser.default.DomUtils.getText(output);
    }, {
      normalizeWhitespace: true
    });
    let parser = new _htmlparser.default.Parser(handler, {
      decodeEntities: true
    });
    parser.write(htmlToParse.data);
    parser.end();
    text = text.split(" ");
    return text;
  }

}

exports.OnyxScrape = OnyxScrape;