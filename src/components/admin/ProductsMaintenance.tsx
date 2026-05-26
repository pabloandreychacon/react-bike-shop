import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Video, Image } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getSettings } from '../../utils/settings';
import { joinBilingualText, splitBilingualText } from '../../utils/bilingual';

interface Product {
  Id?: number;
  Name: string;
  Description: string;
  Price: number;
  CategoryId?: number;
  ImageUrl: string;
  IsService: boolean;
  IsOffer?: boolean;
  Active: boolean;
  IdBusiness: number;
  BusinessEmail?: string;
}

interface ProductMediaItem {
  Id: number;
  ProductId: number;
  MediaType: 'image' | 'video';
  MediaUrl: string;
  DisplayOrder: number;
  BusinessEmail: string;
  IdBusiness: number;
  isVideo: boolean;
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
  const [productFirstMedia, setProductFirstMedia] = useState<Record<string, { url: string; isVideo: boolean }>>({});

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
        .eq('IdBusiness', settings.id);

      if (error) throw error;

      const productsData = (data || []).sort((a, b) => (a.Name || '').localeCompare(b.Name || ''));
      setProducts(productsData);

      const ids = productsData.map(p => p.Id).filter(Boolean);
      if (ids.length > 0) {
        const { data: media } = await supabase
          .from('ProductMedia')
          .select('ProductId, MediaUrl, isVideo, DisplayOrder')
          .in('ProductId', ids)
          .eq('IdBusiness', settings.id)
          .order('DisplayOrder', { ascending: true });

        const mediaMap: Record<string, { url: string; isVideo: boolean }> = {};
        (media || []).forEach((m: any) => {
          const key = String(m.ProductId);
          const isVid = m.isVideo === true || m.isVideo === 'true';
          const existing = mediaMap[key];
          if (!existing || (isVid && !existing.isVideo)) {
            mediaMap[key] = { url: m.MediaUrl, isVideo: isVid };
          }
        });
        setProductFirstMedia(mediaMap);
      }
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (product: Product) => {
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
      } else {
        const { error } = await supabase
          .from('Products')
          .update(productData)
          .eq('Id', productId);
        if (error) throw error;
      }

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
      await supabase.from('ProductMedia').delete().eq('ProductId', id);

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
    const initialName = splitBilingualText(product?.Name || '');
    const initialDesc = splitBilingualText(product?.Description || '');
    const [nameEs, setNameEs] = useState(initialName.es);
    const [nameEn, setNameEn] = useState(initialName.en);
    const [descEs, setDescEs] = useState(initialDesc.es);
    const [descEn, setDescEn] = useState(initialDesc.en);

    const [formData, setFormData] = useState({
      Price: product?.Price || 0,
      ImageUrl: '',
      IsService: product?.IsService || false,
      IsOffer: product?.IsOffer || false,
      Active: product?.Active ?? true,
      IdBusiness: product?.IdBusiness || 0,
      BusinessEmail: product?.BusinessEmail || '',
      ...(product?.Id && { Id: product.Id })
    });

    useEffect(() => {
      const n = splitBilingualText(product?.Name || '');
      const d = splitBilingualText(product?.Description || '');
      setNameEs(n.es);
      setNameEn(n.en);
      setDescEs(d.es);
      setDescEn(d.en);
    }, [product?.Id]);

    const buildProductForSave = (): Product => ({
      ...formData,
      Name: joinBilingualText(nameEs, nameEn),
      Description: joinBilingualText(descEs, descEn),
    });

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.products.nameSpanish}</label>
            <input
              type="text"
              value={nameEs}
              onChange={(e) => setNameEs(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.products.nameEnglish}</label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.products.price}</label>
            <input
              type="number"
              value={formData.Price}
              onChange={(e) => setFormData({ ...formData, Price: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.products.descriptionSpanish}</label>
            <textarea
              value={descEs}
              onChange={(e) => setDescEs(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.products.descriptionEnglish}</label>
            <textarea
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
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
                checked={formData.IsOffer}
                onChange={(e) => setFormData({ ...formData, IsOffer: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">{t.products.isOffer}</span>
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
            onClick={() => onSave(buildProductForSave())}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4 inline mr-1" />
            {t.products.save}
          </button>
        </div>
      </div>
    );
  };

  const MediaManager = ({ productId, businessEmail, idBusiness }: {
    productId: number;
    businessEmail: string;
    idBusiness: number;
  }) => {
    const [mediaItems, setMediaItems] = useState<ProductMediaItem[]>([]);
    const [newMediaUrl, setNewMediaUrl] = useState('');
    const [isVideo, setIsVideo] = useState(false);
    const [mediaLoading, setMediaLoading] = useState(true);

    const loadMedia = async () => {
      setMediaLoading(true);
      const { data } = await supabase
        .from('ProductMedia')
        .select('*')
        .eq('ProductId', productId)
        .eq('IdBusiness', idBusiness)
        .order('DisplayOrder', { ascending: true });
      setMediaItems(data || []);
      setMediaLoading(false);
    };

    useEffect(() => {
      loadMedia();
    }, [productId]);

    const handleAddMedia = async () => {
      if (!newMediaUrl.trim()) return;
      if (mediaItems.length >= 10) {
        alert(t.products.maxMediaReached || 'Maximum 10 media items allowed');
        return;
      }
      await supabase.from('ProductMedia').insert([{
        ProductId: productId,
        MediaType: isVideo ? 'video' : 'image',
        MediaUrl: newMediaUrl.trim(),
        DisplayOrder: 0,
        BusinessEmail: businessEmail,
        IdBusiness: idBusiness,
        isVideo
      }]);
      setNewMediaUrl('');
      await loadMedia();
    };

    const handleDeleteMedia = async (mediaId: number) => {
      await supabase.from('ProductMedia').delete().eq('Id', mediaId);
      await loadMedia();
    };

    const handleToggleVideo = async (mediaId: number, currentIsVideo: boolean) => {
      await supabase.from('ProductMedia')
        .update({ isVideo: !currentIsVideo, MediaType: !currentIsVideo ? 'video' : 'image' })
        .eq('Id', mediaId);
      await loadMedia();
    };

    return (
      <div className="border-t border-gray-200 pt-4 mt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{t.products.productMedia || 'Product Media'}</h3>
        <div className="flex gap-3 mb-3 flex-wrap">
          <input
            type="text"
            value={newMediaUrl}
            onChange={(e) => setNewMediaUrl(e.target.value)}
            placeholder="Enter image or video URL..."
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <label className="flex items-center gap-1 text-sm text-gray-700 whitespace-nowrap">
            <input type="checkbox" checked={isVideo} onChange={(e) => setIsVideo(e.target.checked)} />
            {t.products.isVideo || 'Is Video'}
          </label>
          <button
            onClick={handleAddMedia}
            className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {t.products.addMedia || 'Add'}
          </button>
        </div>
        {mediaLoading ? (
          <p className="text-sm text-gray-500">Loading media...</p>
        ) : mediaItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {mediaItems.map(media => (
              <div key={media.Id} className="bg-gray-100 p-2 rounded-lg">
                {media.isVideo ? (
                  <video controls src={media.MediaUrl} className="w-full h-32 object-cover rounded" />
                ) : (
                  <img src={media.MediaUrl} alt="" className="w-full h-32 object-cover rounded" />
                )}
                <div className="mt-2 flex gap-1 justify-center">
                  <button
                    onClick={() => handleToggleVideo(media.Id, media.isVideo)}
                    className="p-1 text-gray-500 hover:text-blue-600"
                    title={media.isVideo ? 'Mark as Image' : 'Mark as Video'}
                  >
                    {media.isVideo ? <Image className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteMedia(media.Id)}
                    className="p-1 text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">{t.products.noMedia || 'No media added yet.'}</p>
        )}
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
            key="new-product"
            product={{
              Name: '',
              Description: '',
              Price: 0,
              ImageUrl: '',
              IsService: false,
              IsOffer: false,
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
          products.map((product) => {
            const nameParts = splitBilingualText(product.Name || '');
            const descParts = splitBilingualText(product.Description || '');
            const titlePrimary = nameParts.es || nameParts.en || product.Name;
            const altLabel = (titlePrimary || 'Product').trim();
            const firstMedia = productFirstMedia[String(product.Id)];

            return (
            <div key={product.Id} className="bg-white border border-gray-200 rounded-lg p-4">
              {editingProduct?.Id === product.Id && editingProduct ? (
                <div>
                  <ProductForm
                    key={editingProduct.Id}
                    product={editingProduct}
                    onSave={handleSave}
                    onCancel={() => setEditingProduct(null)}
                  />
                  {editingProduct.Id && (
                    <MediaManager
                      productId={editingProduct.Id}
                      businessEmail={editingProduct.BusinessEmail || ''}
                      idBusiness={editingProduct.IdBusiness}
                    />
                  )}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 px-4 py-4">
                      {firstMedia && !firstMedia.isVideo && (
                        <img
                          src={firstMedia.url}
                          alt={altLabel}
                          className="w-14 h-14 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                        />
                      )}
                      <h3 className="text-lg font-medium flex-1">
                        {titlePrimary}
                        {nameParts.es && nameParts.en ? (
                          <span className="block text-sm font-normal text-gray-500 mt-0.5">{nameParts.en}</span>
                        ) : null}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <span className={`px-2 py-1 text-xs rounded-full ${product.IsService ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                          {product.IsService ? t.products.service : t.products.product}
                        </span>
                        {product.IsOffer && (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            {t.products.offer}
                          </span>
                        )}
                        <span className="text-sm font-medium text-green-600">{currencyCode}{product.Price}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${product.Active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {product.Active ? t.products.active : t.products.inactive}
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-600 text-sm px-4 pt-0 pb-4 space-y-1">
                      <p>{descParts.es || descParts.en || product.Description}</p>
                      {descParts.es && descParts.en ? (
                        <p className="text-gray-500 text-xs">{descParts.en}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex gap-2 self-end sm:self-start sm:ml-4 sm:mt-4 mt-2">
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
            );
          })
        )}
      </div>
    </div>
  );
}
