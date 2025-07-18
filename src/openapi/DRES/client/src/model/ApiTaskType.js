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

import ApiClient from '../ApiClient';
import ApiHintOption from './ApiHintOption';
import ApiScoreOption from './ApiScoreOption';
import ApiSubmissionOption from './ApiSubmissionOption';
import ApiTargetOption from './ApiTargetOption';
import ApiTaskOption from './ApiTaskOption';

/**
 * The ApiTaskType model module.
 * @module model/ApiTaskType
 * @version 2.0.0-RC4
 */
class ApiTaskType {
    /**
     * Constructs a new <code>ApiTaskType</code>.
     * @alias module:model/ApiTaskType
     * @param name {String} 
     * @param duration {Number} 
     * @param targetOption {module:model/ApiTargetOption} 
     * @param hintOptions {Array.<module:model/ApiHintOption>} 
     * @param submissionOptions {Array.<module:model/ApiSubmissionOption>} 
     * @param taskOptions {Array.<module:model/ApiTaskOption>} 
     * @param scoreOption {module:model/ApiScoreOption} 
     * @param configuration {Object.<String, String>} 
     */
    constructor(name, duration, targetOption, hintOptions, submissionOptions, taskOptions, scoreOption, configuration) { 
        
        ApiTaskType.initialize(this, name, duration, targetOption, hintOptions, submissionOptions, taskOptions, scoreOption, configuration);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, name, duration, targetOption, hintOptions, submissionOptions, taskOptions, scoreOption, configuration) { 
        obj['name'] = name;
        obj['duration'] = duration;
        obj['targetOption'] = targetOption;
        obj['hintOptions'] = hintOptions;
        obj['submissionOptions'] = submissionOptions;
        obj['taskOptions'] = taskOptions;
        obj['scoreOption'] = scoreOption;
        obj['configuration'] = configuration;
    }

    /**
     * Constructs a <code>ApiTaskType</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ApiTaskType} obj Optional instance to populate.
     * @return {module:model/ApiTaskType} The populated <code>ApiTaskType</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new ApiTaskType();

            if (data.hasOwnProperty('name')) {
                obj['name'] = ApiClient.convertToType(data['name'], 'String');
            }
            if (data.hasOwnProperty('duration')) {
                obj['duration'] = ApiClient.convertToType(data['duration'], 'Number');
            }
            if (data.hasOwnProperty('targetOption')) {
                obj['targetOption'] = ApiTargetOption.constructFromObject(data['targetOption']);
            }
            if (data.hasOwnProperty('hintOptions')) {
                obj['hintOptions'] = ApiClient.convertToType(data['hintOptions'], [ApiHintOption]);
            }
            if (data.hasOwnProperty('submissionOptions')) {
                obj['submissionOptions'] = ApiClient.convertToType(data['submissionOptions'], [ApiSubmissionOption]);
            }
            if (data.hasOwnProperty('taskOptions')) {
                obj['taskOptions'] = ApiClient.convertToType(data['taskOptions'], [ApiTaskOption]);
            }
            if (data.hasOwnProperty('scoreOption')) {
                obj['scoreOption'] = ApiScoreOption.constructFromObject(data['scoreOption']);
            }
            if (data.hasOwnProperty('configuration')) {
                obj['configuration'] = ApiClient.convertToType(data['configuration'], {'String': 'String'});
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>ApiTaskType</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ApiTaskType</code>.
     */
    static validateJSON(data) {
        // check to make sure all required properties are present in the JSON string
        for (const property of ApiTaskType.RequiredProperties) {
            if (!data.hasOwnProperty(property)) {
                throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
            }
        }
        // ensure the json data is a string
        if (data['name'] && !(typeof data['name'] === 'string' || data['name'] instanceof String)) {
            throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data['name']);
        }
        // ensure the json data is an array
        if (!Array.isArray(data['hintOptions'])) {
            throw new Error("Expected the field `hintOptions` to be an array in the JSON data but got " + data['hintOptions']);
        }
        // ensure the json data is an array
        if (!Array.isArray(data['submissionOptions'])) {
            throw new Error("Expected the field `submissionOptions` to be an array in the JSON data but got " + data['submissionOptions']);
        }
        // ensure the json data is an array
        if (!Array.isArray(data['taskOptions'])) {
            throw new Error("Expected the field `taskOptions` to be an array in the JSON data but got " + data['taskOptions']);
        }

        return true;
    }


}

ApiTaskType.RequiredProperties = ["name", "duration", "targetOption", "hintOptions", "submissionOptions", "taskOptions", "scoreOption", "configuration"];

/**
 * @member {String} name
 */
ApiTaskType.prototype['name'] = undefined;

/**
 * @member {Number} duration
 */
ApiTaskType.prototype['duration'] = undefined;

/**
 * @member {module:model/ApiTargetOption} targetOption
 */
ApiTaskType.prototype['targetOption'] = undefined;

/**
 * @member {Array.<module:model/ApiHintOption>} hintOptions
 */
ApiTaskType.prototype['hintOptions'] = undefined;

/**
 * @member {Array.<module:model/ApiSubmissionOption>} submissionOptions
 */
ApiTaskType.prototype['submissionOptions'] = undefined;

/**
 * @member {Array.<module:model/ApiTaskOption>} taskOptions
 */
ApiTaskType.prototype['taskOptions'] = undefined;

/**
 * @member {module:model/ApiScoreOption} scoreOption
 */
ApiTaskType.prototype['scoreOption'] = undefined;

/**
 * @member {Object.<String, String>} configuration
 */
ApiTaskType.prototype['configuration'] = undefined;






export default ApiTaskType;

