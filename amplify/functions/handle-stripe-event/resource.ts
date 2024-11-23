import { defineFunction } from '@aws-amplify/backend';

export const handleStripeEvent = defineFunction({
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: './handler.ts'
});