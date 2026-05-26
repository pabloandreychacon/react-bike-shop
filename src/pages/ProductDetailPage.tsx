import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Video } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Language } from '../utils/i18n';
import { splitBilingualText } from '../utils/bilingual';
import { getSettings } from '../utils/settings';
import { SEO } from '../components/SEO';

interface ProductDetailPageProps {
  t: any;
  language?: Language;
}

interface Product {
  Id: number;
  Name: string;
  Description: string;
  Price: number;
  ImageUrl: string;
  IsService: boolean;
  Active: boolean;
}

interface MediaItem {
  MediaUrl: string;
  isVideo: boolean;
}

export function ProductDetailPage({ t, language = 'en' }: ProductDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currencyCode, setCurrencyCode] = useState('$');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const settings = await getSettings();
        setCurrencyCode(settings.currencyCode || '$');

        if (!id) return;

        const { data, error } = await supabase
          .from('Products')
          .select('*')
          .eq('IdBusiness', settings.id)
          .eq('Id', parseInt(id))
          .single();

        if (error) throw error;
        
        setProduct(data);

        const { data: media } = await supabase
          .from('ProductMedia')
          .select('MediaUrl, isVideo')
          .eq('ProductId', data.Id)
          .eq('IdBusiness', settings.id)
          .order('DisplayOrder', { ascending: true });

        if (media && media.length > 0) {
          setMediaItems(media.map((m: any) => ({ MediaUrl: m.MediaUrl, isVideo: m.isVideo === true || m.isVideo === 'true' })));
        } else {
          const fallback: MediaItem[] = [];
          const detectVideo = (url: string) => isVideoUrl(url);
          try {
            if (data.ImageUrl?.startsWith('[')) {
              const urls: string[] = JSON.parse(data.ImageUrl);
              urls.forEach(url => fallback.push({ MediaUrl: url, isVideo: detectVideo(url) }));
            } else if (data.ImageUrl) {
              fallback.push({ MediaUrl: data.ImageUrl, isVideo: detectVideo(data.ImageUrl) });
            }
          } catch (e) {
            if (data.ImageUrl) fallback.push({ MediaUrl: data.ImageUrl, isVideo: detectVideo(data.ImageUrl) });
          }
          setMediaItems(fallback);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-xl text-gray-600">{t.products?.loading || 'Loading...'}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t.products?.noProducts || 'Product not found'}</h2>
          <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const nameParts = splitBilingualText(product.Name || '');
  const descParts = splitBilingualText(product.Description || '');
  const title = nameParts[language] || nameParts.en || nameParts.es || product.Name;
  const description = descParts[language] || descParts.en || descParts.es || product.Description;

  const currentMedia = mediaItems[selectedIndex];
  const isVideoUrl = (url: string) => /\.mp4(\?|$)/i.test(url) || /\.(webm|mov|avi|mkv)(\?|$)/i.test(url);

  const isCurrentVideo = currentMedia?.isVideo === true || isVideoUrl(currentMedia?.MediaUrl || '');

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <SEO
        title={title}
        description={description}
        image={mediaItems[0]?.MediaUrl}
      />
      <div className="container mx-auto px-4 max-w-6xl">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-8 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t.nav?.home || 'Back'}
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Media Gallery */}
            <div className="flex flex-col gap-4">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                {mediaItems.length > 0 && currentMedia ? (
                  isCurrentVideo ? (
                    <video 
                      src={currentMedia.MediaUrl}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img 
                      src={currentMedia.MediaUrl}
                      alt={title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
              </div>
              {mediaItems.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {mediaItems.map((media, idx) => {
                    const isVideo = media.isVideo === true || isVideoUrl(media.MediaUrl);
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedIndex(idx)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedIndex === idx ? 'border-blue-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        {isVideo ? (
                          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                            <Video className="w-6 h-6 text-white" />
                          </div>
                        ) : (
                          <img src={media.MediaUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col pt-4">
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${product.IsService ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {product.IsService ? (t.products?.service || 'Service') : (t.products?.product || 'Product')}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{title}</h1>
              </div>

              <div className="text-3xl font-bold text-blue-600 mb-8">
                {currencyCode}{product.Price}
              </div>

              <div className="prose prose-blue max-w-none mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.products?.description || 'Description'}</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{description}</p>
              </div>
              
              <div className="mt-auto">
                <button 
                  onClick={() => window.location.href = '/contact'}
                  className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-orange-500/50 hover:-translate-y-1"
                >
                  {t.cta?.button || 'Contact Us'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
