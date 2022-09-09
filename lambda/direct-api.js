'use strict';

const axios = require('axios');

const ingestUrl = 'https://app.amberflo.io/ingest';
const apiKey = process.env.AMBERFLO_API_KEY;

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
