# Banner and Feature Flags Documentation

## Banner System

### How the Banner Works
The banner system fetches messages from the DynamoDB Banner table and displays them at the top of the Today tab. Banners are filtered by:
1. `isActive` must be true
2. Current date must be between `startDate` and `endDate`
3. Sorted by `priority` (lower number = higher priority)

### To Hide/Remove the Banner

#### Option 1: Update the Banner in DynamoDB (Recommended)
Edit `create-banner.json` and set `isActive` to false, then run:
```bash
aws dynamodb batch-write-item --request-items file://create-banner.json --profile prod
```

Example `create-banner.json` to disable banner:
```json
{
  "Banner-3ppdeqlkxzalbhfay3vvc5nqri-dev": [
    {
      "PutRequest": {
        "Item": {
          "id": {"S": "active"},
          "message": {"S": "Banner message here"},
          "isActive": {"BOOL": false},  // Set to false to hide
          "startDate": {"S": "2025-08-11"},
          "endDate": {"S": "2025-10-05"},
          // ... other fields
        }
      }
    }
  ]
}
```

#### Option 2: Change Date Range
Modify `startDate` or `endDate` in `create-banner.json` to be outside current date:
```json
"startDate": {"S": "2025-12-01"},  // Future date
"endDate": {"S": "2025-12-31"},
```

#### Option 3: Delete from DynamoDB
```bash
aws dynamodb delete-item \
  --table-name Banner-3ppdeqlkxzalbhfay3vvc5nqri-dev \
  --key '{"id": {"S": "active"}}' \
  --profile prod
```

## Feature Flag System

### How the Prototype Schedule Feature Flag Works
The feature flag in `src/config.ts` controls whether the "Today" tab shows prototype schedules during the specified date range.

### Current Configuration
File: `src/config.ts`
```typescript
export const config = {
  featureFlags: {
    usePrototypeSchedule: true,  // Enable/disable prototype schedule
    prototypeScheduleStartDate: new Date('2025-08-11'),
    prototypeScheduleEndDate: new Date('2025-10-05'),
  }
};
```

### To Disable Prototype Schedule in Today Tab
Edit `src/config.ts` and set `usePrototypeSchedule` to false:
```typescript
export const config = {
  featureFlags: {
    usePrototypeSchedule: false,  // Changed to false
    prototypeScheduleStartDate: new Date('2025-08-11'),
    prototypeScheduleEndDate: new Date('2025-10-05'),
  }
};
```

### How It Works
In `GetScheduleV2.tsx`, the `getSeasonAndDay` function checks:
1. Is `usePrototypeSchedule` true?
2. Is current date between start and end dates?
3. If both yes: returns `season: "prototype"`
4. If no: returns normal season ("summer" or "winter")

### Important Notes
- The Prototype tab always shows prototype schedules regardless of feature flag
- The feature flag only affects the Today tab
- When disabled, Today tab reverts to showing summer/winter schedules based on month
- Summer: April-September (months 4-9)
- Winter: October-March (months 10-3)

## Quick Commands

### Update Banner Message
```bash
# Edit create-banner.json with new message, then:
aws dynamodb batch-write-item --request-items file://create-banner.json --profile prod
```

### Check Current Banner
```bash
aws dynamodb get-item \
  --table-name Banner-3ppdeqlkxzalbhfay3vvc5nqri-dev \
  --key '{"id": {"S": "active"}}' \
  --profile prod
```

### List All Banners
```bash
aws dynamodb scan \
  --table-name Banner-3ppdeqlkxzalbhfay3vvc5nqri-dev \
  --profile prod
```