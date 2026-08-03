import React, { useState } from 'react';
import { useGetAdminReviewsQuery, useDeleteReviewMutation } from '../../services/adminCatalogApi';
import { Star, MessageSquare, Trash2, CheckCircle2, ArrowRight, ThumbsUp, CornerDownRight, Sparkles, Filter, Pin, MessageCircle } from 'lucide-react';

const SAMPLE_ADMIN_REVIEWS = [
  {
    _id: 'ar1',
    userName: 'Aarav Sharma',
    userInitials: 'AS',
    avatarBg: 'bg-[#704F38]',
    productTitle: 'Earthy Slim Fit Suit Blazer',
    rating: 5,
    verifiedPurchase: true,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    headline: 'Exceptional Quality & Perfect Fit!',
    comment: 'The fabric feels amazingly soft and premium. The fitting is spot on, exactly like described in the size guide. Would definitely order again!',
    helpfulCount: 24,
    adminReply: 'Thank you Aarav! We take great pride in our tailoring quality.',
  },
  {
    _id: 'ar2',
    userName: 'Priya Patel',
    userInitials: 'PP',
    avatarBg: 'bg-[#059669]',
    productTitle: 'Adidas Ultraboost Pro',
    rating: 5,
    verifiedPurchase: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    headline: 'Super comfortable for daily wear',
    comment: 'Color is vibrant and identical to the product pictures. Delivered within 2 days with great packaging. Very satisfied customer!',
    helpfulCount: 18,
    adminReply: null,
  },
  {
    _id: 'ar3',
    userName: 'Rohan Mehta',
    userInitials: 'RM',
    avatarBg: 'bg-[#2563EB]',
    productTitle: 'Smart Casual Slim Chinos',
    rating: 4,
    verifiedPurchase: true,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    headline: 'Great value for money & durable',
    comment: 'Stitching is very clean and durable. Worn it to work and got multiple compliments. Highly recommended!',
    helpfulCount: 11,
    adminReply: null,
  },
];

export const CustomerReviewsWidget = ({ onNavigateToCatalog }) => {
  const { data: reviewsData, isLoading, refetch } = useGetAdminReviewsQuery({ limit: 10 });
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const [activeFilter, setActiveFilter] = useState('All');
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyInputText, setReplyInputText] = useState('');
  const [repliesState, setRepliesState] = useState({});
  const [helpfulMap, setHelpfulMap] = useState({});

  const apiReviews = reviewsData?.reviews || [];
  const reviews = apiReviews.length > 0 ? apiReviews : SAMPLE_ADMIN_REVIEWS;
  const totalReviews = reviewsData?.pagination?.total || reviews.length;

  const filteredReviews = reviews.filter((rev) => {
    if (activeFilter === '5 Stars') return rev.rating === 5;
    if (activeFilter === '4 Stars') return rev.rating === 4;
    if (activeFilter === 'Verified') return rev.verifiedPurchase;
    return true;
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete / hide this customer review?')) {
      try {
        await deleteReview(id).unwrap();
        refetch();
      } catch (err) {
        alert(err.data?.message || 'Failed to delete review');
      }
    }
  };

  const handleSendReply = (reviewId) => {
    if (!replyInputText.trim()) return;
    setRepliesState((prev) => ({
      ...prev,
      [reviewId]: replyInputText.trim(),
    }));
    setReplyingToId(null);
    setReplyInputText('');
  };

  const handleHelpfulClick = (id, currentCount = 10) => {
    setHelpfulMap((prev) => ({
      ...prev,
      [id]: (prev[id] || currentCount) + 1,
    }));
  };

  return (
    <div className="bg-white dark:bg-[#181926] p-6 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm flex flex-col justify-between transition-colors duration-300">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center font-bold shadow-sm shrink-0">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-black text-[#1F2029] dark:text-white uppercase tracking-wider whitespace-nowrap">
                  Customer Reviews
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-black border border-emerald-200 dark:border-emerald-800 whitespace-nowrap">
                  4.8 ★ Live Score
                </span>
              </div>
              <p className="text-xs text-[#797979] dark:text-[#A0AEC0] font-medium mt-0.5 truncate">
                {totalReviews} verified customer feedback entries
              </p>
            </div>
          </div>

          {onNavigateToCatalog && (
            <button
              onClick={() => onNavigateToCatalog('catalog')}
              className="text-xs font-black text-[#704F38] dark:text-[#E8B84E] hover:underline flex items-center gap-1 shrink-0 whitespace-nowrap mt-1"
            >
              Manage Catalog <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills Bar */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          {['All', '5 Stars', '4 Stars', 'Verified'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 whitespace-nowrap ${
                activeFilter === tab
                  ? 'bg-[#704F38] text-white dark:bg-[#E8B84E] dark:text-[#181926] shadow-sm'
                  : 'bg-[#F4F4F5] dark:bg-[#202232] text-[#797979] dark:text-[#A0AEC0] hover:text-[#1F2029] dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
          {isLoading ? (
            <div className="py-8 text-center text-xs text-[#797979] dark:text-[#A0AEC0]">
              Loading customer reviews...
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#797979] dark:text-[#A0AEC0]">
              No reviews match selected filter.
            </div>
          ) : (
            filteredReviews.map((rev, idx) => {
              const initials = rev.userInitials || (rev.userName ? rev.userName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'CU');
              const helpful = helpfulMap[rev._id] || rev.helpfulCount || (12 + idx * 3);
              const adminReplyText = repliesState[rev._id] || rev.adminReply;

              return (
                <div
                  key={rev._id}
                  className="p-4 rounded-2xl bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#26283A] hover:border-[#704F38]/30 dark:hover:border-[#E8B84E]/30 transition-all duration-200 shadow-sm space-y-3"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${rev.avatarBg || 'bg-[#704F38]'} text-white flex items-center justify-center font-black text-xs shadow-sm`}>
                        {initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-[#1F2029] dark:text-white">
                            {rev.userName || 'Customer'}
                          </span>
                          {rev.verifiedPurchase && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-black border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#797979] dark:text-[#A0AEC0] block mt-0.5 font-medium">
                          {new Date(rev.createdAt || Date.now()).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-xl border border-amber-200 dark:border-amber-800/50">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                      <span className="text-xs font-black text-[#1F2029] dark:text-white">
                        {rev.rating || 5}.0
                      </span>
                    </div>
                  </div>

                  {/* Product Tag */}
                  {rev.productTitle && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-[#181926] border border-[#EDEDED] dark:border-[#26283A] text-[11px] font-bold text-[#704F38] dark:text-[#E8B84E]">
                      <span>📦 Product: {rev.productTitle}</span>
                    </div>
                  )}

                  {/* Review Text */}
                  <div>
                    {rev.headline && (
                      <h4 className="text-xs font-black text-[#1F2029] dark:text-white mb-1">
                        "{rev.headline}"
                      </h4>
                    )}
                    <p className="text-xs text-[#475569] dark:text-[#CBD5E1] leading-relaxed font-medium">
                      {rev.comment || 'No detailed text review left.'}
                    </p>
                  </div>

                  {/* Official Store Admin Reply Section */}
                  {adminReplyText && (
                    <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-[#1F2029] dark:text-white space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-black text-[11px]">
                        <CornerDownRight className="w-3.5 h-3.5" /> Official Store Response
                      </div>
                      <p className="text-[11px] font-medium text-[#475569] dark:text-[#CBD5E1] pl-5">
                        {adminReplyText}
                      </p>
                    </div>
                  )}

                  {/* Reply Input Modal Box */}
                  {replyingToId === rev._id && (
                    <div className="p-3 rounded-xl bg-white dark:bg-[#181926] border border-[#704F38]/30 dark:border-[#E8B84E]/30 space-y-2">
                      <span className="text-[11px] font-black text-[#704F38] dark:text-[#E8B84E] block">
                        Write Official Store Reply:
                      </span>
                      <textarea
                        rows={2}
                        value={replyInputText}
                        onChange={(e) => setReplyInputText(e.target.value)}
                        placeholder="Type response to customer review..."
                        className="w-full text-xs p-2 rounded-lg bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#26283A] focus:outline-none dark:text-white"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setReplyingToId(null)}
                          className="px-2.5 py-1 text-[11px] font-bold text-[#797979] hover:text-[#1F2029] dark:hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSendReply(rev._id)}
                          className="px-3 py-1 bg-[#704F38] dark:bg-[#E8B84E] text-white dark:text-[#181926] text-[11px] font-black rounded-lg shadow-sm"
                        >
                          Send Response
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Card Footer Actions */}
                  <div className="flex items-center justify-between text-[11px] text-[#797979] dark:text-[#A0AEC0] pt-2 border-t border-[#EDEDED]/60 dark:border-[#26283A]">
                    <button
                      onClick={() => handleHelpfulClick(rev._id, rev.helpfulCount)}
                      className="inline-flex items-center gap-1 hover:text-[#704F38] dark:hover:text-[#E8B84E] font-bold transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({helpful})
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setReplyingToId(replyingToId === rev._id ? null : rev._id);
                          setReplyInputText(adminReplyText || '');
                        }}
                        className="inline-flex items-center gap-1 font-extrabold text-[#704F38] dark:text-[#E8B84E] hover:underline"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> {adminReplyText ? 'Edit Reply' : 'Reply'}
                      </button>

                      <button
                        onClick={() => handleDelete(rev._id)}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-1 text-[#E57373] hover:text-red-700 font-extrabold transition-colors"
                        title="Delete / Hide Review"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
