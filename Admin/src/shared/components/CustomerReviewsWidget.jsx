import React from 'react';
import { useGetAdminReviewsQuery, useDeleteReviewMutation } from '../../services/adminCatalogApi';
import { Star, MessageSquare, Trash2, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

export const CustomerReviewsWidget = ({ onNavigateToCatalog }) => {
  const { data: reviewsData, isLoading, refetch } = useGetAdminReviewsQuery({ limit: 5 });
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const reviews = reviewsData?.reviews || [];
  const totalReviews = reviewsData?.pagination?.total || reviews.length;

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete/hide this customer review?')) {
      try {
        await deleteReview(id).unwrap();
        refetch();
      } catch (err) {
        alert(err.data?.message || 'Failed to delete review');
      }
    }
  };

  return (
    <div className="bg-white dark:bg-[#181926] p-6 rounded-2xl border border-[#EDEDED] dark:border-[#262838] shadow-sm flex flex-col justify-between transition-colors duration-300">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFFBEB] dark:bg-[#312E81]/30 text-[#F59E0B] flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#1F2029] dark:text-white uppercase tracking-wider">
                Customer Reviews
              </h3>
              <p className="text-xs text-[#797979] dark:text-[#A0AEC0] font-medium">
                {totalReviews} total customer feedbacks
              </p>
            </div>
          </div>

          {onNavigateToCatalog && (
            <button
              onClick={() => onNavigateToCatalog('catalog')}
              className="text-xs font-black text-[#704F38] dark:text-[#E8B84E] hover:underline flex items-center gap-1"
            >
              Manage Catalog <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Real Reviews List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="py-6 text-center text-xs text-[#797979] dark:text-[#A0AEC0]">
              Loading customer reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#797979] dark:text-[#A0AEC0]">
              No customer reviews found.
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-3.5 rounded-xl bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#26283A] hover:border-[#704F38]/30 dark:hover:border-[#E8B84E]/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-[#1F2029] dark:text-white">
                      {rev.userName || 'Customer'}
                    </span>
                    {rev.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#ECFDF5] dark:bg-[#064E3B] text-[#047857] dark:text-[#34D399] text-[9px] font-black uppercase">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                      </span>
                    )}
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 text-[#E8B84E]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${star <= (rev.rating || 5) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                      />
                    ))}
                    <span className="text-[10px] font-black text-[#1F2029] dark:text-white ml-1">
                      {rev.rating || 5}.0
                    </span>
                  </div>
                </div>

                {/* Comment Snippet */}
                <p className="text-xs text-[#475569] dark:text-[#CBD5E1] line-clamp-2 italic mb-2">
                  "{rev.comment || 'No text review left.'}"
                </p>

                {/* Footer Bar: Date & Quick Moderation Action */}
                <div className="flex items-center justify-between text-[10px] text-[#797979] dark:text-[#A0AEC0] pt-2 border-t border-[#EDEDED]/50 dark:border-[#26283A]">
                  <span>{new Date(rev.createdAt || Date.now()).toLocaleDateString()}</span>
                  <button
                    onClick={() => handleDelete(rev._id)}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-1 text-[#E57373] hover:text-red-700 font-bold transition-colors"
                    title="Delete / Hide Review"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
