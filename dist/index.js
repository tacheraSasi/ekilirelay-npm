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
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var EkiliRelay = class {
  apikey;
  apiUrl = "https://relay.ekilie.com/api/index.php";
  maxMessageSize = 10 * 1024 * 1024;
  // 10MB limit in bytes
  /**
   * Constructs an instance of the EkiliRelay class.
   * @param apikey - The API key required for authenticating requests
   * @throws {ApiError} If API key is not provided
   */
  constructor(apikey) {
    if (!apikey) {
      const error = new Error("API key is required");
      error.statusCode = 401;
      throw error;
    }
    this.apikey = apikey;
  }
  /**
   * Validates an email address format
   * @param email - The email address to validate
   * @returns boolean indicating if the email format is valid
   */
  validateEmail(email) {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  }
  /**
   * Get the size of a string in bytes
   * @param str - The string to measure
   * @returns number of bytes
   */
  getStringSizeInBytes(str) {
    return new TextEncoder().encode(str).length;
  }
  /**
   * Validates the request payload
   * @param request - The email request to validate
   * @throws {ApiError} If validation fails
   */
  validateRequest(request) {
    const errors = [];
    if (!request.to || !this.validateEmail(request.to)) {
      errors.push("Invalid recipient email address");
    }
    if (!request.subject || request.subject.trim().length === 0) {
      errors.push("Subject is required");
    }
    if (!request.message || request.message.trim().length === 0) {
      errors.push("Message is required");
    }
    if (request.message && this.getStringSizeInBytes(request.message) > this.maxMessageSize) {
      errors.push("Message exceeds maximum size limit");
    }
    if (errors.length > 0) {
      const error = new Error(errors.join(", "));
      error.statusCode = 400;
      throw error;
    }
  }
  /**
   * Sanitizes input to prevent injection attacks
   * @param input - The string to sanitize
   * @returns Sanitized string
   */
  sanitizeInput(input) {
    return input.replace(/[<>]/g, "").trim();
  }
  /**
   * Sends an email using the provided details.
   * 
   * @param to - The recipient's email address
   * @param subject - The subject of the email
   * @param message - The body of the email
   * @param headers - Optional additional headers for the email
   * @returns Promise<EmailResponse> A promise that resolves to the result of the email sending operation
   * @throws {ApiError} If validation fails or request fails
   */
  async sendEmail(to, subject, message, headers) {
    try {
      this.validateRequest({ to, subject, message, headers });
      const sanitizedTo = this.sanitizeInput(to);
      const sanitizedSubject = this.sanitizeInput(subject);
      const sanitizedMessage = this.sanitizeInput(message);
      const sanitizedHeaders = headers ? this.sanitizeInput(headers) : void 0;
      const formData = new FormData();
      formData.append("to", sanitizedTo);
      formData.append("subject", sanitizedSubject);
      formData.append("message", sanitizedMessage);
      formData.append("apikey", this.apikey);
      if (sanitizedHeaders) {
        formData.append("headers", sanitizedHeaders);
      }
      const response = await fetch(this.apiUrl, {
        method: "POST",
        body: formData
      });
      if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`);
        error.statusCode = response.status;
        throw error;
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error sending email:", error);
      if (error.statusCode) {
        throw error;
      }
      return {
        status: "error",
        message: "An unexpected error occurred while sending the email"
      };
    }
  }
};
var index_default = EkiliRelay;
