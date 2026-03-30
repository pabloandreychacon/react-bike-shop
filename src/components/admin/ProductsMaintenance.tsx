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
  IdBusiness: number;
  BusinessEmail?: string;
}

interface ProductsMaintenanceProps {
  t: any;
}

export function ProductsMaintenance({ t }: ProductsMaintenanceProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currencyCode, setCurrencyCode] = useState('$');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const settings = await getSettings();
      setCurrencyCode(settings.currencyCode || '$');
      const { data, error } = await supabase
        .from('Products')
        .select('*')
        .eq('IdBusiness', settings.id)
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

  const handleSave = async (product: Product, newImages: File[] = [], imagesToDelete: string[] = []) => {
    try {
      setLoading(true);
      const settings = await getSettings();
      const productData = { ...product, IdBusiness: settings.id, BusinessEmail: settings.email };

      let productId = product.Id;

      if (!productId) {
        const { data, error } = await supabase
          .from('Products')
          .insert(productData)
          .select('Id')
          .single();
        if (error) throw error;
        productId = data.Id;
      }

      let currentImageUrls: string[] = [];
      try {
        if (productData.ImageUrl && productData.ImageUrl.startsWith('[')) {
          currentImageUrls = JSON.parse(productData.ImageUrl);
        } else if (productData.ImageUrl) {
          currentImageUrls = [productData.ImageUrl];
        }
      } catch (e) {
        if (productData.ImageUrl) currentImageUrls = [productData.ImageUrl];
      }

      currentImageUrls = currentImageUrls.filter(url => !imagesToDelete.includes(url));

      for (const url of imagesToDelete) {
        const parts = url.split('/postore/');
        if (parts.length > 1) {
          const path = parts[1];
          await supabase.storage.from('postore').remove([path]);
        }
      }

      for (const file of newImages) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${settings.id}/${productId}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('postore')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage
          .from('postore')
          .getPublicUrl(filePath);
          
        currentImageUrls.push(publicUrlData.publicUrl);
      }

      const finalImageUrl = currentImageUrls.length > 0 ? JSON.stringify(currentImageUrls) : '';
      
      const { error: updateError } = await supabase
        .from('Products')
        .update({ ...productData, ImageUrl: finalImageUrl })
        .eq('Id', productId);
      
      if (updateError) throw updateError;

      await loadProducts();
      setEditingProduct(null);
      setIsCreating(false);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Error guardando producto: ' + (err as Error).message);
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t.products.confirmDelete)) return;

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

  const getAllImages = (urlStr: string) => {
    try {
      if (urlStr?.startsWith('[')) {
        return JSON.parse(urlStr) as string[];
      }
      return urlStr ? [urlStr] : [];
    } catch (e) {
      return urlStr ? [urlStr] : [];
    }
  };

  const ProductForm = ({ product, onSave, onCancel }: {
    product: Product;
    onSave: (product: Product, newImages: File[], imagesToDelete: string[]) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      Name: product?.Name || '',
      Description: product?.Description || '',
      Price: product?.Price || 0,
      ImageUrl: product?.ImageUrl || '',
      IsService: product?.IsService || false,
      Active: product?.Active ?? true,
      IdBusiness: product?.IdBusiness || 0,
      BusinessEmail: product?.BusinessEmail || '',
      ...(product?.Id && { Id: product.Id })
    });

    const [existingImages, setExistingImages] = useState<string[]>(() => {
      try {
        if (product?.ImageUrl?.startsWith('[')) {
          return JSON.parse(product.ImageUrl);
        } else if (product?.ImageUrl) {
          return [product.ImageUrl];
        }
      } catch (e) {}
      return [];
    });
    
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const filesToAdd = Array.from(e.target.files);
        
        const overSizeFiles = filesToAdd.filter(file => file.size > 1024 * 1024);
        if (overSizeFiles.length > 0) {
          alert("Una o más imágenes superan el tamaño máximo de 1MB. Por favor, selecciona imágenes más ligeras.");
          return;
        }

        if (existingImages.length + newFiles.length + filesToAdd.length > 5) {
          alert("Solo puedes subir un máximo de 5 imágenes.");
          return;
        }
        setNewFiles([...newFiles, ...filesToAdd]);
      }
    };

    const removeExistingImage = (url: string) => {
      setExistingImages(existingImages.filter(img => img !== url));
      setImagesToDelete([...imagesToDelete, url]);
    };

    const removeNewFile = (index: number) => {
      setNewFiles(newFiles.filter((_, i) => i !== index));
    };

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.products.name}</label>
            <input
              type="text"
              value={formData.Name}
              onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.products.price}</label>
            <input
              type="number"
              value={formData.Price}
              onChange={(e) => setFormData({ ...formData, Price: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes (Máx 5)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              disabled={existingImages.length + newFiles.length >= 5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-4 mt-4 flex-wrap">
              {existingImages.map((url, i) => (
                <div key={i} className="relative w-24 h-24 border rounded-lg overflow-hidden group">
                  <img src={url} alt="Product" className="w-full h-full object-cover" />
                  <button onClick={() => removeExistingImage(url)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {newFiles.map((file, i) => (
                <div key={`new-${i}`} className="relative w-24 h-24 border rounded-lg overflow-hidden group">
                  <img src={URL.createObjectURL(file)} alt="New Product" className="w-full h-full object-cover opacity-70" />
                  <button onClick={() => removeNewFile(i)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.products.description}</label>
            <textarea
              value={formData.Description}
              onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.IsService}
                onChange={(e) => setFormData({ ...formData, IsService: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">{t.products.isService}</span>
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.Active}
                onChange={(e) => setFormData({ ...formData, Active: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">{t.products.active}</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <X className="w-4 h-4 inline mr-1" />
            {t.products.cancel}
          </button>
          <button
            onClick={() => onSave(formData, newFiles, imagesToDelete)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4 inline mr-1" />
            {t.products.save}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">{t.products.loading}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{t.products.title}</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t.products.addProduct}
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
              IdBusiness: 0,
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
            {t.products.noProducts}
          </div>
        ) : (
          products.map((product) => (
            <div key={product.Id} className="bg-white border border-gray-200 rounded-lg p-4">
              {editingProduct?.Id === product.Id && editingProduct ? (
                <ProductForm
                  product={editingProduct}
                  onSave={handleSave}
                  onCancel={() => setEditingProduct(null)}
                />
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2 px-4 py-4">
                      <h3 className="text-lg font-medium">{product.Name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${product.IsService ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                        {product.IsService ? t.products.service : t.products.product}
                      </span>

                      <span className="text-sm font-medium text-green-600">{currencyCode}{product.Price}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${product.Active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {product.Active ? t.products.active : t.products.inactive}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm px-4 pt-0 pb-4">{product.Description}</p>
                    
                    {getAllImages(product.ImageUrl).length > 0 && (
                      <div className="flex gap-2 px-4 pb-4">
                        {getAllImages(product.ImageUrl).map((imgUrl, i) => (
                          <img 
                            key={i} 
                            src={imgUrl} 
                            alt={`${product.Name} ${i+1}`} 
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200" 
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4 mt-4 mr-4">
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