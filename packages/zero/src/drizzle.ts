// Assuming your Drizzle schema is exported from @acme/db
import type { DBConnection, DBTransaction, Row } from "@rocicorp/zero/pg";
import type { QueryResultRow } from "pg";

import type { Drizzle } from "@repo/database/client";

// My Drizzle instance type, assuming $client is the raw pg.PoolClient, matches how
// `drizzle()` inits when using `node-postgres`

// Extract the Drizzle-specific transaction type
export type DrizzleTransaction = Parameters<
  Parameters<Drizzle["transaction"]>[0]
>[0];

export class DrizzleConnection implements DBConnection<DrizzleTransaction> {
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
