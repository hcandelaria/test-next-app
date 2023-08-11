import {
  BatchWriteItemCommand,
  DynamoDBClient,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });
/**
 *
 *
 * @param {*} payload
 * @return {*}
 */
const CreateOrder = async (payload: any) => {
  console.log(payload);
  // Adds payload to MealOrders

  const input = payload.map((orderItem: any) => {
    const itemRequest = {
      Item: orderItem,
    };
    return { PutRequest: itemRequest };
  });

  console.log(input);

  const command = new BatchWriteItemCommand({
    RequestItems: {
      ['MealOrders']: input,
    },
  });

  const response = await client.send(command);
  return JSON.stringify(response);
};

/**
 *
 *
 * @export
 * @param {Request} request
 * @return {*}
 */
export async function POST(request: Request) {
  const payload = await request.json();

  // Run the async function
  const rs: any = await CreateOrder(payload);
  return new Response(rs);
}
