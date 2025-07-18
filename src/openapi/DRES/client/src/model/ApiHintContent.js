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
import ApiContentElement from './ApiContentElement';

/**
 * The ApiHintContent model module.
 * @module model/ApiHintContent
 * @version 2.0.0-RC4
 */
class ApiHintContent {
    /**
     * Constructs a new <code>ApiHintContent</code>.
     * @alias module:model/ApiHintContent
     * @param taskId {String} 
     * @param sequence {Array.<module:model/ApiContentElement>} 
     * @param loop {Boolean} 
     */
    constructor(taskId, sequence, loop) { 
        
        ApiHintContent.initialize(this, taskId, sequence, loop);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, taskId, sequence, loop) { 
        obj['taskId'] = taskId;
        obj['sequence'] = sequence;
        obj['loop'] = loop;
    }

    /**
     * Constructs a <code>ApiHintContent</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ApiHintContent} obj Optional instance to populate.
     * @return {module:model/ApiHintContent} The populated <code>ApiHintContent</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new ApiHintContent();

            if (data.hasOwnProperty('taskId')) {
                obj['taskId'] = ApiClient.convertToType(data['taskId'], 'String');
            }
            if (data.hasOwnProperty('sequence')) {
                obj['sequence'] = ApiClient.convertToType(data['sequence'], [ApiContentElement]);
            }
            if (data.hasOwnProperty('loop')) {
                obj['loop'] = ApiClient.convertToType(data['loop'], 'Boolean');
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>ApiHintContent</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ApiHintContent</code>.
     */
    static validateJSON(data) {
        // check to make sure all required properties are present in the JSON string
        for (const property of ApiHintContent.RequiredProperties) {
            if (!data.hasOwnProperty(property)) {
                throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
            }
        }
        // ensure the json data is a string
        if (data['taskId'] && !(typeof data['taskId'] === 'string' || data['taskId'] instanceof String)) {
            throw new Error("Expected the field `taskId` to be a primitive type in the JSON string but got " + data['taskId']);
        }
        if (data['sequence']) { // data not null
            // ensure the json data is an array
            if (!Array.isArray(data['sequence'])) {
                throw new Error("Expected the field `sequence` to be an array in the JSON data but got " + data['sequence']);
            }
            // validate the optional field `sequence` (array)
            for (const item of data['sequence']) {
                ApiContentElement.validateJSON(item);
            };
        }

        return true;
    }


}

ApiHintContent.RequiredProperties = ["taskId", "sequence", "loop"];

/**
 * @member {String} taskId
 */
ApiHintContent.prototype['taskId'] = undefined;

/**
 * @member {Array.<module:model/ApiContentElement>} sequence
 */
ApiHintContent.prototype['sequence'] = undefined;

/**
 * @member {Boolean} loop
 */
ApiHintContent.prototype['loop'] = undefined;






export default ApiHintContent;

