1️⃣ ICT Core Framework (Foundation Layer)

These apply to ALL ICT models and must be global data layers.

Dealing Range Engine

Previous Day High (PDH)

Previous Day Low (PDL)

Previous Week High (PWH)

Previous Week Low (PWL)

Previous Month High/Low

Midnight Open (00:00 NY time)

Session Open Prices (Asia / London / NY)

True Day Range

Range expansion state

2️⃣ Time-Based Market Logic (Critical for ICT)
Session Model Tracking

Asian Range High / Low

London Open Manipulation

NY Open Expansion

Lunch Consolidation

Power Hour (PM session)

Kill Zones (Auto Highlight)

London Kill Zone: 2:00–5:00 NY

NY Kill Zone: 7:00–10:00 NY

Silver Bullet Window:

London: 3:00–4:00 NY

NY: 10:00–11:00 NY

3️⃣ ICT Dealing Range & Premium/Discount Logic
Premium / Discount Engine

0% (Range Low)

50% Equilibrium

100% (Range High)

Discount Zone (0–50%)

Premium Zone (50–100%)

Trade Rules

Longs only in Discount

Shorts only in Premium

HTF dealing range override

4️⃣ ICT Market Structure (Refined SMC)
Structure Events

Break in Market Structure (BMS)

Market Structure Shift (MSS)

Displacement candles

Impulse leg detection

Structure Context

Internal structure

External structure

Dealing range context

5️⃣ Liquidity Engineering (ICT Style)
Liquidity Types

Buy-side liquidity (BSL)

Sell-side liquidity (SSL)

Equal highs / equal lows

Relative equal highs/lows

Trendline liquidity

Session highs/lows

Liquidity Delivery Logic

Draw on liquidity

Raid → displacement → expansion

Failed raids (no follow-through)

6️⃣ ICT Order Blocks (Strict Definition)
OB Classification

Bullish OB (last down candle before displacement)

Bearish OB (last up candle before displacement)

Volume imbalance candle

OB time validity (same session / next session)

OB mitigation status

7️⃣ Fair Value Gaps (ICT Version)
FVG Rules

3-candle displacement FVG

Consequent Encroachment (50%)

Clean vs dirty FVG

In-session vs out-of-session FVG

HTF → LTF FVG alignment

8️⃣ ICT Entry Models (THIS IS THE CORE)
🔹 Model 1: Silver Bullet Model
Time Window

London: 3–4 NY

NY: 10–11 NY

Required Conditions

Prior liquidity taken (BSL or SSL)

Displacement candle

FVG formed during Silver Bullet window

Entry at FVG 50%

Target opposing liquidity

Dashboard Data

Silver Bullet active flag

Entry price

SL below displacement low/high

TP liquidity pool

Model confidence %

🔹 Model 2: Power of Three (PO3)
Phase Detection

Accumulation (Asia)

Manipulation (London)

Distribution (NY)

Data to Show

Accumulation range

Manipulation sweep direction

Distribution bias

Expansion projection

🔹 Model 3: Judas Swing
Logic

Early London false move

Sweep of Asia high/low

Reversal into NY direction

Dashboard Elements

Judas swing detected

Asia high/low raid

Reversal candle

HTF bias alignment

🔹 Model 4: AMD (Accumulation–Manipulation–Distribution)
Key Data

Range formation

Manipulation candle

Distribution expansion

Range measured move target

🔹 Model 5: Turtle Soup (ICT Version)
Conditions

Break of PDH/PDL

Immediate failure

Reversal entry

Target opposing range

🔹 Model 6: Reversal / Continuation FVG Model
Reversal

Liquidity raid

Displacement

HTF FVG tap

Continuation

Shallow pullback

In-trend FVG

Internal liquidity target

9️⃣ Multi-Timeframe ICT Bias Matrix
TF	Purpose	Data
4H	Narrative	Draw on liquidity
15M	Structure	MSS / BMS
5M	Setup	FVG / OB
1M	Execution	Entry precision
🔟 Auto Entry / SL / TP Logic (ICT Rules)
Entry Logic

Entry only inside:

Kill Zone

Premium/Discount

After liquidity raid

Stop Loss

Below displacement candle

Beyond OB

Structural invalidation

Targets

Session high/low

PDH/PDL

Opposing liquidity

HTF dealing range extreme

1️⃣1️⃣ AI Confidence & Model Score
Scoring Inputs

Time window validity

Liquidity clarity

Displacement strength

HTF bias alignment

Model historical performance

1️⃣2️⃣ AI Narrative Engine (Massive Edge)

For every trade:

Which ICT model is active

What liquidity was taken

Why price must move now

What invalidates the idea

Which session controls price

1️⃣3️⃣ Visual Components (Non-Negotiable)
Chart Overlays

Kill zone boxes

FVG shading

OB zones

Liquidity levels

Entry/SL/TP lines

Alerts

“Silver Bullet Active”

“Liquidity Raid Detected”

“Displacement Confirmed”

“Entry Window Open”

1️⃣4️⃣ Symbol-Specific ICT Stats

Best model per symbol

Win-rate per model

Average Silver Bullet RR

Session volatility profile

1️⃣5️⃣ Advanced (Optional but Insane)

AI session narrative (“London trapped buyers”)

Model conflict detection

Kill zone probability heatmap

Auto backtest per model