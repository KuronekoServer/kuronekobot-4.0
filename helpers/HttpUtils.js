//MikanBot Discord Utilities
//Licenced to KuronekoServer under the MIT License
//© 2023 MikanDev All Rights Reserved

const ISO6391 = require("iso-639-1");
const sourcebin = require("sourcebin_js");
const fetch = require("node-fetch");
const { translate } = require("@vitalets/google-translate-api");

module.exports = class HttpUtils {
  /**
   * Returns JSON response from url
   * @param {string} url
   */
  static async getJson(url) {
    try {
      const response = await fetch(url);
      const json = await response.json();
      return {
        success: response.status === 200 ? true : false,
        status: response.status,
        data: json,
      };
    } catch (ex) {
      return {
        success: false,
      };
    }
  }

  /**
   * Returns buffer from url
   * @param {string} url
   */
  static async getBuffer(url) {
    try {
      const response = await fetch(url);
      const buffer = await response.buffer();
      return {
        success: response.status === 200 ? true : false,
        status: response.status,
        buffer,
      };
    } catch (ex) {
      return {
        success: false,
      };
    }
  }

  /**
   * Translates the provided content to the provided language code
   * @param {string} content
   * @param {string} outputCode
   */
  static async translate(content, outputCode) {
    try {
      const response = await translate(content, { to: outputCode });
      return {
        output: response.text
      };
    } catch (ex) {
    }
  }

  /**
   * Posts the provided content to the BIN
   * @param {string} content
   * @param {string} title
   */
  static async postToBin(content, title) {
    try {
      const response = await sourcebin.create(
        [
          {
            name: " ",
            content,
            languageId: "text",
          },
        ],
        {
          title,
          description: " ",
        }
      );
      return {
        url: response.url,
        short: response.short,
        raw: `https://cdn.sourceb.in/bins/${response.key}/0`,
      };
    } catch (ex) {
    }
  }
};