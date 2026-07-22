import React, { useState } from 'react';
import { useGetAdminCategoriesQuery, useCreateProductMutation, useUpdateProductMutation } from '../services/adminCatalogApi';
import { ArrowLeft, Save } from 'lucide-react';

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

  const [selectedSizes, setSelectedSizes] = useState(productToEdit?.sizes || ['S', 'M', 'L']);
  const [selectedColors, setSelectedColors] = useState(productToEdit?.colors || ['Black', 'White']);

  const { data: categoriesData } = useGetAdminCategoriesQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!title || !price || !brand) {
      return alert('Please fill in Title, Brand, and Price');
    }

    const payload = {
      title,
      brand,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      description,
      gender,
      category: category || undefined,
      images: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea'],
      sizes: selectedSizes,
      colors: selectedColors,
    };

    try {
      if (isEditing) {
        await updateProduct({ id: productToEdit._id, ...payload }).unwrap();
        alert('Product updated successfully!');
      } else {
        await createProduct(payload).unwrap();
        alert('Product created successfully!');
      }
      onBack();
    } catch (err) {
      alert(err.data?.message || 'Failed to save product');
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
      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between bg-white p-4 rounded-xl border border-[#EDEDED] shadow-sm">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-xs font-bold text-[#1F2029] hover:text-[#704F38] transition-colors self-start md:self-auto">
          <ArrowLeft className="w-4 h-4" /> Back to Inventory List
        </button>
        <h2 className="text-base font-black text-[#1F2029] text-center md:text-left">{isEditing ? 'Edit Product Listing' : 'Create New Product Listing'}</h2>
        <button onClick={handleSave} disabled={isCreating || isUpdating} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#704F38] hover:bg-[#8C6244] text-white text-xs font-extrabold shadow-md shadow-[#704F38]/20 transition-all w-full md:w-auto">
          <Save className="w-4 h-4" /> {isEditing ? 'Update Listing' : 'Publish Product'}
        </button>
      </div>

      {/* Multi-Section Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Basic Info */}
        <div className="bg-white rounded-xl p-6 border border-[#EDEDED] shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-[#1F2029] uppercase tracking-wider">1. Basic Product Information</h3>

          <div>
            <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Product Title *</label>
            <input type="text" required placeholder="e.g. Classic Brown Leather Jacket" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 rounded-xl border border-[#EDEDED] bg-[#FDFBF9] text-sm font-medium outline-none focus:border-[#704F38]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Brand *</label>
              <input type="text" required placeholder="Zara, Nike, Puma..." value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full p-3 rounded-xl border border-[#EDEDED] bg-[#FDFBF9] text-sm font-medium outline-none focus:border-[#704F38]" />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Target Gender *</label>
              <div className="flex gap-2">
                {['Men', 'Women', 'Unisex'].map((g) => (
                  <button type="button" key={g} onClick={() => setGender(g)} className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${gender === g ? 'bg-[#704F38] text-white border-[#704F38]' : 'bg-[#FDFBF9] border-[#EDEDED] text-[#797979]'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {categoriesData?.categories?.map((cat) => (
                <button type="button" key={cat._id} onClick={() => setCategory(cat._id)} className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${category === cat._id ? 'bg-[#704F38] text-white border-[#704F38]' : 'bg-[#FDFBF9] border-[#EDEDED] text-[#797979]'}`}>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Financials */}
        <div className="bg-white rounded-xl p-6 border border-[#EDEDED] shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-[#1F2029] uppercase tracking-wider">2. Pricing & Description</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Retail Price (₹) *</label>
              <input type="number" step="0.01" required placeholder="1299" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 rounded-xl border border-[#EDEDED] bg-[#FDFBF9] text-sm font-medium outline-none focus:border-[#704F38]" />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Original / MRP (₹)</label>
              <input type="number" step="0.01" placeholder="2499" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="w-full p-3 rounded-xl border border-[#EDEDED] bg-[#FDFBF9] text-sm font-medium outline-none focus:border-[#704F38]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Product Description</label>
            <textarea placeholder="Enter product details, fabric composition, and care guide..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-24 p-3 rounded-xl border border-[#EDEDED] bg-[#FDFBF9] text-sm font-medium outline-none focus:border-[#704F38]" />
          </div>
        </div>

        {/* Section 3: Variants */}
        <div className="bg-white rounded-xl p-6 border border-[#EDEDED] shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-[#1F2029] uppercase tracking-wider">3. Variant Matrix (Sizes & Colors)</h3>

          <div>
            <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Available Sizes:</label>
            <div className="flex flex-wrap gap-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34'].map((size) => (
                <button type="button" key={size} onClick={() => toggleSize(size)} className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${selectedSizes.includes(size) ? 'bg-[#704F38] text-white border-[#704F38]' : 'bg-[#FDFBF9] border-[#EDEDED] text-[#797979]'}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Available Colors:</label>
            <div className="flex flex-wrap gap-2">
              {['Black', 'White', 'Brown', 'Blue', 'Red', 'Beige', 'Grey', 'Yellow'].map((color) => (
                <button type="button" key={color} onClick={() => toggleColor(color)} className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${selectedColors.includes(color) ? 'bg-[#704F38] text-white border-[#704F38]' : 'bg-[#FDFBF9] border-[#EDEDED] text-[#797979]'}`}>
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Media */}
        <div className="bg-white rounded-xl p-6 border border-[#EDEDED] shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-[#1F2029] uppercase tracking-wider">4. Media & Primary Image</h3>
          <label className="block text-xs font-bold text-[#1F2029] uppercase tracking-wider mb-2">Primary Image URL</label>
          <input type="text" placeholder="https://images.unsplash.com/photo-..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-3 rounded-xl border border-[#EDEDED] bg-[#FDFBF9] text-sm font-medium outline-none focus:border-[#704F38]" />
        </div>
      </form>
    </div>
  );
};
