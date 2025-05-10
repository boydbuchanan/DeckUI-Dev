import { NextRequest } from 'next/server';
import mysql from 'mysql2/promise';
import { dbConfig } from '@server/db';
import { Log } from '@server/logger';

// Create a connection pool
const pool = mysql.createPool(dbConfig);

export async function GET(req: NextRequest) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  writer.write(
    new TextEncoder().encode(
      'Content-Type: text/event-stream\nCache-Control: no-cache\nConnection: keep-alive\n\n'
    )
  );

  try {
    // Periodically fetch logs and send them to the client
    const interval = setInterval(async () => {
      try {
        const query = `
          SELECT id, level, message, metadata, created_at
          FROM logs
          ORDER BY created_at DESC
          LIMIT 10
        `;
        const [logs] = await pool.query(query); // Use the connection pool to execute the query

        writer.write(
          new TextEncoder().encode(`data: ${JSON.stringify(logs)}\n\n`)
        );
      } catch (error) {
        const err = error as Error;
        const msg = `Error fetching logs: ${err.message}`;
        Log.error(msg); // Keep your logging function intact

        const log: Log = {
          id: 0,
          level: 'error',
          message: msg,
          metadata: {},
          created_at: new Date().toISOString(),
        };

        writer.write(
          new TextEncoder().encode(`data: ${JSON.stringify([log])}\n\n`)
        );
      }
    }, 3000); // Fetch logs every 3 seconds

    // Stop the interval and close the writer when the client disconnects
    req.signal.addEventListener('abort', () => {
      clearInterval(interval);
      writer.close();
    });
  } catch (error) {
    const err = error as Error;
    const msg = `Failed to stream logs: ${err.message}`;
    Log.error(msg); // Keep your logging function intact

    writer.write(
      new TextEncoder().encode(
        `data: ${JSON.stringify({ error: 'Failed to stream logs' })}\n\n`
      )
    );
    writer.close();
  }

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}