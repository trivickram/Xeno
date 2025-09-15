import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../components/DashboardLayout';
import { Users, Search, Filter, Mail, Phone, MapPin, DollarSign, ShoppingBag, Calendar } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  totalSpent: number;
  ordersCount: number;
  lastOrderDate: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

const CustomersPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }

    loadCustomers();
  }, [user, authLoading, router]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      
      // Sample customer data - in real app, this would come from API
      const sampleCustomers: Customer[] = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '+1 (555) 123-4567',
          location: 'New York, NY',
          totalSpent: 1250.75,
          ordersCount: 8,
          lastOrderDate: '2025-09-10',
          status: 'active',
          joinDate: '2024-03-15'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.j@email.com',
          phone: '+1 (555) 987-6543',
          location: 'Los Angeles, CA',
          totalSpent: 890.25,
          ordersCount: 5,
          lastOrderDate: '2025-09-08',
          status: 'active',
          joinDate: '2024-05-22'
        },
        {
          id: '3',
          name: 'Mike Davis',
          email: 'mike.davis@company.com',
          location: 'Chicago, IL',
          totalSpent: 2100.50,
          ordersCount: 12,
          lastOrderDate: '2025-09-12',
          status: 'active',
          joinDate: '2024-01-08'
        },
        {
          id: '4',
          name: 'Emily Wilson',
          email: 'emily.w@example.org',
          phone: '+1 (555) 456-7890',
          location: 'Austin, TX',
          totalSpent: 650.00,
          ordersCount: 3,
          lastOrderDate: '2025-08-28',
          status: 'inactive',
          joinDate: '2024-07-14'
        },
        {
          id: '5',
          name: 'David Brown',
          email: 'david.brown@test.com',
          location: 'Seattle, WA',
          totalSpent: 1800.25,
          ordersCount: 10,
          lastOrderDate: '2025-09-14',
          status: 'active',
          joinDate: '2024-02-29'
        }
      ];

      setCustomers(sampleCustomers);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.ordersCount, 0) || 0;

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
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600 mt-1">Manage your customer relationships and insights</p>
          </div>
        </div>

        {/* Customer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">{activeCustomers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">${avgOrderValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search customers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                title="Filter by customer status"
              >
                <option value="all">All Customers</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Customer List ({filteredCustomers.length} customers)
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Joined {new Date(customer.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center mt-1">
                            <Phone className="h-3 w-3 mr-1 text-gray-400" />
                            {customer.phone}
                          </div>
                        )}
                        {customer.location && (
                          <div className="flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                            {customer.location}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.ordersCount} orders
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${customer.totalSpent.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(customer.lastOrderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        customer.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Customer data will appear here as they place orders.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomersPage;