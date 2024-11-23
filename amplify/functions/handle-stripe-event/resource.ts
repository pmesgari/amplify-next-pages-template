import { defineFunction } from '@aws-amplify/backend';

export const handleStripeEventLambda = defineFunction({
    // optionally specify a path to your handler (defaults to "./handler.ts")
    name: 'handle-strip-event',
    entry: './handler.ts',
});

