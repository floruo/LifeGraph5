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
import ApiClientAnswerSet from './ApiClientAnswerSet';

/**
 * The ApiClientSubmission model module.
 * @module model/ApiClientSubmission
 * @version 2.0.0-RC4
 */
class ApiClientSubmission {
    /**
     * Constructs a new <code>ApiClientSubmission</code>.
     * @alias module:model/ApiClientSubmission
     * @param answerSets {Array.<module:model/ApiClientAnswerSet>} 
     */
    constructor(answerSets) { 
        
        ApiClientSubmission.initialize(this, answerSets);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, answerSets) { 
        obj['answerSets'] = answerSets;
    }

    /**
     * Constructs a <code>ApiClientSubmission</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ApiClientSubmission} obj Optional instance to populate.
     * @return {module:model/ApiClientSubmission} The populated <code>ApiClientSubmission</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new ApiClientSubmission();

            if (data.hasOwnProperty('answerSets')) {
                obj['answerSets'] = ApiClient.convertToType(data['answerSets'], [ApiClientAnswerSet]);
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>ApiClientSubmission</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ApiClientSubmission</code>.
     */
    static validateJSON(data) {
        // check to make sure all required properties are present in the JSON string
        for (const property of ApiClientSubmission.RequiredProperties) {
            if (!data.hasOwnProperty(property)) {
                throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
            }
        }
        if (data['answerSets']) { // data not null
            // ensure the json data is an array
            if (!Array.isArray(data['answerSets'])) {
                throw new Error("Expected the field `answerSets` to be an array in the JSON data but got " + data['answerSets']);
            }
            // validate the optional field `answerSets` (array)
            for (const item of data['answerSets']) {
                ApiClientAnswerSet.validateJSON(item);
            };
        }

        return true;
    }


}

ApiClientSubmission.RequiredProperties = ["answerSets"];

/**
 * @member {Array.<module:model/ApiClientAnswerSet>} answerSets
 */
ApiClientSubmission.prototype['answerSets'] = undefined;






export default ApiClientSubmission;

