import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../components/DashboardLayout';
import { Package, Search, Filter, DollarSign, Eye, Edit, Star, ShoppingCart, TrendingUp, AlertTriangle, Grid, List } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  inventory: number;
  sold: number;
  category: string;
  status: 'active' | 'draft' | 'archived';
  imageUrl?: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

const ProductsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'archived'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }

    loadProducts();
  }, [user, authLoading, router]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      // Sample product data - in real app, this would come from API
      const sampleProducts: Product[] = [
        {
          id: '1',
          name: 'Wireless Bluetooth Headphones',
          description: 'Premium quality wireless headphones with noise cancellation and 30-hour battery life.',
          price: 199.99,
          compareAtPrice: 249.99,
          sku: 'WBH-001',
          inventory: 45,
          sold: 128,
          category: 'Electronics',
          status: 'active',
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
          rating: 4.8,
          reviewCount: 124,
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Organic Cotton T-Shirt',
          description: 'Comfortable and sustainable organic cotton t-shirt available in multiple colors.',
          price: 29.99,
          sku: 'OCT-002',
          inventory: 89,
          sold: 256,
          category: 'Clothing',
          status: 'active',
          imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
          rating: 4.5,
          reviewCount: 78,
          createdAt: '2024-02-10'
        },
        {
          id: '3',
          name: 'Stainless Steel Water Bottle',
          description: 'Eco-friendly stainless steel water bottle with temperature retention for 24 hours.',
          price: 39.99,
          compareAtPrice: 49.99,
          sku: 'SSWB-003',
          inventory: 12,
          sold: 89,
          category: 'Home & Garden',
          status: 'active',
          imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
          rating: 4.7,
          reviewCount: 45,
          createdAt: '2024-03-05'
        },
        {
          id: '4',
          name: 'Smart Fitness Tracker',
          description: 'Advanced fitness tracker with heart rate monitoring and GPS tracking.',
          price: 149.99,
          sku: 'SFT-004',
          inventory: 0,
          sold: 67,
          category: 'Electronics',
          status: 'draft',
          imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400',
          rating: 4.3,
          reviewCount: 32,
          createdAt: '2024-04-12'
        },
        {
          id: '5',
          name: 'Artisan Coffee Beans',
          description: 'Single-origin coffee beans roasted to perfection with notes of chocolate and caramel.',
          price: 24.99,
          sku: 'ACB-005',
          inventory: 156,
          sold: 234,
          category: 'Food & Beverage',
          status: 'active',
          imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
          rating: 4.9,
          reviewCount: 189,
          createdAt: '2024-05-18'
        }
      ];

      setProducts(sampleProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const lowStockProducts = products.filter(p => p.inventory < 20).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.inventory), 0);

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">Manage your product catalog and inventory</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
              title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Product Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">{activeProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">{lowStockProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                <p className="text-2xl font-bold text-gray-900">${totalValue.toFixed(0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search products by name, SKU, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  title="Filter by product status"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                title="Filter by category"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Product Catalog ({filteredProducts.length} products)
            </h3>
          </div>

          {viewMode === 'grid' ? (
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 relative">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' :
                        product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{product.name}</h4>
                    <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        {product.compareAtPrice && (
                          <span className="text-sm text-gray-500 line-through ml-1">${product.compareAtPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Stock: {product.inventory}</span>
                      <span>Sold: {product.sold}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {product.imageUrl ? (
                              <img className="h-10 w-10 rounded object-cover" src={product.imageUrl} alt={product.name} />
                            ) : (
                              <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                                <Package className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">${product.price}</div>
                        {product.compareAtPrice && (
                          <div className="text-sm text-gray-500 line-through">${product.compareAtPrice}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${product.inventory < 20 ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                          {product.inventory}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sold}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.status === 'active' ? 'bg-green-100 text-green-800' :
                          product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          className="text-blue-600 hover:text-blue-900 mr-2"
                          title="Edit product"
                          aria-label="Edit product"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-900"
                          title="View product details"
                          aria-label="View product details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Your product catalog will appear here.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductsPage;