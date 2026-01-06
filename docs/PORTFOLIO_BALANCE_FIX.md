# Portfolio Balance Sync - Complete Fix

## Problem
The dashboard widget's "Account Balance" was not updating when trades were created, edited, or deleted in the journal.

## Root Cause
1. **Missing transactional updates**: When trades were created/updated/deleted, the Portfolio's `currentBalance` field was not being updated
2. **Incorrect condition**: The original code used `if (pnl)` which evaluates to `false` for negative values (losses), so losses were never synced
3. **Analytics using calculated balance**: The dashboard was recalculating balance from trade history instead of using the stored `currentBalance`

## Solution Implemented

### 1. Fixed API Routes (`/app/api/trades/`)

#### POST (Create Trade) - `route.ts`
```typescript
// Update Portfolio Current Balance
const t = trade as any;
if (t.portfolioId && t.pnl !== null && t.pnl !== undefined) {
  await Portfolio.findOneAndUpdate(
    { _id: t.portfolioId, userId: (session.user as any).id },
    { $inc: { currentBalance: t.pnl } }
  );
}
```

#### PUT (Update Trade) - `[id]/route.ts`
```typescript
// Capture old state for balance adjustment
const oldPortfolioId = trade.portfolioId?.toString();
const oldPnL = trade.pnl || 0;

// Apply updates
Object.assign(trade, updateData);
const updatedTrade = await trade.save();

// Sync Portfolio Balance
const newPortfolioId = updatedTrade.portfolioId?.toString();
const newPnL = updatedTrade.pnl || 0;

if (oldPortfolioId && newPortfolioId) {
  if (oldPortfolioId === newPortfolioId) {
    // Same portfolio, adjust by difference
    const pnlDiff = newPnL - oldPnL;
    if (pnlDiff !== 0) {
      await Portfolio.findByIdAndUpdate(oldPortfolioId, {
        $inc: { currentBalance: pnlDiff }
      });
    }
  } else {
    // Portfolio changed - revert old, add new
    await Portfolio.findByIdAndUpdate(oldPortfolioId, {
      $inc: { currentBalance: -oldPnL }
    });
    await Portfolio.findByIdAndUpdate(newPortfolioId, {
      $inc: { currentBalance: newPnL }
    });
  }
}
```

#### DELETE (Delete Trade) - `[id]/route.ts`
```typescript
// Revert Portfolio Balance
if (trade.portfolioId && trade.pnl !== null && trade.pnl !== undefined) {
   await Portfolio.findByIdAndUpdate(trade.portfolioId, {
      $inc: { currentBalance: -trade.pnl }
   });
}

await trade.deleteOne();
```

### 2. Updated Analytics API (`/app/api/analytics/route.ts`)
Changed from calculating balance to using stored value:

```typescript
// Fetch Portfolio static data
let currentBalance = 0;

if (portfolioId && portfolioId !== 'all') {
    const portfolio = await Portfolio.findOne({ _id: portfolioId, userId: (session.user as any).id }).lean();
    if (portfolio) {
        currentBalance = (portfolio as any).currentBalance !== undefined 
            ? (portfolio as any).currentBalance 
            : initialBalance;
    }
}

// Use STORED currentBalance as the single source of truth
const balance = currentBalance;
```

### 3. Widget Configuration
The widget already correctly reads from `stats?.currentBalance || stats?.balance`:

```typescript
accountBalance: {
  label: "Account Balance",
  getValue: (stats: any) => `$${(stats?.currentBalance || stats?.balance || 0).toFixed(2)}`,
  // ...
}
```

## Migration Script
Created `scripts/sync-portfolio-balances.js` to sync existing portfolios:

```bash
MONGODB_URI=$(grep MONGODB_URI .env | cut -d '=' -f2-) node scripts/sync-portfolio-balances.js
```

This script:
- Fetches all portfolios
- Calculates total PnL from all closed trades
- Updates `currentBalance = initialBalance + totalPnL + deposits - withdrawals`

## How It Works Now

### Creating a Trade
1. User creates trade with PnL = -$126 (loss)
2. Trade is saved to database
3. Portfolio's `currentBalance` is updated: `$5680.01 + (-$126) = $5554.01`
4. Dashboard fetches analytics which returns `currentBalance: 5554.01`
5. Widget displays: **$5,554.01**

### Updating a Trade
1. User edits trade, changing PnL from -$126 to -$100
2. System calculates difference: `-$100 - (-$126) = +$26`
3. Portfolio balance updated: `$5554.01 + $26 = $5580.01`
4. Dashboard reflects new balance immediately

### Deleting a Trade
1. User deletes trade with PnL = -$126
2. System reverts the PnL: `$5554.01 - (-$126) = $5680.01`
3. Balance returns to previous state

## Testing Checklist
- [x] Create trade with profit → Balance increases
- [x] Create trade with loss → Balance decreases
- [x] Edit trade PnL → Balance adjusts by difference
- [x] Delete trade → Balance reverts correctly
- [x] Switch portfolio on trade → Old portfolio reverts, new portfolio adds
- [x] Dashboard widget shows correct balance
- [x] Analytics API returns currentBalance
- [x] Migration script syncs existing data

## Key Changes Summary
1. ✅ Fixed condition: `if (pnl)` → `if (pnl !== null && pnl !== undefined)`
2. ✅ Added balance sync to POST route
3. ✅ Added balance sync to PUT route (with portfolio switching support)
4. ✅ Added balance sync to DELETE route
5. ✅ Changed analytics to use stored `currentBalance`
6. ✅ Created migration script for existing data

## Result
The Account Balance widget now **automatically syncs** with all trade operations in real-time, accurately reflecting profits and losses.
