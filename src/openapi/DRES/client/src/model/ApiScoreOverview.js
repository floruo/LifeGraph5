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
import ApiScore from './ApiScore';

/**
 * The ApiScoreOverview model module.
 * @module model/ApiScoreOverview
 * @version 2.0.0-RC4
 */
class ApiScoreOverview {
    /**
     * Constructs a new <code>ApiScoreOverview</code>.
     * @alias module:model/ApiScoreOverview
     * @param name {String} 
     * @param scores {Array.<module:model/ApiScore>} 
     */
    constructor(name, scores) { 
        
        ApiScoreOverview.initialize(this, name, scores);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, name, scores) { 
        obj['name'] = name;
        obj['scores'] = scores;
    }

    /**
     * Constructs a <code>ApiScoreOverview</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ApiScoreOverview} obj Optional instance to populate.
     * @return {module:model/ApiScoreOverview} The populated <code>ApiScoreOverview</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new ApiScoreOverview();

            if (data.hasOwnProperty('name')) {
                obj['name'] = ApiClient.convertToType(data['name'], 'String');
            }
            if (data.hasOwnProperty('taskGroup')) {
                obj['taskGroup'] = ApiClient.convertToType(data['taskGroup'], 'String');
            }
            if (data.hasOwnProperty('scores')) {
                obj['scores'] = ApiClient.convertToType(data['scores'], [ApiScore]);
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>ApiScoreOverview</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ApiScoreOverview</code>.
     */
    static validateJSON(data) {
        // check to make sure all required properties are present in the JSON string
        for (const property of ApiScoreOverview.RequiredProperties) {
            if (!data.hasOwnProperty(property)) {
                throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
            }
        }
        // ensure the json data is a string
        if (data['name'] && !(typeof data['name'] === 'string' || data['name'] instanceof String)) {
            throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data['name']);
        }
        // ensure the json data is a string
        if (data['taskGroup'] && !(typeof data['taskGroup'] === 'string' || data['taskGroup'] instanceof String)) {
            throw new Error("Expected the field `taskGroup` to be a primitive type in the JSON string but got " + data['taskGroup']);
        }
        if (data['scores']) { // data not null
            // ensure the json data is an array
            if (!Array.isArray(data['scores'])) {
                throw new Error("Expected the field `scores` to be an array in the JSON data but got " + data['scores']);
            }
            // validate the optional field `scores` (array)
            for (const item of data['scores']) {
                ApiScore.validateJSON(item);
            };
        }

        return true;
    }


}

ApiScoreOverview.RequiredProperties = ["name", "scores"];

/**
 * @member {String} name
 */
ApiScoreOverview.prototype['name'] = undefined;

/**
 * @member {String} taskGroup
 */
ApiScoreOverview.prototype['taskGroup'] = undefined;

/**
 * @member {Array.<module:model/ApiScore>} scores
 */
ApiScoreOverview.prototype['scores'] = undefined;






export default ApiScoreOverview;

