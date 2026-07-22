import React, { useState } from 'react';
import { useGetAdminProductsQuery, useGetAdminCategoriesQuery, useDeleteProductMutation, useCreateCategoryMutation, useGetAdminReviewsQuery, useDeleteReviewMutation } from '../services/adminCatalogApi';
import { Search, Plus, Trash2, Edit3, Layers, Star, X } from 'lucide-react';
import { Loader } from '../shared/components/Loader';

export const CatalogManagementPage = ({ onNavigateToCreateProduct, onNavigateToEditProduct }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('');

  const [reviewsModalVisible, setReviewsModalVisible] = useState(false);

  const { data: productsData, isLoading, refetch } = useGetAdminProductsQuery({
    q: search || undefined,
    categoryId: selectedCategory || undefined,
    limit: 50,
  });

  const { data: categoriesData } = useGetAdminCategoriesQuery();
  const { data: reviewsData, refetch: refetchReviews } = useGetAdminReviewsQuery();

  const [deleteProduct] = useDeleteProductMutation();
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const handleDeleteProduct = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete product "${title}"?`)) {
      try {
        await deleteProduct(id).unwrap();
        refetch();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const handleSaveCategory = async () => {
    if (!newCatName) return alert('Please enter category name');
    try {
      await createCategory({
        name: newCatName,
        image: newCatImage || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
      }).unwrap();
      setCategoryModalVisible(false);
      setNewCatName('');
      setNewCatImage('');
    } catch (err) {
      alert('Failed to create category');
    }
  };

  const handleDeleteReviewItem = async (reviewId) => {
    try {
      await deleteReview(reviewId).unwrap();
      refetchReviews();
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  return (
    <div className="space-y-6">
      {/* Sticky Filter & Top Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-[#EDEDED] shadow-sm items-center">
        <div className="w-full sm:w-72 flex items-center bg-[#FDFBF9] border border-[#EDEDED] rounded-xl px-3.5">
          <Search className="w-4 h-4 text-[#797979] mr-2" />
          <input
            type="text"
            placeholder="Search Products by Title or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2.5 bg-transparent border-none outline-none text-sm text-[#1F2029]"
          />
        </div>

        <div className="flex-1 flex gap-1.5 overflow-x-auto w-full">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === '' ? 'bg-[#704F38] text-white shadow-md' : 'bg-[#FDFBF9] text-[#797979] border border-[#EDEDED]'
            }`}
          >
            All Categories
          </button>
          {categoriesData?.categories?.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat._id ? 'bg-[#704F38] text-white shadow-md' : 'bg-[#FDFBF9] text-[#797979] border border-[#EDEDED]'
              }`}
            >
              {cat.name} ({cat.productCount || 0})
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
          <button onClick={() => setCategoryModalVisible(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#FDFBF9] border border-[#EDEDED] hover:border-[#704F38] text-xs font-bold text-[#1F2029] transition-colors">
            <Layers className="w-4 h-4 text-[#704F38]" /> Categories
          </button>

          <button onClick={() => setReviewsModalVisible(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#FDFBF9] border border-[#EDEDED] hover:border-[#704F38] text-xs font-bold text-[#1F2029] transition-colors">
            <Star className="w-4 h-4 text-[#E8B84E]" fill="#E8B84E" /> Reviews
          </button>

          <button onClick={onNavigateToCreateProduct} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#704F38] hover:bg-[#8C6244] text-white text-xs font-extrabold shadow-md shadow-[#704F38]/20 transition-all whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Table-First Product Inventory */}
      <div className="bg-white rounded-xl border border-[#EDEDED] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
          <thead>
            <tr className="bg-[#FDFBF9] border-b border-[#EDEDED] text-[#797979] text-[11px] font-extrabold uppercase tracking-wider">
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Brand</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Rating</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDEDED]">
            {isLoading ? (
              <tr>
                <td colSpan="6">
                  <Loader message="Loading Products..." />
                </td>
              </tr>
            ) : productsData?.products?.length === 0 ? (
              <tr><td colSpan="6" className="p-8 text-center text-[#797979]">No products found in catalog.</td></tr>
            ) : (
              productsData?.products?.map((item) => (
                <tr key={item._id} className="hover:bg-[#FDFBF9]/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={item.images?.[0] || 'https://via.placeholder.com/60'} alt={item.title} className="w-11 h-11 rounded-xl object-cover border border-[#EDEDED]" />
                      <div>
                        <div className="font-extrabold text-[#1F2029]">{item.title}</div>
                        <div className="text-[11px] text-[#797979] font-medium">{item.gender || 'Unisex'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#797979] font-medium">{item.brand}</td>
                  <td className="px-5 py-4 text-[#797979] font-medium">{item.category?.name || 'General'}</td>
                  <td className="px-5 py-4 font-black text-[#704F38]">₹{item.price?.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4">
                    <div className="inline-flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#E8B84E]" fill="#E8B84E" />
                      <span className="font-extrabold text-[#1F2029]">{item.rating?.toFixed(1) || '0.0'}</span>
                      <span className="text-xs text-[#797979]">({item.reviewsCount || 0})</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                    <button onClick={() => onNavigateToEditProduct && onNavigateToEditProduct(item)} title="Edit Product" className="p-2 bg-[#FDFBF9] border border-[#EDEDED] hover:border-[#704F38] rounded-lg text-[#3B82F6] transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteProduct(item._id, item.title)} title="Delete Product" className="p-2 bg-[#FDFBF9] border border-[#EDEDED] hover:border-[#704F38] rounded-lg text-[#E57373] transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
      </div>

      {/* Category Modal */}
      {categoryModalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-[#EDEDED]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-[#1F2029]">Add New Category</h3>
              <button onClick={() => setCategoryModalVisible(false)} className="text-[#797979] hover:text-[#1F2029]"><X className="w-5 h-5" /></button>
            </div>

            <label className="text-xs font-bold text-[#1F2029] uppercase tracking-wider block mb-2">Category Name *</label>
            <input
              type="text"
              placeholder="e.g. Jackets, Accessories"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#EDEDED] bg-[#FDFBF9] text-sm font-medium outline-none focus:border-[#704F38] mb-4"
            />

            <label className="text-xs font-bold text-[#1F2029] uppercase tracking-wider block mb-2">Image URL</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={newCatImage}
              onChange={(e) => setNewCatImage(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#EDEDED] bg-[#FDFBF9] text-sm font-medium outline-none focus:border-[#704F38] mb-6"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setCategoryModalVisible(false)} className="px-4 py-2.5 rounded-xl bg-[#FDFBF9] border border-[#EDEDED] text-xs font-bold text-[#797979]">Cancel</button>
              <button onClick={handleSaveCategory} disabled={isCreatingCategory} className="px-5 py-2.5 rounded-xl bg-[#704F38] hover:bg-[#8C6244] text-white text-xs font-extrabold shadow-md">
                {isCreatingCategory ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Moderation Modal */}
      {reviewsModalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-xl max-h-[80vh] overflow-y-auto shadow-2xl border border-[#EDEDED]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-[#1F2029]">Customer Reviews Moderation</h3>
              <button onClick={() => setReviewsModalVisible(false)} className="text-[#797979] hover:text-[#1F2029]"><X className="w-5 h-5" /></button>
            </div>

            {reviewsData?.reviews?.length === 0 ? (
              <div className="text-center text-[#797979] py-8">No reviews submitted yet.</div>
            ) : (
              <div className="divide-y divide-[#EDEDED]">
                {reviewsData?.reviews?.map((rev) => (
                  <div key={rev._id} className="flex items-center justify-between py-3.5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-extrabold text-xs text-[#1F2029]">{rev.userName || 'Anonymous'}</span>
                        <div className="flex items-center gap-1 bg-[#FFFBEB] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                          <Star className="w-3 h-3 text-[#E8B84E]" fill="#E8B84E" />
                          <span className="text-[11px] font-black text-[#B45309]">{rev.rating}</span>
                        </div>
                      </div>
                      <div className="text-xs text-[#797979] font-medium">{rev.comment || rev.text}</div>
                    </div>
                    <button onClick={() => handleDeleteReviewItem(rev._id)} title="Delete Review" className="p-2 bg-[#FEF2F2] rounded-lg text-[#E57373]">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
