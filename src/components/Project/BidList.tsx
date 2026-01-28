import React from 'react'
import { Star, Zap, ThumbsUp, ThumbsDown, Users } from 'lucide-react'
import { Bid } from '../../types'

interface BidListProps {
  bids: Bid[] | undefined
  currency: string
  onAccept: (bid: Bid) => Promise<void>
  onReject?: (bid: Bid) => void
}

export const BidList: React.FC<BidListProps> = ({ bids, currency, onAccept, onReject }) => {
  if (!bids || bids.length === 0) {
    return (
      <div className='text-center py-12 bg-white rounded-xl border border-dashed border-gray-300'>
        <div className='w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4'>
          <Users className='w-8 h-8 text-gray-400' />
        </div>
        <p className='text-gray-900 text-lg font-medium'>暂无竞标</p>
        <p className='text-gray-500 text-sm mt-1'>当有开发者提交方案时将显示在这里</p>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-bold text-gray-900'>收到的竞标 ({bids.length})</h3>
      </div>

      <div className='space-y-4'>
        {bids.map((bid) => (
          <div
            key={bid.id}
            className='bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all'>
            <div className='flex flex-col lg:flex-row justify-between gap-6'>
              {/* Bidder Info */}
              <div className='flex items-start space-x-4 flex-1'>
                <img
                  src={bid.developerAvatar}
                  alt={bid.developerName}
                  className='w-12 h-12 rounded-full border border-gray-100'
                />
                <div className='flex-1'>
                  <div className='flex items-center justify-between'>
                    <h4 className='text-base font-bold text-gray-900 flex items-center'>
                      {bid.developerName}
                      <span className='ml-2 flex items-center text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full border border-yellow-200'>
                        <Star className='w-3 h-3 mr-1 fill-current' />
                        {bid.developerRating}
                      </span>
                    </h4>
                    <span className='text-xs text-gray-400'>提交于 {new Date(bid.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className='mt-3 p-4 bg-gray-50 rounded-lg border border-gray-100'>
                    <p className='text-gray-600 text-sm whitespace-pre-line leading-relaxed'>{bid.proposal}</p>
                  </div>
                </div>
              </div>

              {/* Terms & Actions */}
              <div className='flex flex-col gap-4 min-w-[240px]'>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='bg-gray-50 p-3 rounded-lg text-center border border-gray-100'>
                    <p className='text-xs text-gray-500 mb-1'>报价金额</p>
                    <p className='text-lg font-bold text-gray-900'>
                      {currency} {bid.proposedPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className='bg-gray-50 p-3 rounded-lg text-center border border-gray-100'>
                    <p className='text-xs text-gray-500 mb-1'>预计工期</p>
                    <p className='text-lg font-bold text-indigo-600'>{bid.deliveryDays} 天</p>
                  </div>
                </div>

                {/* AI Analysis of Bid */}
                <div className='flex items-center justify-between px-3 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100'>
                  <div className='flex items-center space-x-2'>
                    <Zap className='w-4 h-4 text-purple-600' />
                    <span className='text-xs font-medium text-purple-700'>AI 竞争力评分</span>
                  </div>
                  <span className='text-sm font-bold text-purple-700'>92/100</span>
                </div>

                <div className='flex gap-2 mt-2'>
                  {bid.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onAccept(bid)}
                        className='flex-1 py-2 bg-gray-900 hover:bg-black text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center shadow-sm'>
                        <ThumbsUp className='w-4 h-4 mr-1.5' />
                        接受方案
                      </button>
                      <button
                        onClick={() => onReject && onReject(bid)}
                        className='px-3 py-2 border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-lg transition-colors'>
                        <ThumbsDown className='w-4 h-4' />
                      </button>
                    </>
                  )}
                  {bid.status === 'accepted' && (
                    <div className='flex-1 py-2 bg-green-50 text-green-700 text-center rounded-lg text-sm font-medium border border-green-200 flex items-center justify-center'>
                      <ThumbsUp className='w-4 h-4 mr-1.5' />
                      已接受此方案
                    </div>
                  )}
                  {bid.status === 'rejected' && (
                    <div className='flex-1 py-2 bg-red-50 text-red-600 text-center rounded-lg text-sm font-medium border border-red-200'>
                      已拒绝
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
