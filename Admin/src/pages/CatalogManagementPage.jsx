import React, { useState, useEffect } from 'react';
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
import { 
  Search, Plus, Trash2, Edit3, Layers, Star, X, Eye, EyeOff, CheckSquare, Square, 
  AlertTriangle, PackageCheck, ShoppingBag, ShieldAlert, IndianRupee, SlidersHorizontal
} from 'lucide-react';
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setCategoryModalVisible(false);
        setReviewsModalVisible(false);
        setInventoryModalProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const { data: productsData, isLoading, refetch } = useGetAdminProductsQuery({
    q: search || undefined,
    categoryId: selectedCategory || undefined,
    limit: 50,
  });

  const { data: categoriesData } = useGetAdminCategoriesQuery();
  const { data: reviewsData, refetch: refetchReviews } = useGetAdminReviewsQuery();

  const products = productsData?.products || [];
  const categories = categoriesData?.categories || [];
  const reviews = reviewsData?.reviews || [];

  // Catalog Analytics Calculations
  const totalProductsCount = products.length;
  const lowStockCount = products.filter(p => (p.stock !== undefined ? p.stock : 50) <= (p.lowStockThreshold !== undefined ? p.lowStockThreshold : 5)).length;
  const totalCatalogValue = products.reduce((acc, p) => acc + ((p.price || 0) * (p.stock !== undefined ? p.stock : 50)), 0);

  const [deleteProduct] = useDeleteProductMutation();
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const [toggleVisibility] = useToggleProductVisibilityMutation();
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

  const handleBulkVisibility = async (action) => {
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
    const allIds = products.map(p => p._id);
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
      {/* Top Metric Insights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#181926] p-4 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-[#704F38]/10 dark:bg-[#E8B84E]/10 text-[#704F38] dark:text-[#E8B84E] flex items-center justify-center font-black">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black text-[#797979] dark:text-[#A0AEC0] uppercase tracking-wider block">Total Catalog Items</span>
            <span className="text-xl font-black text-[#1F2029] dark:text-white mt-0.5 block">{totalProductsCount} Products</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#181926] p-4 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm flex items-center gap-4 transition-colors">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
            lowStockCount > 0 ? 'bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 text-[#B91C1C] dark:text-[#F87171]' : 'bg-[#ECFDF5] dark:bg-[#064E3B]/30 text-[#047857] dark:text-[#34D399]'
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black text-[#797979] dark:text-[#A0AEC0] uppercase tracking-wider block">Low Stock Alerts</span>
            <span className={`text-xl font-black mt-0.5 block ${lowStockCount > 0 ? 'text-[#B91C1C] dark:text-[#F87171]' : 'text-[#047857] dark:text-[#34D399]'}`}>
              {lowStockCount} Items At Risk
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#181926] p-4 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-[#1E3A8A]/30 text-[#1D4ED8] dark:text-[#60A5FA] flex items-center justify-center font-black">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black text-[#797979] dark:text-[#A0AEC0] uppercase tracking-wider block">Inventory Valuation</span>
            <span className="text-xl font-black text-[#1F2029] dark:text-white mt-0.5 block">₹{totalCatalogValue.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Sticky Filter & Search Control Bar */}
      <div className="flex flex-col lg:flex-row gap-3 bg-white dark:bg-[#181926] p-4 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm items-center transition-colors">
        {/* Search Input */}
        <div className="w-full lg:w-72 flex items-center bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] rounded-2xl px-3.5 focus-within:border-[#704F38] dark:focus-within:border-[#E8B84E] transition-all">
          <Search className="w-4 h-4 text-[#797979] dark:text-[#A0AEC0] mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search Title or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2.5 bg-transparent border-none outline-none text-xs font-bold text-[#1F2029] dark:text-white placeholder-[#797979] dark:placeholder-[#A0AEC0]"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-[#797979] dark:text-[#A0AEC0] hover:text-[#1F2029] dark:hover:text-white ml-1">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex-1 flex gap-2 overflow-x-auto w-full py-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-2 ${
              selectedCategory === ''
                ? 'bg-[#704F38] text-white shadow-md'
                : 'bg-[#FDFBF9] dark:bg-[#11121E] text-[#797979] dark:text-[#A0AEC0] border border-[#EDEDED] dark:border-[#2A2C3F] hover:text-[#1F2029] dark:hover:text-white'
            }`}
          >
            <span>All Categories</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${selectedCategory === '' ? 'bg-white/20 text-white' : 'bg-[#EDEDED] dark:bg-[#262838] text-[#1F2029] dark:text-white'}`}>
              {totalProductsCount}
            </span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-2 ${
                selectedCategory === cat._id
                  ? 'bg-[#704F38] text-white shadow-md'
                  : 'bg-[#FDFBF9] dark:bg-[#11121E] text-[#797979] dark:text-[#A0AEC0] border border-[#EDEDED] dark:border-[#2A2C3F] hover:text-[#1F2029] dark:hover:text-white'
              }`}
            >
              <span>{cat.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${selectedCategory === cat._id ? 'bg-white/20 text-white' : 'bg-[#EDEDED] dark:bg-[#262838] text-[#1F2029] dark:text-white'}`}>
                {cat.productCount || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Action Header Buttons */}
        <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-end">
          <button onClick={() => setCategoryModalVisible(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] hover:border-[#704F38] dark:hover:border-[#E8B84E] text-xs font-extrabold text-[#1F2029] dark:text-white transition-all shadow-sm">
            <Layers className="w-4 h-4 text-[#704F38] dark:text-[#E8B84E]" /> Categories
          </button>

          <button onClick={() => setReviewsModalVisible(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] hover:border-[#704F38] dark:hover:border-[#E8B84E] text-xs font-extrabold text-[#1F2029] dark:text-white transition-all shadow-sm">
            <Star className="w-4 h-4 text-[#E8B84E]" fill="#E8B84E" /> Reviews ({reviews.length})
          </button>

          <button onClick={onNavigateToCreateProduct} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#704F38] hover:bg-[#8C6244] text-white text-xs font-black shadow-md shadow-[#704F38]/20 transition-all whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedProductIds.length > 0 && (
        <div className="bg-[#FFFBEB] dark:bg-[#78350F]/30 p-4 rounded-2xl border border-[#FDE68A] dark:border-[#B45309]/50 flex items-center justify-between animate-fadeIn">
          <span className="text-xs font-black text-[#B45309] dark:text-[#FBBF24]">
            {selectedProductIds.length} Product(s) Selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkVisibility('show')}
              disabled={isBulkingVis}
              className="px-3.5 py-1.5 bg-white dark:bg-[#181926] border border-[#EDEDED] dark:border-[#262838] hover:border-[#704F38] rounded-xl text-xs font-extrabold text-[#047857] dark:text-[#34D399] flex items-center gap-1.5 shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" /> Bulk Show
            </button>
            <button
              onClick={() => handleBulkVisibility('hide')}
              disabled={isBulkingVis}
              className="px-3.5 py-1.5 bg-white dark:bg-[#181926] border border-[#EDEDED] dark:border-[#262838] hover:border-[#704F38] rounded-xl text-xs font-extrabold text-[#B91C1C] dark:text-[#F87171] flex items-center gap-1.5 shadow-sm"
            >
              <EyeOff className="w-3.5 h-3.5" /> Bulk Soft Hide
            </button>
          </div>
        </div>
      )}

      {/* Product Inventory Table */}
      <div className="bg-white dark:bg-[#181926] rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[850px]">
            <thead>
              <tr className="bg-[#FDFBF9] dark:bg-[#11121E] border-b border-[#EDEDED] dark:border-[#262838] text-[#797979] dark:text-[#A0AEC0] text-[11px] font-extrabold uppercase tracking-wider">
                <th className="px-5 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={products.length > 0 && selectedProductIds.length === products.length}
                    onChange={toggleSelectAll}
                    className="accent-[#704F38]"
                  />
                </th>
                <th className="px-5 py-4">Product Details</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Stock & SLA Health</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Visibility</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEDED] dark:divide-[#262838]">
              {isLoading ? (
                <tr>
                  <td colSpan="7">
                    <Loader message="Loading Product Catalog..." />
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-[#797979] dark:text-[#A0AEC0] font-bold">No products found in catalog.</td></tr>
              ) : (
                products.map((item) => {
                  const stock = item.stock !== undefined ? item.stock : 50;
                  const lowThreshold = item.lowStockThreshold !== undefined ? item.lowStockThreshold : 5;
                  const isLowStock = stock <= lowThreshold;

                  return (
                    <tr key={item._id} className={`hover:bg-[#FDFBF9]/50 dark:hover:bg-[#1C1D2C] transition-colors ${item.isHidden ? 'opacity-60 bg-gray-50 dark:bg-[#11121E]/50' : ''}`}>
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
                          <img
                            src={item.images?.[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea'}
                            alt={item.title}
                            className="w-12 h-12 rounded-2xl object-cover border border-[#EDEDED] dark:border-[#2A2C3F] shadow-sm flex-shrink-0"
                          />
                          <div>
                            <div className="font-extrabold text-[#1F2029] dark:text-white text-sm">{item.title}</div>
                            <div className="text-[11px] text-[#797979] dark:text-[#A0AEC0] font-medium flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono font-bold text-[#704F38] dark:text-[#E8B84E] bg-[#FDFBF9] dark:bg-[#11121E] px-1.5 py-0.5 rounded-md border border-[#EDEDED] dark:border-[#2A2C3F] select-all">
                                #{item.sku || ('PRD-' + item._id.slice(-6).toUpperCase())}
                              </span>
                              <span>• {item.brand} ({item.gender || 'Unisex'})</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#EEF2FF] dark:bg-[#312E81]/30 text-[#4338CA] dark:text-[#818CF8] border border-[#C7D2FE] dark:border-[#312E81]/50">
                          {item.category?.name || 'General'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleOpenInventoryModal(item)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
                            isLowStock 
                              ? 'bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 text-[#B91C1C] dark:text-[#F87171] border-[#FECACA] dark:border-[#7F1D1D]/50 animate-pulse' 
                              : 'bg-[#FDFBF9] dark:bg-[#11121E] text-[#1F2029] dark:text-white border-[#EDEDED] dark:border-[#2A2C3F] hover:border-[#704F38] dark:hover:border-[#E8B84E]'
                          }`}
                        >
                          {isLowStock && <AlertTriangle className="w-3.5 h-3.5" />}
                          Stock: {stock} (Min: {lowThreshold})
                        </button>
                      </td>
                      <td className="px-5 py-4 font-black text-[#704F38] dark:text-[#E8B84E] text-sm">
                        ₹{item.price?.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-xl text-[10px] font-black tracking-wider uppercase border ${
                          item.isHidden
                            ? 'bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 text-[#B91C1C] dark:text-[#F87171] border-[#FECACA] dark:border-[#7F1D1D]/50'
                            : 'bg-[#ECFDF5] dark:bg-[#064E3B]/30 text-[#047857] dark:text-[#34D399] border-[#A7F3D0] dark:border-[#064E3B]/50'
                        }`}>
                          {item.isHidden ? 'SOFT HIDDEN' : 'VISIBLE'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleToggleProductVisibility(item)}
                            title={item.isHidden ? "Make Visible" : "Soft Hide Product"}
                            className="p-2 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] hover:border-[#704F38] dark:hover:border-[#E8B84E] rounded-xl transition-all shadow-sm"
                          >
                            {item.isHidden ? <Eye className="w-4 h-4 text-[#047857] dark:text-[#34D399]" /> : <EyeOff className="w-4 h-4 text-[#E57373]" />}
                          </button>
                          <button
                            onClick={() => onNavigateToEditProduct && onNavigateToEditProduct(item)}
                            title="Edit Product Details"
                            className="p-2 bg-[#704F38] text-white hover:bg-[#8C6244] rounded-xl shadow-sm transition-all"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(item._id, item.title)}
                            title="Delete Product"
                            className="p-2 bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 border border-[#FECACA] dark:border-[#7F1D1D]/50 hover:bg-[#EF4444] text-[#B91C1C] dark:text-[#F87171] hover:text-white rounded-xl shadow-sm transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#181926] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-[#EDEDED] dark:border-[#262838] transition-colors">
            <div className="flex justify-between items-center mb-6 border-b border-[#EDEDED] dark:border-[#262838] pb-4">
              <h3 className="text-base font-black text-[#1F2029] dark:text-white">Inventory & Low-Stock Alerts</h3>
              <button onClick={() => setInventoryModalProduct(null)} className="text-[#797979] dark:text-[#A0AEC0] hover:text-[#1F2029] dark:hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <p className="text-xs font-bold text-[#1F2029] dark:text-white mb-4">Product: {inventoryModalProduct.title}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#1F2029] dark:text-white uppercase mb-1">Available Stock Units</label>
                <input
                  type="number"
                  min="0"
                  value={newStockVal}
                  onChange={(e) => setNewStockVal(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] rounded-xl outline-none text-sm font-bold text-[#1F2029] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#1F2029] dark:text-white uppercase mb-1">Low Stock Alert Threshold</label>
                <input
                  type="number"
                  min="0"
                  value={newThresholdVal}
                  onChange={(e) => setNewThresholdVal(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] rounded-xl outline-none text-sm font-bold text-[#1F2029] dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setInventoryModalProduct(null)} className="px-4 py-2.5 rounded-xl bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] text-xs font-extrabold text-[#797979] dark:text-[#A0AEC0]">Cancel</button>
              <button onClick={handleSaveInventory} disabled={isUpdatingInv} className="px-5 py-2.5 rounded-xl bg-[#704F38] hover:bg-[#8C6244] text-white text-xs font-extrabold shadow-md">
                {isUpdatingInv ? 'Saving...' : 'Save Inventory'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {categoryModalVisible && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#181926] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-[#EDEDED] dark:border-[#262838] transition-colors">
            <div className="flex justify-between items-center mb-6 border-b border-[#EDEDED] dark:border-[#262838] pb-4">
              <h3 className="text-lg font-black text-[#1F2029] dark:text-white">Add New Category</h3>
              <button onClick={() => setCategoryModalVisible(false)} className="text-[#797979] dark:text-[#A0AEC0] hover:text-[#1F2029] dark:hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <label className="text-xs font-extrabold text-[#1F2029] dark:text-white uppercase tracking-wider block mb-2">Category Name *</label>
            <input
              type="text"
              placeholder="e.g. Jackets, Accessories"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#EDEDED] dark:border-[#2A2C3F] bg-[#FDFBF9] dark:bg-[#11121E] text-sm font-bold text-[#1F2029] dark:text-white outline-none focus:border-[#704F38] mb-4"
            />

            <label className="text-xs font-extrabold text-[#1F2029] dark:text-white uppercase tracking-wider block mb-2">Image URL</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={newCatImage}
              onChange={(e) => setNewCatImage(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#EDEDED] dark:border-[#2A2C3F] bg-[#FDFBF9] dark:bg-[#11121E] text-sm font-medium text-[#1F2029] dark:text-white outline-none focus:border-[#704F38] mb-6"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setCategoryModalVisible(false)} className="px-4 py-2.5 rounded-xl bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] text-xs font-extrabold text-[#797979] dark:text-[#A0AEC0]">Cancel</button>
              <button onClick={handleSaveCategory} disabled={isCreatingCategory} className="px-5 py-2.5 rounded-xl bg-[#704F38] hover:bg-[#8C6244] text-white text-xs font-extrabold shadow-md">
                {isCreatingCategory ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Moderation Modal */}
      {reviewsModalVisible && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#181926] rounded-3xl p-6 sm:p-8 w-full max-w-xl max-h-[80vh] overflow-y-auto shadow-2xl border border-[#EDEDED] dark:border-[#262838] transition-colors">
            <div className="flex justify-between items-center mb-6 border-b border-[#EDEDED] dark:border-[#262838] pb-4">
              <h3 className="text-lg font-black text-[#1F2029] dark:text-white">Customer Reviews Moderation</h3>
              <button onClick={() => setReviewsModalVisible(false)} className="text-[#797979] dark:text-[#A0AEC0] hover:text-[#1F2029] dark:hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center text-[#797979] dark:text-[#A0AEC0] py-8 font-bold text-xs">No customer reviews submitted yet.</div>
            ) : (
              <div className="divide-y divide-[#EDEDED] dark:divide-[#262838]">
                {reviews.map((rev) => (
                  <div key={rev._id} className="flex items-center justify-between py-3.5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-extrabold text-xs text-[#1F2029] dark:text-white">{rev.userName || 'Anonymous'}</span>
                        <div className="flex items-center gap-1 bg-[#FFFBEB] dark:bg-[#78350F]/30 px-2 py-0.5 rounded-full border border-[#FDE68A] dark:border-[#B45309]/50">
                          <Star className="w-3 h-3 text-[#E8B84E]" fill="#E8B84E" />
                          <span className="text-[11px] font-black text-[#B45309] dark:text-[#FBBF24]">{rev.rating}</span>
                        </div>
                      </div>
                      <div className="text-xs text-[#797979] dark:text-[#A0AEC0] font-medium">{rev.comment || rev.text}</div>
                    </div>
                    <button onClick={() => handleDeleteReviewItem(rev._id)} title="Delete Review" className="p-2 bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 border border-[#FECACA] dark:border-[#7F1D1D]/50 hover:bg-[#EF4444] text-[#B91C1C] dark:text-[#F87171] hover:text-white rounded-xl transition-all">
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
