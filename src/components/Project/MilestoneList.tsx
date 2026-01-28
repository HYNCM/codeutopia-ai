import React from 'react';
import { Calendar, DollarSign, FileText, Upload, Clock, AlertTriangle } from 'lucide-react';
import { MilestoneSubmission } from '../../types';

// Extended status to support all view states
type ViewMilestoneStatus = 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected' | 'completed' | 'paid' | 'review' | 'disputed';

interface ViewMilestone {
  id: string;
  title: string;
  description: string;
  status: ViewMilestoneStatus;
  progress: number;
  startDate: string;
  dueDate: string;
  budget: number;
  currency: string;
  deliverables: { id: string; name: string }[];
  submission?: MilestoneSubmission;
}

interface MilestoneListProps {
  milestones: ViewMilestone[];
  isOwner: boolean;
  isContractor: boolean;
  selectedMilestoneId: string | null;
  onSelectMilestone: (id: string | null) => void;
  onOpenSubmit: (milestone: { id: string; title: string }) => void;
  onOpenReview: (milestone: { id: string; title: string; amount: number; submission: MilestoneSubmission }) => void;
}

export const MilestoneList: React.FC<MilestoneListProps> = ({
  milestones,
  isOwner,
  isContractor,
  selectedMilestoneId,
  onSelectMilestone,
  onOpenSubmit,
  onOpenReview,
}) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-gray-100 text-gray-700',
      in_progress: 'bg-blue-100 text-blue-700',
      submitted: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      paid: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      completed: 'bg-green-100 text-green-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-bold text-gray-900'>里程碑详情 ({milestones.length})</h3>
      </div>

      {/* Timeline */}
      <div className='bg-white rounded-xl p-6 border border-gray-200'>
        <div className='space-y-6'>
          {milestones.map((milestone) => (
            <div key={milestone.id} className='relative pl-6 border-l-2 border-gray-200'>
              <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-white ${
                 ['completed', 'approved', 'paid'].includes(milestone.status) ? 'border-green-500 bg-green-500' : 
                 milestone.status === 'in_progress' ? 'border-blue-500' : 'border-gray-300'
              }`}></div>

              <div
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedMilestoneId === milestone.id
                    ? 'bg-purple-50 border-purple-200 shadow-sm' // Selected
                    : 'bg-white border-transparent hover:bg-gray-50' // Unselected
                }`}
                onClick={() => onSelectMilestone(milestone.id === selectedMilestoneId ? null : milestone.id)}>
                <div className='flex justify-between items-start mb-2'>
                  <div>
                    <h4 className='font-medium text-gray-900'>{milestone.title}</h4>
                    <p className='text-sm text-gray-500 mt-1'>{milestone.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(milestone.status)}`}>
                    {milestone.status}
                  </span>
                </div>

                <div className='flex items-center space-x-4 text-sm text-gray-500 mt-3'>
                  <span className='flex items-center'>
                    <Calendar className='w-3 h-3 mr-1' />
                    {milestone.dueDate}
                  </span>
                  <span className='flex items-center'>
                    <DollarSign className='w-3 h-3 mr-1' />
                    {milestone.currency} {milestone.budget.toLocaleString()}
                  </span>
                </div>

                {/* Deliverables Preview - Expanded View */}
                {selectedMilestoneId === milestone.id && (
                  <div className='mt-4 pt-4 border-t border-gray-200'>
                    <h5 className='text-sm font-medium text-gray-700 mb-2'>交付物清单:</h5>
                    <ul className='space-y-2'>
                      {milestone.deliverables.map((d) => (
                        <li key={d.id} className='flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg'>
                          <FileText className='w-3 h-3 mr-2 text-gray-400' />
                          {d.name}
                        </li>
                      ))}
                    </ul>

                    {/* Contractor Action: Submit */}
                    {isContractor && ['pending', 'in_progress', 'rejected'].includes(milestone.status) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSubmit({ id: milestone.id, title: milestone.title });
                        }}
                        className='mt-4 w-full py-2 bg-gray-900 hover:bg-black text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center shadow-sm'>
                        <Upload className='w-4 h-4 mr-2' />
                        提交交付物
                      </button>
                    )}

                    {/* Owner Action: Review */}
                    {milestone.status === 'submitted' && (
                      <div className='mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
                        <div className='flex justify-between items-start'>
                          <p className='text-sm text-yellow-800 font-medium flex items-center'>
                            <Clock className='w-4 h-4 mr-2' />
                            已提交，等待審核
                          </p>
                          {isOwner && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (milestone.submission) {
                                  onOpenReview({
                                    id: milestone.id,
                                    title: milestone.title,
                                    amount: milestone.budget,
                                    submission: milestone.submission,
                                  });
                                }
                              }}
                              className='px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm'>
                              審核交付
                            </button>
                          )}
                        </div>
                        {milestone.submission && (
                          <p className='text-xs text-yellow-600/80 mt-1 pl-6'>
                            提交於 {new Date(milestone.submission.submittedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Rejection Feedback */}
                    {milestone.status === 'in_progress' && milestone.submission?.status === 'rejected' && (
                      <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
                        <p className='text-sm text-red-700 font-medium flex items-center mb-1'>
                          <AlertTriangle className='w-4 h-4 mr-2' />
                          上次提交已駁回
                        </p>
                        <p className='text-xs text-red-600 pl-6'>{milestone.submission.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
