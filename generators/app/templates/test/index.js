'use strict';

const loggers = require('@hughescr/logger'); // Load logging early for the formatting
const logger = loggers.logger;
logger.restoreConsole();

const chai = require('chai');
chai.use(require('chai-as-promised'));
chai.use(require('chai-datetime'));
chai.should();
const expect = chai.expect;
expect(true).to.be.equal(true);

describe('Unit', () =>
{
    it('should define some unit tests');
});

describe('Feature', () =>
{
    it('should define some feature tests');
});
