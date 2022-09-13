'use strict';

/*
 * To ingest asynchronously from a CloudWatch log subscription, simply log the
 * meter as a JSON string.  You add a prefix to the log entry in order to
 * easily identify the log entries contining meter records.
 */
module.exports = async (record) => {
    console.log('meter_record_for_cw', JSON.stringify(record));
};
