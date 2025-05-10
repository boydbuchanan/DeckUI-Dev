// create interface for account onboard
export interface AccountOnboardResponse {
  stripeConnectedAccountId: string;
  stripeAccountLink: string;
}
export interface Log {
  id: number; // Unique identifier for the log entry
  level: 'info' | 'warn' | 'error'; // Log level
  message: string; // Log message
  metadata: Record<string, any>; // Additional metadata (stored as JSON)
  created_at: string; // Timestamp of when the log was created
}