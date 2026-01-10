1️⃣ Core Market Data (from Twelve Data / derived)
Price & Candle Data (per timeframe: 4H / 15M / 5M / 1M)

Open

High

Low

Close

Candle body size

Wick size (upper / lower)

Candle type (bullish / bearish / doji)

Range (high–low)

Volatility (ATR-based)

2️⃣ Market Structure (SMC Core)
Structure Identification

Swing Highs

Swing Lows

Higher High (HH)

Higher Low (HL)

Lower High (LH)

Lower Low (LL)

Structure direction per timeframe:

Bullish

Bearish

Ranging

Break of Structure (BOS)

BOS candle index

BOS direction

BOS strength (impulsive / weak)

BOS confirmation timeframe

Change of Character (CHOCH)

CHOCH level

CHOCH candle

CHOCH direction

Higher TF vs Lower TF alignment

3️⃣ Liquidity Concepts (Critical for Scalping)
Liquidity Pools

Equal Highs (EQH)

Equal Lows (EQL)

Internal liquidity

External liquidity

Relative equal highs/lows

Range highs/lows

Stop Hunts

Sweep type (high / low)

Single sweep / multiple sweep

Sweep confirmation candle

Sweep rejection strength

4️⃣ Order Blocks (Institutional Footprint)
Order Block Detection

Bullish Order Block

Bearish Order Block

Timeframe of OB

OB range (high / low)

OB freshness (untapped / tapped / mitigated)

OB validity score

Entry Logic

OB reaction candle

OB mitigation candle

Discount / Premium zone position

5️⃣ Fair Value Gaps (FVG / Imbalance)
FVG Detection

Bullish FVG

Bearish FVG

FVG range

Partial fill / full fill

Clean / messy FVG

HTF FVG vs LTF FVG

6️⃣ Premium & Discount Zones
Equilibrium Framework

Range high

Range low

50% equilibrium

Discount zone (0–50%)

Premium zone (50–100%)

Trade Bias

Longs only in discount

Shorts only in premium

HTF bias override

7️⃣ Multi-Timeframe Alignment Engine
Bias Table (Very Important)
Timeframe	Structure	Bias	Liquidity Target
4H	Bullish / Bearish	Buy / Sell	External
15M	Alignment	Continuation / Reversal	Internal
5M	Entry Confirmation	Entry Ready / Wait	Sweep
1M	Execution	Execute / Abort	Micro OB
8️⃣ Kill Zones & Sessions
Session Tracking

Asian range high / low

London open

London manipulation window

NY open

NY expansion window

Kill Zones

London Kill Zone

NY Kill Zone

Session high/low sweep tracking

9️⃣ Indicators (Minimal but Institutional)
Smart Indicators

ATR (volatility filter)

Volume (relative volume only)

VWAP (session-based)

RSI (divergence only)

EMA 20 / 50 (trend context only)

⚠️ Indicators should confirm, not generate signals.

🔟 AI Trade Engine (Auto Entry / SL / TP)
Entry Conditions (AI Scored)

HTF bias alignment ✔️

Liquidity sweep ✔️

OB / FVG confluence ✔️

Session timing ✔️

Volatility acceptable ✔️

Entry Data

Entry price

Order type (Market / Limit)

Execution timeframe (1M / 5M)

Stop Loss Logic

Below OB low (long)

Above OB high (short)

ATR-adjusted buffer

Invalidated structure level

Target Logic

Internal liquidity (TP1)

External liquidity (TP2)

HTF liquidity pool (TP3)

Session high/low

Risk Management

Risk %

Position size

RR (minimum 1:2 enforced)

Trade invalidation rules

1️⃣1️⃣ Trade Probability & Confidence Score
Confidence Engine (0–100%)

Structure alignment score

Liquidity clarity score

Timeframe alignment score

Session probability score

Historical win-rate (symbol + timeframe)

1️⃣2️⃣ Symbol Intelligence Panel
Symbol Profile

Average daily range

Best session for movement

Typical manipulation time

Spread behavior (scalping filter)

News sensitivity

1️⃣3️⃣ News & Macro Filters (Important)
Economic Impact

High-impact news flag

Currency strength correlation

Metals vs USD correlation

Risk-on / risk-off state

1️⃣4️⃣ Visualization UI Sections
Chart Layers

Structure lines

OB zones

FVG boxes

Liquidity levels

Session boxes

Entry / SL / TP overlays

Tables

Bias table

Trade setup list

Active trades

HTF vs LTF conflict warnings

1️⃣5️⃣ AI Explanation Panel (Huge Value)

For every signal, show:

Why entry is valid

What liquidity is being targeted

What invalidates the trade

Which timeframe is in control