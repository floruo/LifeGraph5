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
import ApiMediaItemMetaDataEntry from './ApiMediaItemMetaDataEntry';
import ApiMediaType from './ApiMediaType';

/**
 * The ApiMediaItem model module.
 * @module model/ApiMediaItem
 * @version 2.0.0-RC4
 */
class ApiMediaItem {
    /**
     * Constructs a new <code>ApiMediaItem</code>.
     * @alias module:model/ApiMediaItem
     * @param mediaItemId {String} 
     * @param name {String} 
     * @param type {module:model/ApiMediaType} 
     * @param collectionId {String} 
     * @param location {String} 
     * @param metadata {Array.<module:model/ApiMediaItemMetaDataEntry>} 
     */
    constructor(mediaItemId, name, type, collectionId, location, metadata) { 
        
        ApiMediaItem.initialize(this, mediaItemId, name, type, collectionId, location, metadata);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, mediaItemId, name, type, collectionId, location, metadata) { 
        obj['mediaItemId'] = mediaItemId;
        obj['name'] = name;
        obj['type'] = type;
        obj['collectionId'] = collectionId;
        obj['location'] = location;
        obj['metadata'] = metadata;
    }

    /**
     * Constructs a <code>ApiMediaItem</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ApiMediaItem} obj Optional instance to populate.
     * @return {module:model/ApiMediaItem} The populated <code>ApiMediaItem</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new ApiMediaItem();

            if (data.hasOwnProperty('mediaItemId')) {
                obj['mediaItemId'] = ApiClient.convertToType(data['mediaItemId'], 'String');
            }
            if (data.hasOwnProperty('name')) {
                obj['name'] = ApiClient.convertToType(data['name'], 'String');
            }
            if (data.hasOwnProperty('type')) {
                obj['type'] = ApiMediaType.constructFromObject(data['type']);
            }
            if (data.hasOwnProperty('collectionId')) {
                obj['collectionId'] = ApiClient.convertToType(data['collectionId'], 'String');
            }
            if (data.hasOwnProperty('location')) {
                obj['location'] = ApiClient.convertToType(data['location'], 'String');
            }
            if (data.hasOwnProperty('durationMs')) {
                obj['durationMs'] = ApiClient.convertToType(data['durationMs'], 'Number');
            }
            if (data.hasOwnProperty('fps')) {
                obj['fps'] = ApiClient.convertToType(data['fps'], 'Number');
            }
            if (data.hasOwnProperty('metadata')) {
                obj['metadata'] = ApiClient.convertToType(data['metadata'], [ApiMediaItemMetaDataEntry]);
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>ApiMediaItem</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ApiMediaItem</code>.
     */
    static validateJSON(data) {
        // check to make sure all required properties are present in the JSON string
        for (const property of ApiMediaItem.RequiredProperties) {
            if (!data.hasOwnProperty(property)) {
                throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
            }
        }
        // ensure the json data is a string
        if (data['mediaItemId'] && !(typeof data['mediaItemId'] === 'string' || data['mediaItemId'] instanceof String)) {
            throw new Error("Expected the field `mediaItemId` to be a primitive type in the JSON string but got " + data['mediaItemId']);
        }
        // ensure the json data is a string
        if (data['name'] && !(typeof data['name'] === 'string' || data['name'] instanceof String)) {
            throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data['name']);
        }
        // ensure the json data is a string
        if (data['collectionId'] && !(typeof data['collectionId'] === 'string' || data['collectionId'] instanceof String)) {
            throw new Error("Expected the field `collectionId` to be a primitive type in the JSON string but got " + data['collectionId']);
        }
        // ensure the json data is a string
        if (data['location'] && !(typeof data['location'] === 'string' || data['location'] instanceof String)) {
            throw new Error("Expected the field `location` to be a primitive type in the JSON string but got " + data['location']);
        }
        if (data['metadata']) { // data not null
            // ensure the json data is an array
            if (!Array.isArray(data['metadata'])) {
                throw new Error("Expected the field `metadata` to be an array in the JSON data but got " + data['metadata']);
            }
            // validate the optional field `metadata` (array)
            for (const item of data['metadata']) {
                ApiMediaItemMetaDataEntry.validateJSON(item);
            };
        }

        return true;
    }


}

ApiMediaItem.RequiredProperties = ["mediaItemId", "name", "type", "collectionId", "location", "metadata"];

/**
 * @member {String} mediaItemId
 */
ApiMediaItem.prototype['mediaItemId'] = undefined;

/**
 * @member {String} name
 */
ApiMediaItem.prototype['name'] = undefined;

/**
 * @member {module:model/ApiMediaType} type
 */
ApiMediaItem.prototype['type'] = undefined;

/**
 * @member {String} collectionId
 */
ApiMediaItem.prototype['collectionId'] = undefined;

/**
 * @member {String} location
 */
ApiMediaItem.prototype['location'] = undefined;

/**
 * @member {Number} durationMs
 */
ApiMediaItem.prototype['durationMs'] = undefined;

/**
 * @member {Number} fps
 */
ApiMediaItem.prototype['fps'] = undefined;

/**
 * @member {Array.<module:model/ApiMediaItemMetaDataEntry>} metadata
 */
ApiMediaItem.prototype['metadata'] = undefined;






export default ApiMediaItem;

