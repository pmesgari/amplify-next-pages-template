import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

import { handleStripeEventLambda } from './functions/handle-stripe-event/resource';

defineBackend({
  auth,
  data,
  handleStripeEventLambda
});
