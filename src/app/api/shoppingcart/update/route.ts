import {
  DynamoDBClient,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });

/**
 * UpdateOrder function updates an item in the MealOrders table.
 *
 * @param {*} payload - The payload containing the updated attributes.
 * @param {*} keys - The keys identifying the item to be updated.
 * @return {*} - Returns a JSON stringified response object.
 */
const UpdateOrder = async (payload: any, keys: any) => {
  // Dynamically update item
  let exp = 'set ';
  let attNames: any = {};
  let attVal: any = {};

  for (const attribute in payload) {
    const valKey = `:${attribute}`;
    attNames[`#${attribute}`] = attribute;
    exp += `#${attribute} = ${valKey}, `;
    const val = payload[attribute];
    for (const att in val) {
      attVal[valKey] = { [att]: val[att] };
    }
  }
  exp = exp.substring(0, exp.length - 2);

  const input: UpdateItemCommandInput = {
    TableName: 'MealOrders',
    Key: keys,
    UpdateExpression: exp,
    ExpressionAttributeValues: attVal,
    ExpressionAttributeNames: attNames,
  };
  const command = new UpdateItemCommand(input);

  const response = await client.send(command);

  return JSON.stringify(response);
};

/**
 * The PUT function handles a PUT request and updates an order in the MealOrders table.
 * @export
 * @param {Request} request - The request object containing the request data.
 * @return {*} - Returns a Response object with the result of the update operation.
 * Example payload 
 *  let rawPayload = {
      PK: {
        S: 'ORG#1#ORDER#3',
      },
      SK: {
        S: 'DATE#2#ITEM#1',
      },
      // Update atribute
      GSI1PK: {
        S: 'ORG#2', 
      },
  };
 */
export async function PUT(request: Request) {
  const rawPayload = await request.json();

  const { PK, SK, ...payload } = rawPayload;

  const keys = {
    PK,
    SK,
  };

  // Run the async function
  const rs: any = await UpdateOrder(payload, keys);
  return new Response(rs);
}
