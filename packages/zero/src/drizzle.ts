/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-return */

// Assuming $client is the raw pg.PoolClient, this type matches how
// `drizzle()` inits when using `node-postgres`
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import type { schema } from "./schema";

type Drizzle = NodePgDatabase<typeof schema> & { $client: PoolClient };

// Extract the Drizzle-specific transaction type
type DrizzleTransaction = Parameters<Parameters<Drizzle["transaction"]>[0]>[0];

class DrizzleConnection implements DBConnection<DrizzleTransaction> {
  drizzle: Drizzle;

  constructor(drizzle: Drizzle) {
    this.drizzle = drizzle;
  }

  // `query` is used by Zero's ZQLDatabase for ZQL reads on the server
  query(sql: string, params: unknown[]): Promise<Row[]> {
    return this.drizzle.$client
      .query<QueryResultRow>(sql, params)
      .then(({ rows }) => rows);
  }

  // `transaction` wraps Drizzle's transaction
  transaction<T>(
    fn: (tx: DBTransaction<DrizzleTransaction>) => Promise<T>,
  ): Promise<T> {
    return this.drizzle.transaction((drizzleTx) =>
      // Pass a new Zero DBTransaction wrapper around Drizzle's one
      fn(new ZeroDrizzleTransaction(drizzleTx)),
    );
  }
}

class ZeroDrizzleTransaction implements DBTransaction<DrizzleTransaction> {
  readonly wrappedTransaction: DrizzleTransaction;

  constructor(drizzleTx: DrizzleTransaction) {
    this.wrappedTransaction = drizzleTx;
  }

  // This `query` method would be used if ZQL reads happen *within*
  // a custom mutator that is itself running inside this wrapped transaction.
  query(sql: string, params: unknown[]): Promise<Row[]> {
    // Drizzle's transaction object might hide the raw client,
    // this is one way to get at it for `pg` driver. Adjust if needed.
    const session = this.wrappedTransaction._.session as unknown as {
      client: Drizzle["$client"];
    };
    return session.client
      .query<QueryResultRow>(sql, params)
      .then(({ rows }) => rows);
  }
}
