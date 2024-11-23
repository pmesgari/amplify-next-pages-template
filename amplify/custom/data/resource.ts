import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

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
  
        // Outputs
        new cdk.CfnOutput(this, "PaymentCompletedEvent", {
            value: table.tableName,
            description: "PaymentCompletedEvent Table",
        });
    }
  }