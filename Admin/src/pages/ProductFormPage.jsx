import React, { useState } from 'react';
import { useGetAdminCategoriesQuery, useCreateProductMutation, useUpdateProductMutation } from '../services/adminCatalogApi';
import { ArrowLeft, Save, AlertCircle, Image as ImageIcon, Sparkles } from 'lucide-react';

export const ProductFormPage = ({ productToEdit, onBack }) => {
  const isEditing = !!productToEdit;

  const [title, setTitle] = useState(productToEdit?.title || '');
  const [brand, setBrand] = useState(productToEdit?.brand || '');
  const [price, setPrice] = useState(productToEdit?.price ? productToEdit.price.toString() : '');
  const [originalPrice, setOriginalPrice] = useState(productToEdit?.originalPrice ? productToEdit.originalPrice.toString() : '');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [gender, setGender] = useState(productToEdit?.gender || 'Men');
  const [category, setCategory] = useState(productToEdit?.category?._id || productToEdit?.category || '');
  const [imageUrl, setImageUrl] = useState(productToEdit?.images?.[0] || '');
  const [initialRating, setInitialRating] = useState(productToEdit?.rating ? productToEdit.rating.toString() : '4.5');

  const [selectedSizes, setSelectedSizes] = useState(productToEdit?.sizes || ['S', 'M', 'L']);
  const [selectedColors, setSelectedColors] = useState(productToEdit?.colors || ['Black', 'White']);
  const [formError, setFormError] = useState('');

  const { data: categoriesData } = useGetAdminCategoriesQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setFormError('');

    if (!title.trim()) return setFormError('Product Title is mandatory.');
    if (!brand.trim()) return setFormError('Product Brand is mandatory.');
    if (!category) return setFormError('Category selection is mandatory.');
    if (!price || parseFloat(price) <= 0) return setFormError('Retail Price must be a valid number greater than ₹0.');
    if (!description.trim()) return setFormError('Product Description is mandatory.');
    if (!imageUrl.trim()) return setFormError('Primary Image URL is mandatory.');
    if (selectedSizes.length === 0) return setFormError('Please select at least 1 size variant.');
    if (selectedColors.length === 0) return setFormError('Please select at least 1 color variant.');

    const payload = {
      title: title.trim(),
      brand: brand.trim(),
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      description: description.trim(),
      gender,
      category,
      images: [imageUrl.trim()],
      sizes: selectedSizes,
      colors: selectedColors,
      initialRating: parseFloat(initialRating) || 4.5,
    };

    try {
      if (isEditing) {
        await updateProduct({ id: productToEdit._id, ...payload }).unwrap();
        alert('Product listing updated successfully!');
      } else {
        await createProduct(payload).unwrap();
        alert('Product listing created successfully!');
      }
      onBack();
    } catch (err) {
      setFormError(err.data?.message || 'Failed to save product listing.');
    }
  };

  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const toggleColor = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between bg-white dark:bg-[#181926] p-4 sm:p-6 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm transition-colors">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1F2029] dark:text-white hover:text-[#704F38] dark:hover:text-[#E8B84E] transition-colors self-start md:self-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Inventory List
        </button>
        <h2 className="text-base font-black text-[#1F2029] dark:text-white text-center md:text-left flex flex-col md:flex-row md:items-center gap-2">
          <span>{isEditing ? 'Edit Product Listing' : 'Create New Product Listing'}</span>
          {isEditing && (
            <span className="text-xs font-mono font-bold text-[#704F38] dark:text-[#E8B84E] bg-[#FDFBF9] dark:bg-[#11121E] px-2 py-0.5 rounded-md border border-[#EDEDED] dark:border-[#2A2C3F] select-all">
              #ID-{productToEdit._id.slice(-8).toUpperCase()}
            </span>
          )}
        </h2>
        <button
          onClick={handleSave}
          disabled={isCreating || isUpdating}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#704F38] hover:bg-[#8C6244] text-white text-xs font-black shadow-md shadow-[#704F38]/20 transition-all w-full md:w-auto"
        >
          <Save className="w-4 h-4" /> {isEditing ? 'Update Listing' : 'Publish Product'}
        </button>
      </div>

      {formError && (
        <div className="bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 border border-[#FCA5A5] dark:border-[#7F1D1D]/50 text-[#DC2626] dark:text-[#F87171] p-4 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Multi-Section Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Info */}
          <div className="bg-white dark:bg-[#181926] rounded-3xl p-6 border border-[#EDEDED] dark:border-[#262838] shadow-sm space-y-4 transition-colors">
            <h3 className="text-xs font-black text-[#704F38] dark:text-[#E8B84E] uppercase tracking-wider">1. Basic Product Information</h3>

            <div>
              <label className="block text-xs font-extrabold text-[#1F2029] dark:text-white uppercase tracking-wider mb-2">Product Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Classic Brown Leather Jacket"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-[#EDEDED] dark:border-[#2A2C3F] bg-[#FDFBF9] dark:bg-[#11121E] text-sm font-bold text-[#1F2029] dark:text-white outline-none focus:border-[#704F38] dark:focus:border-[#E8B84E]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-[#1F2029] dark:text-white uppercase tracking-wider mb-2">Brand *</label>
                <input
                  type="text"
                  required
                  placeholder="Zara, Nike, Puma..."
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-[#EDEDED] dark:border-[#2A2C3F] bg-[#FDFBF9] dark:bg-[#11121E] text-sm font-bold text-[#1F2029] dark:text-white outline-none focus:border-[#704F38] dark:focus:border-[#E8B84E]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#1F2029] dark:text-white uppercase tracking-wider mb-2">Target Gender *</label>
                <div className="flex gap-2">
                  {['Men', 'Women', 'Unisex'].map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGender(g)}
                      className={`flex-1 py-3 rounded-2xl text-xs font-extrabold border transition-all ${
                        gender === g
                          ? 'bg-[#704F38] text-white border-[#704F38] shadow-md'
                          : 'bg-[#FDFBF9] dark:bg-[#11121E] border-[#EDEDED] dark:border-[#2A2C3F] text-[#797979] dark:text-[#A0AEC0]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#1F2029] dark:text-white uppercase tracking-wider mb-2">Category *</label>
              <div className="flex flex-wrap gap-2">
                {categoriesData?.categories?.map((cat) => (
                  <button
                    type="button"
                    key={cat._id}
                    onClick={() => setCategory(cat._id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                      category === cat._id
                        ? 'bg-[#704F38] text-white border-[#704F38] shadow-md'
                        : 'bg-[#FDFBF9] dark:bg-[#11121E] border-[#EDEDED] dark:border-[#2A2C3F] text-[#797979] dark:text-[#A0AEC0]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Description */}
          <div className="bg-white dark:bg-[#181926] rounded-3xl p-6 border border-[#EDEDED] dark:border-[#262838] shadow-sm space-y-4 transition-colors">
            <h3 className="text-xs font-black text-[#704F38] dark:text-[#E8B84E] uppercase tracking-wider">2. Pricing & Description</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-[#1F2029] dark:text-white uppercase tracking-wider mb-2">Retail Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="1299"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-[#EDEDED] dark:border-[#2A2C3F] bg-[#FDFBF9] dark:bg-[#11121E] text-sm font-bold text-[#1F2029] dark:text-white outline-none focus:border-[#704F38] dark:focus:border-[#E8B84E]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#1F2029] dark:text-white uppercase tracking-wider mb-2">Original / MRP (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="2499"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-[#EDEDED] dark:border-[#2A2C3F] bg-[#FDFBF9] dark:bg-[#11121E] text-sm font-bold text-[#1F2029] dark:text-white outline-none focus:border-[#704F38] dark:focus:border-[#E8B84E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#1F2029] dark:text-white uppercase tracking-wider mb-2">Product Description *</label>
              <textarea
                required
                placeholder="Enter product details, fabric composition, and care guide..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-28 p-3.5 rounded-2xl border border-[#EDEDED] dark:border-[#2A2C3F] bg-[#FDFBF9] dark:bg-[#11121E] text-xs font-medium text-[#1F2029] dark:text-white outline-none focus:border-[#704F38] dark:focus:border-[#E8B84E]"
              />
            </div>
          </div>

          {/* Section 3: Variants */}
          <div className="bg-white dark:bg-[#181926] rounded-3xl p-6 border border-[#EDEDED] dark:border-[#262838] shadow-sm space-y-4 transition-colors">
            <h3 className="text-xs font-black text-[#704F38] dark:text-[#E8B84E] uppercase tracking-wider">3. Variant Matrix (Sizes & Colors)</h3>

            <div>
              <label className="block text-xs font-extrabold text-[#1F2029] dark:text-white uppercase tracking-wider mb-2">Available Sizes *</label>
              <div className="flex flex-wrap gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34'].map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                      selectedSizes.includes(size)
                        ? 'bg-[#704F38] text-white border-[#704F38] shadow-md'
                        : 'bg-[#FDFBF9] dark:bg-[#11121E] border-[#EDEDED] dark:border-[#2A2C3F] text-[#797979] dark:text-[#A0AEC0]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#1F2029] dark:text-white uppercase tracking-wider mb-2">Available Colors *</label>
              <div className="flex flex-wrap gap-2">
                {['Black', 'White', 'Brown', 'Blue', 'Red', 'Beige', 'Grey', 'Yellow'].map((color) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                      selectedColors.includes(color)
                        ? 'bg-[#704F38] text-white border-[#704F38] shadow-md'
                        : 'bg-[#FDFBF9] dark:bg-[#11121E] border-[#EDEDED] dark:border-[#2A2C3F] text-[#797979] dark:text-[#A0AEC0]'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Image Preview & Media */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#181926] rounded-3xl p-6 border border-[#EDEDED] dark:border-[#262838] shadow-sm space-y-4 transition-colors">
            <h3 className="text-xs font-black text-[#704F38] dark:text-[#E8B84E] uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Live Image Preview
            </h3>

            <div>
              <label className="block text-xs font-extrabold text-[#1F2029] dark:text-white uppercase tracking-wider mb-2">Primary Image URL *</label>
              <input
                type="text"
                required
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-[#EDEDED] dark:border-[#2A2C3F] bg-[#FDFBF9] dark:bg-[#11121E] text-xs font-mono font-bold text-[#1F2029] dark:text-white outline-none focus:border-[#704F38] dark:focus:border-[#E8B84E]"
              />
            </div>

            {/* Product Card Live Preview */}
            <div className="mt-4 pt-4 border-t border-[#EDEDED] dark:border-[#262838]">
              <span className="text-[10px] font-black text-[#797979] dark:text-[#A0AEC0] uppercase tracking-wider block mb-3">
                Live Store Preview Box
              </span>

              <div className="bg-[#FDFBF9] dark:bg-[#11121E] rounded-3xl p-4 border border-[#EDEDED] dark:border-[#2A2C3F] shadow-sm space-y-3">
                <div className="w-full h-56 rounded-2xl bg-[#F8FAFC] dark:bg-[#181926] border border-[#E2E8F0] dark:border-[#2A2C3F] overflow-hidden flex items-center justify-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-center text-xs text-[#797979] dark:text-[#A0AEC0] font-bold">
                      Enter image URL to view preview
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs font-black text-[#1F2029] dark:text-white truncate">
                    {title || 'Sample Product Title'}
                  </div>
                  <div className="text-[10px] text-[#797979] dark:text-[#A0AEC0] font-medium mt-0.5">
                    {brand || 'Brand'} • {gender}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-black text-[#704F38] dark:text-[#E8B84E]">
                      ₹{price ? parseFloat(price).toLocaleString('en-IN') : '0'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-white dark:bg-[#181926] border border-[#EDEDED] dark:border-[#2A2C3F] rounded-md text-[#704F38] dark:text-[#E8B84E]">
                      {selectedSizes.join(', ') || 'Sizes'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
