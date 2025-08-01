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
 * The TemporalRange model module.
 * @module model/TemporalRange
 * @version 2.0.0-RC4
 */
class TemporalRange {
    /**
     * Constructs a new <code>TemporalRange</code>.
     * @alias module:model/TemporalRange
     * @param start {Object} 
     * @param end {Object} 
     * @param center {Number} 
     */
    constructor(start, end, center) { 
        
        TemporalRange.initialize(this, start, end, center);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, start, end, center) { 
        obj['start'] = start;
        obj['end'] = end;
        obj['center'] = center;
    }

    /**
     * Constructs a <code>TemporalRange</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/TemporalRange} obj Optional instance to populate.
     * @return {module:model/TemporalRange} The populated <code>TemporalRange</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new TemporalRange();

            if (data.hasOwnProperty('start')) {
                obj['start'] = ApiClient.convertToType(data['start'], Object);
            }
            if (data.hasOwnProperty('end')) {
                obj['end'] = ApiClient.convertToType(data['end'], Object);
            }
            if (data.hasOwnProperty('center')) {
                obj['center'] = ApiClient.convertToType(data['center'], 'Number');
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>TemporalRange</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>TemporalRange</code>.
     */
    static validateJSON(data) {
        // check to make sure all required properties are present in the JSON string
        for (const property of TemporalRange.RequiredProperties) {
            if (!data.hasOwnProperty(property)) {
                throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
            }
        }

        return true;
    }


}

TemporalRange.RequiredProperties = ["start", "end", "center"];

/**
 * @member {Object} start
 */
TemporalRange.prototype['start'] = undefined;

/**
 * @member {Object} end
 */
TemporalRange.prototype['end'] = undefined;

/**
 * @member {Number} center
 */
TemporalRange.prototype['center'] = undefined;






export default TemporalRange;

