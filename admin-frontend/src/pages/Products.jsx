import React, { useState, useEffect } from 'react';
import api, { API_BASE_URL } from '../api/axios';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentId, setCurrentId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const initialFormState = {
    name: '',
    price: '',
    description: '',
    category: 'Cakes', // Default to first proper category
    image: '',
    countInStock: 0
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts(); // refresh list
      } catch (err) {
        alert('Failed to delete product. Only admins can do this.');
        console.error(err);
      }
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData(initialFormState);
    setCurrentId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      countInStock: product.countInStock || 0,
    });
    setCurrentId(product._id);
    setIsModalOpen(true);
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append('image', file);
    setUploading(true);

    try {
      const res = await api.post('/upload', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData({ ...formData, image: res.data.image });
    } catch (err) {
      console.error(err);
      alert('Failed to upload image. Ensure backend is running.');
    } finally {
      setUploading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await api.post('/products', formData);
      } else {
        await api.put(`/products/${currentId}`, formData);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert('Failed to save product. Ensure you are logged in as admin.');
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">Products</h1>
          <p className="text-gray-600 text-sm">Manage your bakery inventory.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium transition"
        >
          + Add Product
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          No products found. Start by adding one!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 font-medium text-gray-600">Image</th>
                <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="px-4 py-3 font-medium text-gray-600">Price</th>
                <th className="px-4 py-3 font-medium text-gray-600">Quantity</th>
                <th className="px-4 py-3 font-medium text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <img 
                      src={product.image?.startsWith('/') ? `${API_BASE_URL}${product.image}` : product.image}
                      alt={product.name} 
                      className="w-12 h-12 rounded object-cover border border-gray-200 bg-white"
                      onError={(e) => { 
                        if (!e.target.src.includes('placeholder.com')) {
                          e.target.src = 'https://via.placeholder.com/50?text=No+Img'; 
                        }
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{product.name}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-medium">₹{product.price}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${product.countInStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button 
                      onClick={() => openEditModal(product)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product._id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-gray-800">
                  {modalMode === 'create' ? 'Add New Product' : 'Edit Product'}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input 
                    name="name" value={formData.name} onChange={handleFormChange} required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input 
                      type="number" name="price" value={formData.price} onChange={handleFormChange} required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select 
                      name="category" value={formData.category} onChange={handleFormChange} required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white" 
                    >
                      <option value="Cakes">Cakes</option>
                      <option value="Indian Sweets">Indian Sweets</option>
                      <option value="Bakery Snacks">Bakery Snacks</option>
                      <option value="Dairy Desserts">Dairy Desserts</option>
                      <option value="Party Specials">Party Specials</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input 
                    type="number" name="countInStock" value={formData.countInStock} onChange={handleFormChange} required min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <input 
                    type="file" accept="image/*" onChange={uploadFileHandler}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition"
                  />
                  {uploading && <p className="text-xs text-indigo-600 animate-pulse mt-2">Uploading image...</p>}
                  {formData.image && !uploading && (
                    <div className="mt-2 text-xs text-green-600 font-medium border border-green-200 bg-green-50 p-2 rounded truncate">
                      ✓ Image ready: {formData.image}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    name="description" value={formData.description} onChange={handleFormChange} required rows="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
                  />
                </div>

                <div className="pt-5 border-t border-gray-100 flex justify-end space-x-3 mt-6">
                  <button 
                    type="button" onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={uploading}
                    className={`px-4 py-2 text-white rounded-md text-sm font-medium transition ${uploading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                  >
                    {modalMode === 'create' ? 'Create Product' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
