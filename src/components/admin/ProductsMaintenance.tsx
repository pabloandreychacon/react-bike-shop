import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getSettings } from '../../utils/settings';

interface Product {
  Id?: number;
  Name: string;
  Description: string;
  Price: number;
  CategoryId?: number;
  ImageUrl: string;
  IsService: boolean;
  Active: boolean;
  BusinessEmail: string;
}

export function ProductsMaintenance() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const settings = await getSettings();
      const { data, error } = await supabase
        .from('Products')
        .select('*')
        .eq('BusinessEmail', settings.email)
        .order('Name');

      if (error) throw error;
      console.log('Loaded products:', data);
      setProducts(data || []);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (product: Product) => {
    try {
      const settings = await getSettings();
      const productData = { ...product, BusinessEmail: settings.email };

      if (product.Id) {
        const { error } = await supabase
          .from('Products')
          .update(productData)
          .eq('Id', product.Id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('Products')
          .insert(productData);
        if (error) throw error;
      }

      await loadProducts();
      setEditingProduct(null);
      setIsCreating(false);
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('Products')
        .delete()
        .eq('Id', id);

      if (error) throw error;
      await loadProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const ProductForm = ({ product, onSave, onCancel }: {
    product: Product;
    onSave: (product: Product) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      Name: product?.Name || '',
      Description: product?.Description || '',
      Price: product?.Price || 0,

      ImageUrl: product?.ImageUrl || '',
      IsService: product?.IsService || false,
      Active: product?.Active ?? true,
      BusinessEmail: product?.BusinessEmail || '',
      ...(product?.Id && { Id: product.Id })
    });

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.Name}
              onChange={(e) => setFormData({...formData, Name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="number"
              value={formData.Price}
              onChange={(e) => setFormData({...formData, Price: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              value={formData.ImageUrl}
              onChange={(e) => setFormData({...formData, ImageUrl: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.Description}
              onChange={(e) => setFormData({...formData, Description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.IsService}
                onChange={(e) => setFormData({...formData, IsService: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Is Service</span>
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.Active}
                onChange={(e) => setFormData({...formData, Active: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <X className="w-4 h-4 inline mr-1" />
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            <Save className="w-4 h-4 inline mr-1" />
            Save
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Products Management</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {isCreating && (
        <div className="mb-6">
          <ProductForm
            product={{
              Name: '',
              Description: '',
              Price: 0,

              ImageUrl: '',
              IsService: false,
              Active: true,
              BusinessEmail: ''
            }}
            onSave={handleSave}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      )}

      <div className="space-y-4">
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No products found. Click "Add Product" to create your first product.
          </div>
        ) : (
          products.map((product) => (
          <div key={product.Id} className="bg-white border border-gray-200 rounded-lg p-4">
            {editingProduct?.Id === product.Id ? (
              <ProductForm
                product={editingProduct}
                onSave={handleSave}
                onCancel={() => setEditingProduct(null)}
              />
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-medium">{product.Name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.IsService ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {product.IsService ? 'Service' : 'Product'}
                    </span>

                    <span className="text-sm font-medium text-green-600">${product.Price}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.Active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.Active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{product.Description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => product.Id && handleDelete(product.Id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
        )}
      </div>
    </div>
  );
}