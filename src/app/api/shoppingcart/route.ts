import {
  DynamoDBClient,
  ExecuteStatementCommand,
} from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });

/**
 * Get all menu items
 *
 * @return {[items]}
 */
const GetAllOrders = async () => {
  const command = new ExecuteStatementCommand({
    Statement: `SELECT * FROM MealOrders
    WHERE BEGINS_WITH(PK, 'ORG#1#ORDER#');`,
  });

  const response = await client.send(command);
  return JSON.stringify(response.Items);
};

export async function GET(request: Request) {
  // Run the async function
  const rs: any = await GetAllOrders();
  return new Response(rs);
}
