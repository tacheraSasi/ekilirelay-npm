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
  apikey;
  // The API key required for authenticating requests
  apiUrl;
  // The URL of the API endpoint for sending emails
  /**
   * Constructs an instance of the EkiliRelay class.
   * @param apikey - The API key required for authenticating requests
   */
  constructor(apikey) {
    this.apikey = apikey;
    this.apiUrl = "https://relay.ekilie.com/api/index.php";
    console.log("EkiliRelay connected");
  }
  /**
   * Sends an email using the provided details.
   * 
   * @param to - The recipient's email address.
   * @param subject - The subject of the email.
   * @param message - The body of the email.
   * @param headers - Optional additional headers for the email.
   * @returns A promise that resolves to the result of the email sending operation.
   */
  async sendEmail(to, subject, message, headers = "") {
    const data = {
      to,
      // Recipient's email address
      subject,
      // Subject line of the email
      message,
      // Body of the email
      headers,
      // Optional additional headers
      apikey: this.apikey
      // API key for authentication
    };
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        // HTTP method to use
        headers: {
          "Content-Type": "application/json"
          // Specify that we are sending JSON data
        },
        body: JSON.stringify(data)
        // Convert the data object to a JSON string
      });
      const result = await response.json();
      return result;
    } catch (error) {
      return { status: "error", message: error.message };
    }
  }
};
var src_default = EkiliRelay;
