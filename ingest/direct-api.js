'use strict';

const axios = require('axios');

const ingestUrl = 'https://app.amberflo.io/ingest';
const apiKey = process.env.AMBERFLO_API_KEY;

/*
 * Make an HTTP request to the Amberflo ingest API.
 *
 * You'll need to handle errors related to the HTTP request itself but also
 * validation of the meter record.
 */
module.exports = async (record) => {
    return axios.request({
        url: ingestUrl,
        method: 'POST',
        data: record,
        headers: {
            'X-API-KEY': apiKey,
        },
    });
};
