import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { quotes } from './schema/quotes';
import { underwritingDetails } from './schema/underwritingDetails';
import { databaseConfig } from './databaseConfig';
import { policies } from './schema/policies';
import { users } from './schema/users';

const pool = new Pool(databaseConfig);

export const schema = {
    quotes,
    underwritingDetails, policies, users
};

export const dbClient = drizzle(pool, {
    schema,
});
