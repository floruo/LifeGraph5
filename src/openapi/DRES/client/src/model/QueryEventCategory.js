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
* Enum class QueryEventCategory.
* @enum {}
* @readonly
*/
export default class QueryEventCategory {
    
        /**
         * value: "TEXT"
         * @const
         */
        "TEXT" = "TEXT";

    
        /**
         * value: "IMAGE"
         * @const
         */
        "IMAGE" = "IMAGE";

    
        /**
         * value: "SKETCH"
         * @const
         */
        "SKETCH" = "SKETCH";

    
        /**
         * value: "FILTER"
         * @const
         */
        "FILTER" = "FILTER";

    
        /**
         * value: "BROWSING"
         * @const
         */
        "BROWSING" = "BROWSING";

    
        /**
         * value: "COOPERATION"
         * @const
         */
        "COOPERATION" = "COOPERATION";

    
        /**
         * value: "OTHER"
         * @const
         */
        "OTHER" = "OTHER";

    

    /**
    * Returns a <code>QueryEventCategory</code> enum value from a Javascript object name.
    * @param {Object} data The plain JavaScript object containing the name of the enum value.
    * @return {module:model/QueryEventCategory} The enum <code>QueryEventCategory</code> value.
    */
    static constructFromObject(object) {
        return object;
    }
}

