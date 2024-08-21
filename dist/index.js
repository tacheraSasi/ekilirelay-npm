"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var EkiliRelay = class {
  apiUrl;
  constructor() {
    this.apiUrl = "https://relay.ekilie.com/api/index.php";
    console.log("EkiliRelay connected");
  }
  /**
   * Sends an email using EkiliRelay.
   * @param {string} to Email address of the recipient.
   * @param {string} subject Subject of the email.
   * @param {string} body Body content of the email.
   * @param {string} from Sender's email address.
   * @param {string} [headers] Optional headers for the email.
   * @returns {Promise<object>} A promise resolving to the response object.
   */
  async sendEmail(to, subject, body, from, headers = "") {
    const data = {
      to,
      subject,
      body,
      from,
      headers
    };
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        return { status: "error", message: error.message };
      } else {
        return { status: "error", message: "An unknown error occurred" };
      }
    }
  }
};
var src_default = EkiliRelay;
