import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fetchMultiTimeframeData, analyzeMarketMultiTimeframe } from '@/lib/analysis_engine';
import dbConnect from '@/lib/db';
import Forecast from '@/lib/models/Forecast';

// GET: Retrieve saved forecast from Database
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return new NextResponse('Missing symbol', { status: 400 });
    }

    await dbConnect();
    
    // @ts-ignore
    const existingForecast = await Forecast.findOne({ symbol: symbol.toUpperCase() });

    if (!existingForecast) {
        return NextResponse.json(null); 
    }

    return NextResponse.json(existingForecast.analysis);

  } catch (error) {
    console.error('[FORECAST_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// POST: Trigger new multi-timeframe analysis (4H, 15M, 5M, 1M)
export async function POST(req: Request) {
    try {
      const session = await getServerSession(authOptions);
      if (!session || !session.user) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
  
      const { symbol } = await req.json();
  
      if (!symbol) {
        return new NextResponse('Missing symbol', { status: 400 });
      }
  
      // 1. Fetch multi-timeframe market data (4H via 60min aggregation, 15M, 5M, 1M)
      // Note: This will make 4 API calls with delays to respect rate limits
      const tfData = await fetchMultiTimeframeData(symbol);
      
      const hasData = Object.values(tfData).some(candles => candles.length > 0);

      if (!hasData) {
          console.error(`[FORECAST_POST] No data fetched for ${symbol}. All TwelveData keys exhausted.`);
          return new NextResponse('All Twelve Data API keys are currently rate-limited. Please wait a moment and try again.', { status: 503 });
      }

      // 2. Perform Multi-Timeframe SMC Analysis
      const analysis = analyzeMarketMultiTimeframe(symbol.toUpperCase(), tfData);

      await dbConnect();

      // 3. Save to DB (Upsert: Update if exists, Insert if new)
      // @ts-ignore
      await Forecast.findOneAndUpdate(
          { symbol: symbol.toUpperCase() },
          { 
              symbol: symbol.toUpperCase(),
              analysis: analysis,
              updatedAt: new Date()
          },
          { upsert: true, new: true }
      );
  
      return NextResponse.json(analysis);
  
    } catch (error) {
      console.error('[FORECAST_POST]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
}
