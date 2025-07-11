# Eye Metric Node.js SDK

[![npm version](https://img.shields.io/npm/v/eye-metric-sdk)](https://www.npmjs.com/package/eye-metric-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight TypeScript SDK for sending analytics events to the Eye Metric service.

## Installation

```bash
# Using npm
npm install eye-metric-sdk

# Using yarn
yarn add eye-metric-sdk

# Using bun
bun add eye-metric-sdk
```

## Usage

### Basic Setup

```typescript
import { AnalyticsClient } from 'eye-metric-sdk';

// Initialize the client
const client = new AnalyticsClient({
  apiKey: 'your-api-key', // Optional if provided via environment variables
  endpoint: 'https://your-endpoint.com', // Your Eye Metric API endpoint
  distinctId: 'user-123' // Optional: Will be auto-generated if not provided
});
```

### Sending Events

#### Single Event

```typescript
// Track a single event
await client.capture('user_signed_up', {
  plan: 'pro',
  source: 'organic'
});
```

#### Batch Events

```typescript
// Track multiple events in a single request
await client.captureBatch([
  {
    event: 'page_view',
    properties: { page: 'home' },
    distinct_id: 'user-123', // Optional: Will use client's distinctId if not provided
    timestamp: new Date().toISOString() // Optional: Will be auto-generated if not provided
  },
  {
    event: 'button_click',
    properties: { button: 'signup' }
  }
]);
```

## API Reference

### `AnalyticsClient`

#### Constructor

```typescript
new AnalyticsClient(options: {
  apiKey?: string;     // Your Eye Metric API key (optional if set via environment variables)
  endpoint: string;    // Your Eye Metric API endpoint
  distinctId?: string; // Optional distinct ID (auto-generated if not provided)
})
```

#### Methods

##### `capture(event: string, properties?: Record<string, any>): Promise<void>`

Tracks a single event with optional properties.

##### `captureBatch(events: RawEvent[]): Promise<void>`

Tracks multiple events in a single request.

## TypeScript Support

This package includes TypeScript type definitions. You can import the types like this:

```typescript
import type { CapturePayload, RawEvent } from 'eye-metric-sdk';
```

## License

MIT
