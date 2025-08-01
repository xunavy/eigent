"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/interface/crud/emails.ts
var emails_exports = {};
__export(emails_exports, {
  internalEmailsCrud: () => internalEmailsCrud,
  sentEmailReadSchema: () => sentEmailReadSchema
});
module.exports = __toCommonJS(emails_exports);
var import_crud = require("../../crud");
var fieldSchema = __toESM(require("../../schema-fields"));
var import_projects = require("./projects");
var sentEmailReadSchema = fieldSchema.yupObject({
  id: fieldSchema.yupString().defined(),
  subject: fieldSchema.yupString().defined(),
  sent_at_millis: fieldSchema.yupNumber().defined(),
  to: fieldSchema.yupArray(fieldSchema.yupString().defined()),
  sender_config: import_projects.emailConfigWithoutPasswordSchema.defined(),
  error: fieldSchema.yupMixed().nullable().optional()
}).defined();
var internalEmailsCrud = (0, import_crud.createCrud)({
  adminReadSchema: sentEmailReadSchema
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  internalEmailsCrud,
  sentEmailReadSchema
});
//# sourceMappingURL=emails.js.map