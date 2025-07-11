/**
 * Payload for capturing analytics events
 */
export interface CapturePayload {
  /** The API key for authentication (optional if provided in client options) */
  api_key?: string;
  
  /** The event name (required for single event capture) */
  event?: string;
  
  /** Event properties as key-value pairs */
  properties?: Record<string, any>;
  
  /** Unique identifier for the user/session */
  distinct_id?: string;
  
  /** ISO 8601 timestamp of the event */
  timestamp?: string;
  
  /** Array of events for batch processing */
  batch?: RawEvent[];
}

/**
 * Represents a single analytics event
 */
export interface RawEvent {
  /** The name of the event */
  event: string;
  
  /** Custom properties associated with the event */
  properties?: Record<string, any>;
  
  /** Unique identifier for the user/session */
  distinct_id?: string;
  
  /** ISO 8601 timestamp of the event */
  timestamp?: string;
}
