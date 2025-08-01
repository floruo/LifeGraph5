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

/**
 * The SuccessStatus model module.
 * @module model/SuccessStatus
 * @version 2.0.0-RC4
 */
class SuccessStatus {
    /**
     * Constructs a new <code>SuccessStatus</code>.
     * @alias module:model/SuccessStatus
     * @param status {Boolean} 
     * @param description {String} 
     */
    constructor(status, description) { 
        
        SuccessStatus.initialize(this, status, description);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, status, description) { 
        obj['status'] = status;
        obj['description'] = description;
    }

    /**
     * Constructs a <code>SuccessStatus</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SuccessStatus} obj Optional instance to populate.
     * @return {module:model/SuccessStatus} The populated <code>SuccessStatus</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new SuccessStatus();

            if (data.hasOwnProperty('status')) {
                obj['status'] = ApiClient.convertToType(data['status'], 'Boolean');
            }
            if (data.hasOwnProperty('description')) {
                obj['description'] = ApiClient.convertToType(data['description'], 'String');
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>SuccessStatus</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>SuccessStatus</code>.
     */
    static validateJSON(data) {
        // check to make sure all required properties are present in the JSON string
        for (const property of SuccessStatus.RequiredProperties) {
            if (!data.hasOwnProperty(property)) {
                throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
            }
        }
        // ensure the json data is a string
        if (data['description'] && !(typeof data['description'] === 'string' || data['description'] instanceof String)) {
            throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data['description']);
        }

        return true;
    }


}

SuccessStatus.RequiredProperties = ["status", "description"];

/**
 * @member {Boolean} status
 */
SuccessStatus.prototype['status'] = undefined;

/**
 * @member {String} description
 */
SuccessStatus.prototype['description'] = undefined;






export default SuccessStatus;

