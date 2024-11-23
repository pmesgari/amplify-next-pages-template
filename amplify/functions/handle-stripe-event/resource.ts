import { defineBackend, defineFunction } from '@aws-amplify/backend';
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as iam from "aws-cdk-lib/aws-iam";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const handleStripeEventLambda = defineFunction({
    // optionally specify a path to your handler (defaults to "./handler.ts")
    name: 'handle-strip-event',
    entry: './handler.ts'
});

export class DynamoDBStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create a DynamoDB table
        const table = new dynamodb.Table(this, "PaymentCompletedEvent", {
            tableName: "PaymentCompletedEvent", // Optional: Specify table name
            partitionKey: {
                name: "id", // Replace with your partition key name
                type: dynamodb.AttributeType.STRING,
            },
            billingMode: dynamodb.BillingMode.PROVISIONED, // Choose PAY_PER_REQUEST or PROVISIONED
            removalPolicy: cdk.RemovalPolicy.RETAIN, // Prevent accidental deletion in production
        });

        const backend = defineBackend({handleStripeEventLambda})
        const lambda = backend.handleStripeEventLambda.resources.lambda

        table.grant(lambda, 'dynamodb:PutItem');

        // Outputs
        new cdk.CfnOutput(this, "PaymentCompletedEvent", {
            value: table.tableName,
            description: "PaymentCompletedEvent Table",
        });
    }
}

