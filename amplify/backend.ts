import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';


import { handleStripeEventLambda } from './functions/handle-stripe-event/resource';
import { DynamoDBStack } from './custom/data/resource';

const backend = defineBackend({
  auth,
  data,
  handleStripeEventLambda,
});

new DynamoDBStack(
  backend.stack,
  'dynamodbResource',
  {}
)
