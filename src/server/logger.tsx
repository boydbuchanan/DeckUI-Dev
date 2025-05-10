import mysql from 'promise-mysql';
import { dbConfig } from './db';

export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}
export interface Log {
  id: number; // Unique identifier for the log entry
  level: 'info' | 'warn' | 'error'; // Log level
  message: string; // Log message
  metadata: Record<string, any>; // Additional metadata (stored as JSON)
  created_at: string; // Timestamp of when the log was created
}
export async function info(message: string, metadata?: Record<string, any>) {
  return await logToDatabase(LogLevel.INFO, message, metadata);
}
export async function warn(message: string, metadata?: Record<string, any>) {
  return await logToDatabase(LogLevel.WARN, message, metadata);
}
export async function error(message: string, metadata?: Record<string, any>) {
  return await logToDatabase(LogLevel.ERROR, message, metadata);
}
export async function logToDatabase(level: LogLevel, message: string, metadata?: Record<string, any>) {
  let connection: mysql.Connection | null = null;
  console.log(`[${level.toUpperCase()}] ${message}`, metadata);

  try {
    // Create a connection pool
    connection = await mysql.createConnection(dbConfig);

    const query = `
      INSERT INTO logs (level, message, metadata)
      VALUES (?, ?, ?)
    `;
    const metadataJson = metadata && JSON.stringify(metadata);

    // Execute the query
    await connection.query(query, [level, message, metadataJson]);
    console.log(`[${level.toUpperCase()}] ${message}`);
  } catch (error) {
    console.error('Failed to log to database:', error);
  } finally {
    if (connection) {
      await connection.end(); // Close the connection
    }
  }
}


export const Log = {
    info: info,
    warn: warn,
    error: error,
};