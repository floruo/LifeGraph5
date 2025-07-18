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
import ApiTemporalPoint from './ApiTemporalPoint';

/**
 * The ApiTemporalRange model module.
 * @module model/ApiTemporalRange
 * @version 2.0.0-RC4
 */
class ApiTemporalRange {
    /**
     * Constructs a new <code>ApiTemporalRange</code>.
     * @alias module:model/ApiTemporalRange
     * @param start {module:model/ApiTemporalPoint} 
     * @param end {module:model/ApiTemporalPoint} 
     */
    constructor(start, end) { 
        
        ApiTemporalRange.initialize(this, start, end);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, start, end) { 
        obj['start'] = start;
        obj['end'] = end;
    }

    /**
     * Constructs a <code>ApiTemporalRange</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ApiTemporalRange} obj Optional instance to populate.
     * @return {module:model/ApiTemporalRange} The populated <code>ApiTemporalRange</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new ApiTemporalRange();

            if (data.hasOwnProperty('start')) {
                obj['start'] = ApiTemporalPoint.constructFromObject(data['start']);
            }
            if (data.hasOwnProperty('end')) {
                obj['end'] = ApiTemporalPoint.constructFromObject(data['end']);
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>ApiTemporalRange</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ApiTemporalRange</code>.
     */
    static validateJSON(data) {
        // check to make sure all required properties are present in the JSON string
        for (const property of ApiTemporalRange.RequiredProperties) {
            if (!data.hasOwnProperty(property)) {
                throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
            }
        }
        // validate the optional field `start`
        if (data['start']) { // data not null
          ApiTemporalPoint.validateJSON(data['start']);
        }
        // validate the optional field `end`
        if (data['end']) { // data not null
          ApiTemporalPoint.validateJSON(data['end']);
        }

        return true;
    }


}

ApiTemporalRange.RequiredProperties = ["start", "end"];

/**
 * @member {module:model/ApiTemporalPoint} start
 */
ApiTemporalRange.prototype['start'] = undefined;

/**
 * @member {module:model/ApiTemporalPoint} end
 */
ApiTemporalRange.prototype['end'] = undefined;






export default ApiTemporalRange;

