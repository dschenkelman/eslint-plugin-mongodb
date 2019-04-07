'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('./check-find-limit');

const ruleTester = new RuleTester();

ruleTester.run('check-find-limit', rule, {
  valid: [
    "db.collection('users').find({}, { limit: 1 });",
    "mongoClient.db.collection('users').find(ref, { limit: 1 }, function(){});"
  ],
  invalid: [
    {
      code: "db.collection('users').find({});",
      errors: [
        {
          message:
            "Expected db.collection('users').find to have at least 2 arguments. Query and options with a limit.",
        },
      ],
    },
    {
      code: "db.collection('users').find({}, function(){});",
      errors: [
        {
          message:
          "Expected db.collection('users').find second argument to be an Object and provide options with a limit.",
        },
      ],
    },
    {
        code: "db.collection('users').find({}, {});",
        errors: [
          {
            message:
            "Expected db.collection('users').find second argument to have a limit property that is a number.",
          },
        ],
      },
      {
        code: "db.collection('users').find({}, { limit: '10' });",
        errors: [
          {
            message:
            "Expected db.collection('users').find second argument to have a limit property that is a number.",
          },
        ],
      },
  ],
});
