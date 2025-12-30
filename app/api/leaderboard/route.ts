import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Trade from '@/lib/models/Trade';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Aggregate trade stats for all users
    const stats = await Trade.aggregate([
      {
        $group: {
          _id: '$userId',
          totalPnl: { $sum: '$pnl' },
          tradeCount: { $sum: 1 },
          winCount: {
            $sum: { $cond: [{ $gt: ['$pnl', 0] }, 1, 0] }
          },
        }
      },
      {
        $lookup: {
          from: 'users',
          let: { targetId: '$_id' },
          pipeline: [
            { 
              $match: { 
                $expr: { 
                  $eq: ['$_id', { $toObjectId: '$$targetId' }] 
                } 
              } 
            },
            { $project: { username: 1, name: 1, image: 1 } }
          ],
          as: 'userDetails'
        }
      },
      { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          userId: '$_id',
          totalPnl: 1,
          tradeCount: 1,
          winRate: {
            $multiply: [
              { $divide: ['$winCount', { $max: [1, '$tradeCount'] }] },
              100
            ]
          },
          alphaScore: {
            $multiply: [
              { $divide: ['$winCount', { $max: [1, '$tradeCount'] }] },
              {
                $multiply: [
                  '$totalPnl',
                  { $ln: { $add: ['$tradeCount', 1.718] } } 
                ]
              }
            ]
          },
          username: { $ifNull: ['$userDetails.username', 'anon'] },
          name: { $ifNull: ['$userDetails.name', 'Member'] },
          image: { $ifNull: ['$userDetails.image', ''] },
        }
      },
      { $sort: { alphaScore: -1 } },
      { $limit: 20 }
    ]);

    console.log(`Leaderboard generated: ${stats.length} traders synced. First handle: ${stats[0]?.username || 'null'}`);
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("Aggregation Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
