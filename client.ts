import type { CapturePayload, RawEvent } from "./types.ts";
import { nowIsoTimestamp, generateUUID } from "./utils.ts";

/**
 * Options for initializing the AnalyticsClient
 */
export interface AnalyticsClientOptions {
  /** Your Eye Metric API key (can also be set via EYE_METRIC_API_KEY environment variable) */
  apiKey?: string;
  /** The base URL of your Eye Metric API endpoint */
  endpoint: string;
  /** Unique identifier for the current user/session (auto-generated if not provided) */
  distinctId?: string;
}

/**
 * Client for sending analytics events to the Eye Metric service
 */
export class AnalyticsClient {
  private apiKey?: string;
  private endpoint: string;
  private distinctId: string;

  /**
   * Creates a new AnalyticsClient instance
   * @param {AnalyticsClientOptions} opts - Configuration options for the client
   */
  constructor(opts: AnalyticsClientOptions) {
    if (!opts.endpoint) {
      throw new Error("endpoint is required");
    }

    this.apiKey = opts.apiKey || process.env.EYE_METRIC_API_KEY;
    this.endpoint = opts.endpoint.replace(/\/+$/, ""); // Remove trailing slashes
    this.distinctId = opts.distinctId || generateUUID();
  }

  /**
   * Tracks a single event with optional properties
   * @param {string} event - The name of the event to track
   * @param {Record<string, any>} [properties={}] - Additional properties to include with the event
   * @returns {Promise<void>} Resolves when the event has been sent
   * @throws {Error} If the event cannot be sent
   * @example
   * await client.capture('user_signed_up', { plan: 'pro' });
   */
  async capture(
    event: string,
    properties: Record<string, any> = {}
  ): Promise<void> {
    if (!event) {
      throw new Error("Event name is required");
    }

    const payload: CapturePayload = {
      api_key: this.apiKey,
      event,
      properties,
      distinct_id: this.distinctId,
      timestamp: nowIsoTimestamp(),
    };

    await this.send(payload);
  }

  /**
   * Tracks multiple events in a single batch request
   * @param {RawEvent[]} events - Array of events to track
   * @returns {Promise<void>} Resolves when all events have been sent
   * @throws {Error} If the events cannot be sent
   * @example
   * await client.captureBatch([
   *   { event: 'page_view', properties: { page: 'home' } },
   *   { event: 'button_click', properties: { button: 'signup' } }
   * ]);
   */
  async captureBatch(events: RawEvent[]): Promise<void> {
    if (!Array.isArray(events)) {
      throw new Error("Events must be an array");
    }
    if (events.length === 0) {
      return; // No-op for empty arrays
    }

    const payload: CapturePayload = {
      api_key: this.apiKey,
      batch: events.map((e) => ({
        ...e,
        distinct_id: e.distinct_id || this.distinctId,
        timestamp: e.timestamp || nowIsoTimestamp(),
      })),
    };

    await this.send(payload);
  }

  /**
   * Internal method to send the payload to the Eye Metric API
   * @private
   */
  private async send(payload: CapturePayload): Promise<void> {
    if (!this.apiKey) {
      console.warn(
        "No API key provided. Set EYE_METRIC_API_KEY environment variable or pass apiKey in options."
      );
    }

    try {
      const res = await fetch(`${this.endpoint}/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMessage = "";
        try {
          const errorData = await res.json();
          if (
            errorData &&
            typeof errorData === "object" &&
            "message" in errorData
          ) {
            errorMessage = String(errorData.message);
          }
        } catch {
          // Ignore JSON parsing errors
        }
        throw new Error(
          `Failed to send analytics: ${res.status} ${res.statusText}` +
            (errorMessage ? `. ${errorMessage}` : "")
        );
      }
    } catch (error) {
      console.error("Error sending analytics:", error);
      throw error; // Re-throw to allow for custom error handling
    }
  }

  /**
   * Returns the distinct ID for the current user/session
   * @returns {string} The distinct ID
   */
  getDistinctId() {
    return this.distinctId;
  }
}
