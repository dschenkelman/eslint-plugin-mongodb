'use strict';

const utils = require('../utils');

function eMQCheckFindLimitCalls(context) {
  return utils.lookupCall(
    context,
    utils.getCallPatterns('query', context.settings),
    (callSource, args, node) => {
      const method = callSource.split('.').pop();

      if ('find' !== method) {
          return true;
      }

      if (args.length < 2) {
        context.report(
            node,
            `Expected ${callSource} to have at least 2 arguments. Query and options with a limit.`
          );
          return false;
      }

      if ('FunctionExpression' === args[1].type) {
        context.report(
            node,
            `Expected ${callSource} second argument to be an Object and provide options with a limit.`
          );
          return false;
      }

      if ('ObjectExpression' === args[1].type) {
        const optionsArg = args[1];
        const hasNumericLimit = optionsArg.properties
          .some(p => p.key.name === 'limit' && utils.nodeWillBeNumber(p.value));

        if (!hasNumericLimit) {
          context.report(
            node,
            `Expected ${callSource} second argument to have a limit property that is a number.`
          );
          return false;
        }
      }

      return true;
    }
  );
}

module.exports = eMQCheckFindLimitCalls;
