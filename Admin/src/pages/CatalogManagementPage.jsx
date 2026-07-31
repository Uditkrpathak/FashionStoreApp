import React, { useState } from 'react';
import { 
  useGetAdminProductsQuery, 
  useGetAdminCategoriesQuery, 
  useDeleteProductMutation, 
  useCreateCategoryMutation, 
  useGetAdminReviewsQuery, 
  useDeleteReviewMutation,
  useToggleProductVisibilityMutation,
  useBulkProductVisibilityMutation,
  useUpdateInventoryMutation
} from '../services/adminCatalogApi';
import { Search, Plus, Trash2, Edit3, Layers, Star, X, Eye, EyeOff, CheckSquare, Square, AlertTriangle, PackageCheck } from 'lucide-react';
import { Loader } from '../shared/components/Loader';

export const CatalogManagementPage = ({ onNavigateToCreateProduct, onNavigateToEditProduct }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  // Modals
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [reviewsModalVisible, setReviewsModalVisible] = useState(false);

  // Inventory Stock Modal
  const [inventoryModalProduct, setInventoryModalProduct] = useState(null);
  const [newStockVal, setNewStockVal] = useState(50);
  const [newThresholdVal, setNewThresholdVal] = useState(5);

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
  const [toggleVisibility, { isLoading: isTogglingVis }] = useToggleProductVisibilityMutation();
  const [bulkVisibility, { isLoading: isBulkingVis }] = useBulkProductVisibilityMutation();
  const [updateInventory, { isLoading: isUpdatingInv }] = useUpdateInventoryMutation();

  const handleToggleProductVisibility = async (product) => {
    try {
      await toggleVisibility({ id: product._id, isHidden: !product.isHidden }).unwrap();
      refetch();
    } catch (err) {
      alert('Failed to update product visibility');
    }
  };

  const handleBulkVisibility = async (action) => { // 'show' | 'hide'
    if (selectedProductIds.length === 0) return alert('Please select at least one product.');
    try {
      const res = await bulkVisibility({ productIds: selectedProductIds, action }).unwrap();
      alert(`Bulk ${action} complete: ${res.affectedCount} product(s) updated.`);
      setSelectedProductIds([]);
      refetch();
    } catch (err) {
      alert('Bulk visibility update failed');
    }
  };

  const handleOpenInventoryModal = (product) => {
    setInventoryModalProduct(product);
    setNewStockVal(product.stock !== undefined ? product.stock : 50);
    setNewThresholdVal(product.lowStockThreshold !== undefined ? product.lowStockThreshold : 5);
  };

  const handleSaveInventory = async () => {
    if (!inventoryModalProduct) return;
    try {
      await updateInventory({
        id: inventoryModalProduct._id,
        stock: newStockVal,
        lowStockThreshold: newThresholdVal
      }).unwrap();
      setInventoryModalProduct(null);
      refetch();
    } catch (err) {
      alert('Failed to update inventory stock');
    }
  };

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

  const toggleSelectAll = () => {
    const allIds = productsData?.products?.map(p => p._id) || [];
    if (selectedProductIds.length === allIds.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(allIds);
    }
  };

  const toggleSelectProduct = (id) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter(i => i !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
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

      {/* Bulk Action Toolbar if items selected */}
      {selectedProductIds.length > 0 && (
        <div className="bg-[#FFFBEB] p-3 rounded-xl border border-[#FDE68A] flex items-center justify-between animate-fadeIn">
          <span className="text-xs font-black text-[#B45309]">
            {selectedProductIds.length} Product(s) Selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkVisibility('show')}
              disabled={isBulkingVis}
              className="px-3 py-1.5 bg-white border border-[#EDEDED] hover:border-[#704F38] rounded-lg text-xs font-bold text-[#047857] flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" /> Bulk Show
            </button>
            <button
              onClick={() => handleBulkVisibility('hide')}
              disabled={isBulkingVis}
              className="px-3 py-1.5 bg-white border border-[#EDEDED] hover:border-[#704F38] rounded-lg text-xs font-bold text-[#B91C1C] flex items-center gap-1"
            >
              <EyeOff className="w-3.5 h-3.5" /> Bulk Soft Hide
            </button>
          </div>
        </div>
      )}

      {/* Product Inventory Table */}
      <div className="bg-white rounded-xl border border-[#EDEDED] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[850px]">
            <thead>
              <tr className="bg-[#FDFBF9] border-b border-[#EDEDED] text-[#797979] text-[11px] font-extrabold uppercase tracking-wider">
                <th className="px-5 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={productsData?.products?.length > 0 && selectedProductIds.length === productsData?.products?.length}
                    onChange={toggleSelectAll}
                    className="accent-[#704F38]"
                  />
                </th>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Stock & Threshold</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Visibility</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEDED]">
              {isLoading ? (
                <tr>
                  <td colSpan="7">
                    <Loader message="Loading Product Catalog..." />
                  </td>
                </tr>
              ) : productsData?.products?.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-[#797979]">No products found in catalog.</td></tr>
              ) : (
                productsData?.products?.map((item) => {
                  const stock = item.stock !== undefined ? item.stock : 50;
                  const lowThreshold = item.lowStockThreshold !== undefined ? item.lowStockThreshold : 5;
                  const isLowStock = stock <= lowThreshold;

                  return (
                    <tr key={item._id} className={`hover:bg-[#FDFBF9]/50 transition-colors ${item.isHidden ? 'opacity-60 bg-gray-50' : ''}`}>
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProductIds.includes(item._id)}
                          onChange={() => toggleSelectProduct(item._id)}
                          className="accent-[#704F38]"
                        />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={item.images?.[0] || 'https://via.placeholder.com/60'} alt={item.title} className="w-11 h-11 rounded-xl object-cover border border-[#EDEDED]" />
                          <div>
                            <div className="font-extrabold text-[#1F2029]">{item.title}</div>
                            <div className="text-[11px] text-[#797979] font-medium">{item.brand} ({item.gender || 'Unisex'})</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#797979] font-medium">{item.category?.name || 'General'}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleOpenInventoryModal(item)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-black border transition-all ${
                            isLowStock 
                              ? 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA] animate-pulse' 
                              : 'bg-[#FDFBF9] text-[#1F2029] border-[#EDEDED] hover:border-[#704F38]'
                          }`}
                        >
                          {isLowStock && <AlertTriangle className="w-3.5 h-3.5" />}
                          Stock: {stock} (Min: {lowThreshold})
                        </button>
                      </td>
                      <td className="px-5 py-4 font-black text-[#704F38]">₹{item.price?.toLocaleString('en-IN')}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase ${
                          item.isHidden
                            ? 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]'
                            : 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]'
                        }`}>
                          {item.isHidden ? 'SOFT HIDDEN' : 'VISIBLE'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleProductVisibility(item)}
                          title={item.isHidden ? "Make Visible" : "Soft Hide Product"}
                          className="p-2 bg-[#FDFBF9] border border-[#EDEDED] hover:border-[#704F38] rounded-lg transition-colors"
                        >
                          {item.isHidden ? <Eye className="w-4 h-4 text-[#047857]" /> : <EyeOff className="w-4 h-4 text-[#E57373]" />}
                        </button>
                        <button onClick={() => onNavigateToEditProduct && onNavigateToEditProduct(item)} title="Edit Product" className="p-2 bg-[#FDFBF9] border border-[#EDEDED] hover:border-[#704F38] rounded-lg text-[#3B82F6] transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteProduct(item._id, item.title)} title="Delete Product" className="p-2 bg-[#FDFBF9] border border-[#EDEDED] hover:border-[#704F38] rounded-lg text-[#E57373] transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Stock Edit Modal */}
      {inventoryModalProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-[#EDEDED]">
            <div className="flex justify-between items-center mb-6 border-b border-[#EDEDED] pb-4">
              <h3 className="text-base font-black text-[#1F2029]">Inventory & Low-Stock Alerts</h3>
              <button onClick={() => setInventoryModalProduct(null)} className="text-[#797979] hover:text-[#1F2029]"><X className="w-5 h-5" /></button>
            </div>

            <p className="text-xs font-bold text-[#1F2029] mb-4">Product: {inventoryModalProduct.title}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2029] uppercase mb-1">Available Stock Units</label>
                <input
                  type="number"
                  min="0"
                  value={newStockVal}
                  onChange={(e) => setNewStockVal(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF9] border border-[#EDEDED] rounded-xl outline-none text-sm font-bold text-[#1F2029]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2029] uppercase mb-1">Low Stock Alert Threshold</label>
                <input
                  type="number"
                  min="0"
                  value={newThresholdVal}
                  onChange={(e) => setNewThresholdVal(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF9] border border-[#EDEDED] rounded-xl outline-none text-sm font-bold text-[#1F2029]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setInventoryModalProduct(null)} className="px-4 py-2.5 rounded-xl bg-[#FDFBF9] border border-[#EDEDED] text-xs font-bold text-[#797979]">Cancel</button>
              <button onClick={handleSaveInventory} disabled={isUpdatingInv} className="px-5 py-2.5 rounded-xl bg-[#704F38] text-white text-xs font-extrabold shadow-md">
                {isUpdatingInv ? 'Saving...' : 'Save Inventory'}
              </button>
            </div>
          </div>
        </div>
      )}

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
