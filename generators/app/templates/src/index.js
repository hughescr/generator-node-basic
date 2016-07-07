'use strict';
<% if(useFlow) {  %>/* @flow */<%  } %>

const loggers = require('@hughescr/logger');
const logger = loggers.logger;

logger.debug('This is a sample program!');
