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
import ApiHintType from './ApiHintType';
import ApiTemporalRange from './ApiTemporalRange';

/**
 * The ApiHint model module.
 * @module model/ApiHint
 * @version 2.0.0-RC4
 */
class ApiHint {
    /**
     * Constructs a new <code>ApiHint</code>.
     * @alias module:model/ApiHint
     * @param type {module:model/ApiHintType} 
     */
    constructor(type) { 
        
        ApiHint.initialize(this, type);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, type) { 
        obj['type'] = type;
    }

    /**
     * Constructs a <code>ApiHint</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ApiHint} obj Optional instance to populate.
     * @return {module:model/ApiHint} The populated <code>ApiHint</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new ApiHint();

            if (data.hasOwnProperty('type')) {
                obj['type'] = ApiHintType.constructFromObject(data['type']);
            }
            if (data.hasOwnProperty('start')) {
                obj['start'] = ApiClient.convertToType(data['start'], 'Number');
            }
            if (data.hasOwnProperty('end')) {
                obj['end'] = ApiClient.convertToType(data['end'], 'Number');
            }
            if (data.hasOwnProperty('description')) {
                obj['description'] = ApiClient.convertToType(data['description'], 'String');
            }
            if (data.hasOwnProperty('path')) {
                obj['path'] = ApiClient.convertToType(data['path'], 'String');
            }
            if (data.hasOwnProperty('dataType')) {
                obj['dataType'] = ApiClient.convertToType(data['dataType'], 'String');
            }
            if (data.hasOwnProperty('mediaItem')) {
                obj['mediaItem'] = ApiClient.convertToType(data['mediaItem'], 'String');
            }
            if (data.hasOwnProperty('mediaItemName')) {
                obj['mediaItemName'] = ApiClient.convertToType(data['mediaItemName'], 'String');
            }
            if (data.hasOwnProperty('range')) {
                obj['range'] = ApiTemporalRange.constructFromObject(data['range']);
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>ApiHint</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ApiHint</code>.
     */
    static validateJSON(data) {
        // check to make sure all required properties are present in the JSON string
        for (const property of ApiHint.RequiredProperties) {
            if (!data.hasOwnProperty(property)) {
                throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
            }
        }
        // ensure the json data is a string
        if (data['description'] && !(typeof data['description'] === 'string' || data['description'] instanceof String)) {
            throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data['description']);
        }
        // ensure the json data is a string
        if (data['path'] && !(typeof data['path'] === 'string' || data['path'] instanceof String)) {
            throw new Error("Expected the field `path` to be a primitive type in the JSON string but got " + data['path']);
        }
        // ensure the json data is a string
        if (data['dataType'] && !(typeof data['dataType'] === 'string' || data['dataType'] instanceof String)) {
            throw new Error("Expected the field `dataType` to be a primitive type in the JSON string but got " + data['dataType']);
        }
        // ensure the json data is a string
        if (data['mediaItem'] && !(typeof data['mediaItem'] === 'string' || data['mediaItem'] instanceof String)) {
            throw new Error("Expected the field `mediaItem` to be a primitive type in the JSON string but got " + data['mediaItem']);
        }
        // ensure the json data is a string
        if (data['mediaItemName'] && !(typeof data['mediaItemName'] === 'string' || data['mediaItemName'] instanceof String)) {
            throw new Error("Expected the field `mediaItemName` to be a primitive type in the JSON string but got " + data['mediaItemName']);
        }
        // validate the optional field `range`
        if (data['range']) { // data not null
          ApiTemporalRange.validateJSON(data['range']);
        }

        return true;
    }


}

ApiHint.RequiredProperties = ["type"];

/**
 * @member {module:model/ApiHintType} type
 */
ApiHint.prototype['type'] = undefined;

/**
 * @member {Number} start
 */
ApiHint.prototype['start'] = undefined;

/**
 * @member {Number} end
 */
ApiHint.prototype['end'] = undefined;

/**
 * @member {String} description
 */
ApiHint.prototype['description'] = undefined;

/**
 * @member {String} path
 */
ApiHint.prototype['path'] = undefined;

/**
 * @member {String} dataType
 */
ApiHint.prototype['dataType'] = undefined;

/**
 * @member {String} mediaItem
 */
ApiHint.prototype['mediaItem'] = undefined;

/**
 * @member {String} mediaItemName
 */
ApiHint.prototype['mediaItemName'] = undefined;

/**
 * @member {module:model/ApiTemporalRange} range
 */
ApiHint.prototype['range'] = undefined;






export default ApiHint;

