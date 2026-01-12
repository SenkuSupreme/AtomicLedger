1️⃣ ORB Core Definition Engine
Opening Range Configuration (per symbol)

ORB session:

NY Open

London Open

Asia Open

ORB duration:

5 min

15 min

30 min

Session timezone (NY time)

ORB Levels

Opening Range High (ORH)

Opening Range Low (ORL)

Opening Range Midpoint

ORB range size (pips / % / ATR multiple)

2️⃣ Multi-Timeframe Context Filters (Mandatory)
Higher Timeframe Bias (15M / 4H)

Market structure direction

HTF liquidity target

Premium / Discount zone

Trend vs Range state

Daily Context

PDH / PDL location

Previous session range

Daily open price

True Day Range position

3️⃣ ORB Breakout Validation Logic
Breakout Conditions

Candle close above ORH / below ORL

Body > wick (impulsive)

Volume expansion vs ORB average

Breakout during valid session window

False Breakout Filter

Immediate rejection

No displacement

Wick-only breakout

Breakout against HTF bias

4️⃣ ORB Retest (High-Probability Mode)
Retest Rules

Price breaks ORH/ORL

Pulls back to OR level

Holds above/below

Entry on confirmation candle

Dashboard Data

Retest depth

Retest candle type

Failure probability

5️⃣ Liquidity-Aware ORB (Institutional Upgrade)
Liquidity Context

ORH / ORL aligned with:

Asia high/low

PDH / PDL

Equal highs/lows

Liquidity sweep before breakout

Breakout toward liquidity

6️⃣ ORB Models (Most Used Variants)
🔹 Model 1: Classic ORB

Rules

Break and close above ORH / below ORL

Enter on breakout or retest

Target session range expansion

Data

Entry

SL below ORH / above ORL

TP = OR range × 1.5–3

🔹 Model 2: ORB + Retest (Preferred)

Rules

Clean breakout

Pullback to ORH/ORL

Confirmation candle

Higher RR, lower win-rate

🔹 Model 3: Fakeout ORB (Reversal)

Rules

Break ORH/ORL

Immediate rejection

Close back inside range

Enter opposite side

Targets

Opposite OR level

Session VWAP

🔹 Model 4: Trend-Aligned ORB

Rules

HTF trend matches breakout

Premium/Discount respected

Volume expansion

🔹 Model 5: News-Driven ORB

Rules

High-impact news

Expanded OR range

Breakout continuation

7️⃣ Session & Time Filters
Valid ORB Trading Windows

First 90 minutes after session open

Avoid lunch hours

Kill zone alignment (London / NY)

8️⃣ Auto Entry / SL / TP Engine
Entry Types

Market entry on breakout

Limit entry on retest

Stop Loss Logic

Below ORH / above ORL

ATR-buffered stop

Structure invalidation stop

Target Logic

OR range projection

PDH / PDL

Session high/low

Liquidity pool

9️⃣ Risk & Trade Management
Risk Controls

Max ORB trades per session

Minimum OR range (volatility filter)

Spread filter (scalping safe)

Position Sizing

Fixed % risk

Dynamic ATR sizing

Max drawdown lock

🔟 ORB Confidence Score (AI-Based)
Inputs

HTF bias alignment

Liquidity confluence

Volume expansion

Time-of-day probability

Historical ORB win-rate (symbol-specific)

1️⃣1️⃣ Visualization Components
Chart Layers

OR box

Breakout arrows

Retest highlights

SL / TP zones

Tables

ORB setups list

Active breakouts

Failed ORBs (learning data)

1️⃣2️⃣ AI Explanation Panel

For every ORB trade:

Which ORB model triggered

Why breakout is valid

What invalidates the trade

Expected session behavior

1️⃣3️⃣ ORB Symbol Intelligence

Average OR range size

Best OR duration (5m vs 15m)

Best session per symbol

False breakout frequency

🔥 Pro Tip (Important)

Most ORB systems fail because they:
❌ Ignore HTF bias
❌ Trade tiny ranges
❌ Don’t filter fakeouts

Your dashboard solves all three.
---
### 🛠️ Forensic Matrix Conditions
- **Range Definition**: Statistical confirmation of the opening session boundaries.
- **Momentum Expansion**: High-energy breakouts confirmed by acceleration.
- **ORH/ORL Breakthrough**: Clean breach and acceptance outside the opening range.
- **Volume Avg Expansion**: Relative volume metrics exceeding baseline benchmarks.
- **Session Dominance**: Confirmation of primary trend direction for the active window.
