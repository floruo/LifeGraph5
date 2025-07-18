/**
 * DRES Client API
 * Client API for DRES (Distributed Retrieval Evaluation Server), Version 2.0.0-RC4
 *
 * The version of the OpenAPI document: 2.0.0-RC4
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['expect.js', process.cwd()+'/src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require(process.cwd()+'/src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.DresClientApi);
  }
}(this, function(expect, DresClientApi) {
  'use strict';

  var instance;

  beforeEach(function() {
    instance = new DresClientApi.ApiJudgementRequest();
  });

  var getProperty = function(object, getter, property) {
    // Use getter method if present; otherwise, get the property directly.
    if (typeof object[getter] === 'function')
      return object[getter]();
    else
      return object[property];
  }

  var setProperty = function(object, setter, property, value) {
    // Use setter method if present; otherwise, set the property directly.
    if (typeof object[setter] === 'function')
      object[setter](value);
    else
      object[property] = value;
  }

  describe('ApiJudgementRequest', function() {
    it('should create an instance of ApiJudgementRequest', function() {
      // uncomment below and update the code to test ApiJudgementRequest
      //var instance = new DresClientApi.ApiJudgementRequest();
      //expect(instance).to.be.a(DresClientApi.ApiJudgementRequest);
    });

    it('should have the property token (base name: "token")', function() {
      // uncomment below and update the code to test the property token
      //var instance = new DresClientApi.ApiJudgementRequest();
      //expect(instance).to.be();
    });

    it('should have the property validator (base name: "validator")', function() {
      // uncomment below and update the code to test the property validator
      //var instance = new DresClientApi.ApiJudgementRequest();
      //expect(instance).to.be();
    });

    it('should have the property taskDescription (base name: "taskDescription")', function() {
      // uncomment below and update the code to test the property taskDescription
      //var instance = new DresClientApi.ApiJudgementRequest();
      //expect(instance).to.be();
    });

    it('should have the property answerSet (base name: "answerSet")', function() {
      // uncomment below and update the code to test the property answerSet
      //var instance = new DresClientApi.ApiJudgementRequest();
      //expect(instance).to.be();
    });

  });

}));
