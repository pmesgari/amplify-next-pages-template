import type { EventBridgeHandler, Context, Callback } from 'aws-lambda';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';


const dynamo = DynamoDBDocument.from(new DynamoDB());

interface StripeEventDetail {
    data: StripeEventData
}

interface StripeEventData {
    object: CheckoutSessionObject
}

interface CheckoutSessionObject {
    id: string
    object: string
    status: string
    customer_details: CustomerDetails
    metadata: CheckoutSessionObjectMetadata
}

interface CheckoutSessionObjectMetadata {
    program_id: string
}

interface CustomerDetails {
    address: Address
    email: string
    name: string
}


interface Address {

}

interface Result {
    msg: string
    statusCode: string
}


export const handler: EventBridgeHandler<"Stripe Event", StripeEventDetail, Result> = async (
    event, 
    context: Context,
    callback: Callback) => {

    let msg = '';
    let statusCode = '200';

    let eventId = event.id;

    let detail = event.detail;
    let data = detail.data.object;
    let stripeId = data.id;
    let object = data.object;
    let status = data.status;
    if (object === "checkout.session" && status === 'complete') {
        let email = data.customer_details.email;
        let program_id = data.metadata.program_id;
        console.log("Adding user:", JSON.stringify({ email, program_id }, null, 2));

        try {
            await dynamo.put({
                TableName: 'StripeEvent',
                Item: {
                    id: eventId,
                    stripeId: stripeId,
                    object: object,
                    status: status,
                    data: {
                        email: email,
                        program_id: program_id
                    }
                },
            });
            msg = 'Successfully added user';
        } catch (err) {
            console.error(err)
            msg = 'Adding user failed';
            statusCode = '400'
        }
    };

    return {msg, statusCode}
}