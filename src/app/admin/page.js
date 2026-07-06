'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Lock, Plus, LogOut, Package, ShoppingCart, TrendingUp, AlertTriangle, 
  RefreshCw, Edit3, Trash2, Search, Settings, LayoutDashboard, Clock, 
  Truck, CheckCircle, Users, Eye, Menu, X, ArrowRight, Activity, DollarSign
} from 'lucide-react';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [searchProducts, setSearchProducts] = useState('');
  const [customers, setCustomers] = useState([]);
  const [searchCustomers, setSearchCustomers] = useState('');
  const [abandonedSessions, setAbandonedSessions] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');
  const [chartView, setChartView] = useState('daily'); // daily, weekly, monthly
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Dynamic CRUD Product Form Fields
  const [productForm, setProductForm] = useState({
    title: '', description: '', price: '', mrp: '', discount: '',
    fabric: 'Kanjeevaram Silk', category: 'Sarees', images: '',
    stock: '5', color: 'Red', occasion: 'Wedding', featured: false, isNew: false,
    tags: '', design: '', borderType: '', blouseType: 'Without Blouse', zari: '',
    colorFamily: 'jewel', sizes: '5.5m'
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fabrics = ['Kanjeevaram Silk', 'Banarasi Silk', 'Organza Silk', 'Linen', 'Georgette', 'Chanderi Silk', 'Cotton', 'Chiffon', 'Crepe', 'Net'];
  const categories = ['Sarees', 'Kurtis', 'Dresses', 'Lehengas'];
  const colors = ['Red', 'Gold', 'Purple', 'Green', 'Ivory', 'Blue', 'Pink', 'Orange', 'Yellow', 'Black', 'Peach'];
  const occasions = ['Wedding', 'Festive', 'Party', 'Casual', 'Office Wear'];

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const session = cookies.find(c => c.trim().startsWith('admin_session='));
    if (session && session.split('=')[1] === 'true') {
      setIsLoggedIn(true);
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [pRes, oRes, cRes, aRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/customers'),
        fetch('/api/abandoned-sessions')
      ]);
      const pData = await pRes.json();
      const oData = await oRes.json();
      const cData = await cRes.json();
      const aData = await aRes.json();
      if (pRes.ok) setProducts(pData.products);
      if (oRes.ok) setOrders(oData.orders);
      if (cRes.ok) setCustomers(cData.customers);
      if (aRes.ok) setAbandonedSessions(aData.abandoned || []);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault(); setAuthError('');
    try {
      const res = await fetch('/api/auth/login', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(loginForm) 
      });
      const data = await res.json();
      if (res.ok && data.success) { 
        setIsLoggedIn(true); 
        fetchDashboardData(); 
      } else {
        setAuthError(data.error || 'Invalid credentials.');
      }
    } catch { setAuthError('Authentication failed.'); }
  };

  const handleLogOut = () => {
    document.cookie = 'admin_session=; path=/; max-age=0;';
    setIsLoggedIn(false); setProducts([]); setOrders([]); setCustomers([]); setAbandonedSessions([]);
  };

  const handleMarkSessionRecovered = async (sessionId) => {
    try {
      const res = await fetch('/api/abandoned-sessions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sessionId, recovered: true })
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) { console.error(err); }
  };

  const resetForm = () => {
    setProductForm({
      title: '', description: '', price: '', mrp: '', discount: '',
      fabric: 'Kanjeevaram Silk', category: 'Sarees', images: '',
      stock: '5', color: 'Red', occasion: 'Wedding', featured: false, isNew: false,
      tags: '', design: '', borderType: '', blouseType: 'Without Blouse', zari: '',
      colorFamily: 'jewel', sizes: '5.5m'
    });
    setShowProductForm(false); setEditingProductId(null); setFormError(''); setFormSuccess('');
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault(); setFormError(''); setFormSuccess('');
    if (!productForm.title || !productForm.price || !productForm.images) { 
      setFormError('Title, Price, and Image path are required fields.'); 
      return; 
    }
    
    // Automatically calculate discount percentage if compare-at price (mrp) is provided
    let finalForm = { ...productForm };
    if (finalForm.mrp && parseFloat(finalForm.mrp) > parseFloat(finalForm.price)) {
      finalForm.discount = String(Math.round(((parseFloat(finalForm.mrp) - parseFloat(finalForm.price)) / parseFloat(finalForm.mrp)) * 100));
    }

    try {
      const isEditing = editingProductId !== null;
      const res = await fetch(isEditing ? `/api/products/${editingProductId}` : '/api/products', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalForm)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to save product');
      setFormSuccess(isEditing ? 'Product updated successfully!' : 'Product added successfully!');
      resetForm(); fetchDashboardData();
    } catch (err) { setFormError(err.message); }
  };

  const handleLoadEdit = (p) => {
    setEditingProductId(p.id);
    setProductForm({
      title: p.title, description: p.description, price: String(p.price),
      mrp: p.mrp ? String(p.mrp) : '', discount: p.discount ? String(p.discount) : '',
      fabric: p.fabric, category: p.category, images: p.images,
      stock: String(p.stock), color: p.color, occasion: p.occasion,
      featured: p.featured, isNew: p.isNew || false, tags: p.tags || '',
      design: p.design || '', borderType: p.borderType || '',
      blouseType: p.blouseType || 'Without Blouse', zari: p.zari || '',
      colorFamily: p.colorFamily || 'jewel', sizes: p.sizes || '5.5m'
    });
    setShowProductForm(true);
    // Smooth scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you absolutely sure you want to delete this product? This action cannot be undone.')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) fetchDashboardData();
  };

  const handleUpdateOrderStatus = async (id, status) => {
    const res = await fetch(`/api/orders/${id}`, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ status }) 
    });
    if (res.ok) fetchDashboardData();
  };

  // Computations
  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
  const totalOrders = orders.length;
  const totalUsers = customers.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const lowStockProducts = products.filter(p => p.stock <= 3);
  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchProducts.toLowerCase()) ||
    p.fabric.toLowerCase().includes(searchProducts.toLowerCase())
  );
  
  const filteredOrders = orderFilter === 'all' ? orders : orders.filter(o => o.status === orderFilter);

  // Dynamic LTV calculator for customers
  const getCustomerLTV = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return orders
      .filter(o => o.customerPhone.replace(/\D/g, '') === cleanPhone)
      .reduce((sum, o) => sum + o.totalAmount, 0);
  };

  const getCustomerOrderCount = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return orders.filter(o => o.customerPhone.replace(/\D/g, '') === cleanPhone).length;
  };

  // Dynamic sorted activities feed
  const getRecentActivities = () => {
    const items = [
      ...orders.map(o => ({
        id: `ord-${o.id}`,
        type: 'order',
        text: `New order #${o.id.slice(0, 8)} placed by ${o.customerName} for ₹${o.totalAmount.toLocaleString('en-IN')}`,
        time: new Date(o.createdAt)
      })),
      ...customers.map(c => ({
        id: `cust-${c.id}`,
        type: 'user',
        text: `Customer ${c.name || 'Anonymous'} (+91 ${c.phone}) registered for boutique access`,
        time: new Date(c.createdAt)
      })),
      ...abandonedSessions.map(s => ({
        id: `aband-${s.id}`,
        type: 'abandoned',
        text: `Browse abandoned by ${s.name || 'Anonymous'} (+91 ${s.phone}) on "${s.productTitle}"`,
        time: new Date(s.createdAt)
      }))
    ];
    return items.sort((a, b) => b.time - a.time).slice(0, 5);
  };

  // CSS Chart Data calculator
  const getChartData = () => {
    const data = [];
    const now = new Date();

    if (chartView === 'daily') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dayLabel = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
        const daySum = orders
          .filter(o => new Date(o.createdAt).toDateString() === d.toDateString())
          .reduce((sum, o) => sum + o.totalAmount, 0);
        data.push({ label: dayLabel, value: daySum });
      }
    } else if (chartView === 'weekly') {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const weekSum = orders
          .filter(o => {
            const diff = now - new Date(o.createdAt);
            const daysDiff = diff / (1000 * 60 * 60 * 24);
            return daysDiff >= i * 7 && daysDiff < (i + 1) * 7;
          })
          .reduce((sum, o) => sum + o.totalAmount, 0);
        data.push({ label: `Wk ${4 - i}`, value: weekSum });
      }
    } else {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(now.getMonth() - i);
        const monthLabel = d.toLocaleDateString('en-IN', { month: 'short' });
        const monthSum = orders
          .filter(o => {
            const oDate = new Date(o.createdAt);
            return oDate.getMonth() === d.getMonth() && oDate.getFullYear() === d.getFullYear();
          })
          .reduce((sum, o) => sum + o.totalAmount, 0);
        data.push({ label: monthLabel, value: monthSum });
      }
    }

    return data;
  };

  const chartData = getChartData();
  const maxChartValue = Math.max(...chartData.map(d => d.value), 1000);

  if (!isLoggedIn) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginLogo}>V</div>
          <h1 className={styles.loginTitle}>Vedhika Thread Affairs</h1>
          <p className={styles.loginSubtitle}>Boutique Administrative Portal</p>
          {authError && <div className={styles.alertError}>{authError}</div>}
          <form onSubmit={handleLoginSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Username</label>
              <input type="text" required className={styles.formInput} value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} placeholder="admin" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Password</label>
              <input type="password" required className={styles.formInput} value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} placeholder="••••••••" />
            </div>
            <button type="submit" className={styles.loginBtn}>Sign In to Control Center</button>
          </form>
          <p className={styles.loginNote}>🔒 Authorized personnel access credentials required</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { key: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { key: 'inventory', label: 'Products', icon: <Package size={18} /> },
    { key: 'orders', label: 'Order Pipeline', icon: <ShoppingCart size={18} /> },
    { key: 'customers', label: 'Customers & LTV', icon: <Users size={18} /> },
    { key: 'abandoned', label: 'Browse Abandoned', icon: <Clock size={18} /> },
  ];

  return (
    <div className={styles.adminLayout}>
      
      {/* Sidebar Navigation */}
      <aside className={`${styles.sidebar} ${mobileSidebarOpen ? styles.sidebarMobileOpen : ''}`}>
        <div className={styles.sidebarHeaderRow}>
          <div className={styles.sidebarLogo}>
            <span className={styles.sidebarLogoIcon}>V</span>
            <span>Vedhika Admin</span>
          </div>
          <button className={styles.closeSidebarBtn} onClick={() => setMobileSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          {sidebarItems.map(item => (
            <button key={item.key}
              className={`${styles.sidebarNavItem} ${activeTab === item.key ? styles.sidebarNavItemActive : ''}`}
              onClick={() => {
                setActiveTab(item.key);
                setMobileSidebarOpen(false);
              }}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={handleLogOut} className={styles.logoutBtn}><LogOut size={16} /> Sign Out</button>
        </div>
      </aside>

      {/* Main Admin Page Container */}
      <div className={styles.content}>
        
        {/* Sticky Header Top Row */}
        <header className={styles.adminHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className={styles.hamburgerBtn} onClick={() => setMobileSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <span className={styles.headerDate}>🗓️ Control Center • {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={fetchDashboardData} className={styles.headerActionBtn} title="Force reload database cache">
              <RefreshCw size={16} className={isLoading ? styles.spinning : ''} /> Refresh
            </button>
            <button onClick={handleLogOut} className={styles.headerLogoutBtn}>Logout</button>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className={styles.contentInner}>
          {isLoading && <div className={styles.loaderBar}>Synchronizing database items...</div>}

          {/* Tab 1: OVERVIEW DASHBOARD */}
          {!isLoading && activeTab === 'dashboard' && (
            <>
              {/* KPIs Metric Grid */}
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricLabel}>Total Revenue</span>
                    <span className={styles.trendIndicator}>+11.4% vs last month</span>
                  </div>
                  <span className={styles.metricValue}>₹{totalRevenue.toLocaleString('en-IN')}</span>
                  <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: '78%', background: '#ab8c52' }} /></div>
                </div>

                <div className={styles.metricCard}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricLabel}>Total Orders</span>
                    <span className={styles.trendIndicator}>+6.2% vs last month</span>
                  </div>
                  <span className={styles.metricValue}>{totalOrders}</span>
                  <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: '64%', background: '#54a0ff' }} /></div>
                </div>

                <div className={styles.metricCard}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricLabel}>Registered Sign-Ups</span>
                    <span className={styles.trendIndicator}>+14.8% vs last month</span>
                  </div>
                  <span className={styles.metricValue}>{totalUsers}</span>
                  <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: '85%', background: '#10ac84' }} /></div>
                </div>

                <div className={styles.metricCard}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricLabel}>Average Order Value (AOV)</span>
                    <span className={styles.trendIndicator}>+3.4% vs last month</span>
                  </div>
                  <span className={styles.metricValue}>₹{Math.round(avgOrderValue).toLocaleString('en-IN')}</span>
                  <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: '70%', background: '#ee5253' }} /></div>
                </div>
              </div>

              {/* Chart & Live Activity Feed Layout Split Grid */}
              <div className={styles.dashboardSplitGrid}>
                {/* Visual Performance Chart */}
                <div className={styles.panelCard}>
                  <div className={styles.panelHeader}>
                    <h3 className={styles.panelTitle}>Sales Performance</h3>
                    <div className={styles.chartToggleBtnRow}>
                      {['daily', 'weekly', 'monthly'].map(view => (
                        <button 
                          key={view} 
                          className={`${styles.chartToggleBtn} ${chartView === view ? styles.chartToggleBtnActive : ''}`}
                          onClick={() => setChartView(view)}
                        >
                          {view.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.chartVisualContainer}>
                    <div className={styles.chartBarsWrap}>
                      {chartData.map((item, idx) => (
                        <div key={idx} className={styles.chartCol}>
                          <div className={styles.chartBarValue}>₹{Math.round(item.value).toLocaleString('en-IN')}</div>
                          <div className={styles.chartBarOuter}>
                            <div 
                              className={styles.chartBarFill} 
                              style={{ height: `${(item.value / maxChartValue) * 80 + 5}%` }}
                            />
                          </div>
                          <div className={styles.chartBarLabel}>{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent live activities log feed */}
                <div className={styles.panelCard}>
                  <div className={styles.panelHeader}>
                    <h3 className={styles.panelTitle}>Live Activity Feed</h3>
                    <Activity size={16} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div className={styles.activityFeedList}>
                    {getRecentActivities().map(act => (
                      <div key={act.id} className={styles.activityItem}>
                        <div className={`${styles.activityDot} ${
                          act.type === 'order' ? styles.dotOrder : act.type === 'user' ? styles.dotUser : styles.dotAbandoned
                        }`} />
                        <div className={styles.activityItemContent}>
                          <span className={styles.activityText}>{act.text}</span>
                          <span className={styles.activityTime}>{act.time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} • {act.time.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                      </div>
                    ))}
                    {getRecentActivities().length === 0 && (
                      <div className={styles.emptyStateContainer} style={{ padding: '40px 0' }}>
                        <span>No recent store actions logged yet.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick warning list of products running low on stock */}
              {lowStockProducts.length > 0 && (
                <div className={styles.alertPanel} style={{ marginTop: '24px' }}>
                  <AlertTriangle size={18} style={{ color: '#ff9f43', marginRight: '10px' }} />
                  <span><strong>Low Stock Alert:</strong> There are {lowStockProducts.length} items running low on inventory (3 or fewer items left).</span>
                  <button className={styles.alertActionLink} onClick={() => { setActiveTab('inventory'); setSearchProducts(''); }}>Update Inventory</button>
                </div>
              )}
            </>
          )}

          {/* Tab 2: PRODUCTS CATALOG CRUD */}
          {!isLoading && activeTab === 'inventory' && (
            <>
              <div className={styles.pageHeader}>
                <div>
                  <h1 className={styles.pageTitle}>Product Catalog Management</h1>
                  <p className={styles.pageSubtitle}>{products.length} design items currently saved in database</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div className={styles.searchWrap}>
                    <Search size={16} className={styles.searchIcon} />
                    <input 
                      className={styles.searchBar} 
                      placeholder="Search sarees, kurtis, craft..." 
                      value={searchProducts} 
                      onChange={e => setSearchProducts(e.target.value)} 
                    />
                  </div>
                  <button onClick={() => { showProductForm ? resetForm() : setShowProductForm(true); }} className={styles.addBtn}>
                    {showProductForm ? '✕ Close Form' : '+ Add New Product'}
                  </button>
                </div>
              </div>

              {/* Dynamic Product Form */}
              {showProductForm && (
                <div className={styles.formSection}>
                  <h3 className={styles.formSectionTitle}>{editingProductId ? '✏️ Edit Product Details' : '🧵 Create New Handloom Saree'}</h3>
                  {formError && <div className={styles.alertError}>{formError}</div>}
                  {formSuccess && <div className={styles.alertSuccess}>{formSuccess}</div>}
                  
                  <form onSubmit={handleProductSubmit}>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroupFull}>
                        <label className={styles.formLabel}>Product Title *</label>
                        <input className={styles.formInput} required placeholder="e.g. Classic Crimson Kanjeevaram Silk" value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})} />
                      </div>
                      
                      <div className={styles.formGroupFull}>
                        <label className={styles.formLabel}>Description *</label>
                        <textarea className={styles.formTextarea} rows={3} required placeholder="Write history of weave, borders, body design..." value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                      </div>

                      <div className={styles.formGroupFull}>
                        <label className={styles.formLabel}>Detailed Fabric Care instructions</label>
                        <textarea className={styles.formTextarea} rows={2} placeholder="e.g. Dry clean only. Wrap in muslin cloth to preserve gold zari threads." value={productForm.tags} onChange={e => setProductForm({...productForm, tags: e.target.value})} />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Boutique Selling Price (₹) *</label>
                        <input type="number" className={styles.formInput} required placeholder="e.g. 12500" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Compare-at MRP Price (₹) (For Discount tag)</label>
                        <input type="number" className={styles.formInput} placeholder="e.g. 14900" value={productForm.mrp} onChange={e => setProductForm({...productForm, mrp: e.target.value})} />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Available Stock count *</label>
                        <input type="number" className={styles.formInput} required placeholder="e.g. 5" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Category</label>
                        <select className={styles.formInput} value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                          {categories.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Fabric (Craft Type) *</label>
                        <select className={styles.formInput} value={productForm.fabric} onChange={e => setProductForm({...productForm, fabric: e.target.value})}>
                          {fabrics.map(f => <option key={f}>{f}</option>)}
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Zari Type</label>
                        <input className={styles.formInput} placeholder="e.g. Gold Zari, Silver Zari" value={productForm.zari} onChange={e => setProductForm({...productForm, zari: e.target.value})} />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Border Design</label>
                        <input className={styles.formInput} placeholder="e.g. Temple Border, Kaddi Border" value={productForm.borderType} onChange={e => setProductForm({...productForm, borderType: e.target.value})} />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Blouse Option</label>
                        <select className={styles.formInput} value={productForm.blouseType} onChange={e => setProductForm({...productForm, blouseType: e.target.value})}>
                          <option>Without Blouse</option>
                          <option>Running Blouse</option>
                          <option>Readymade Blouse</option>
                          <option>Unstitched Blouse</option>
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Available Sizing tag</label>
                        <input className={styles.formInput} placeholder="e.g. 5.5m (Saree) or S, M, L (Kurtis)" value={productForm.sizes} onChange={e => setProductForm({...productForm, sizes: e.target.value})} />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Color Hue</label>
                        <select className={styles.formInput} value={productForm.color} onChange={e => setProductForm({...productForm, color: e.target.value})}>
                          {colors.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Occasion Wear</label>
                        <select className={styles.formInput} value={productForm.occasion} onChange={e => setProductForm({...productForm, occasion: e.target.value})}>
                          {occasions.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>

                      {/* Mock drag & drop multiple image area */}
                      <div className={styles.formGroupFull}>
                        <label className={styles.formLabel}>Image URLs (Comma separated list) *</label>
                        <div className={styles.mockUploadBox}>
                          <span className={styles.mockUploadText}>📁 Click or Drag files here to upload (Or paste image paths below)</span>
                        </div>
                        <input className={styles.formInput} required placeholder="/images/saree-crimson.webp, /images/saree-crimson-detail.webp" value={productForm.images} onChange={e => setProductForm({...productForm, images: e.target.value})} />
                      </div>

                      {/* SEO meta configuration */}
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>SEO Meta Title</label>
                        <input className={styles.formInput} placeholder="Vedhika | Crimson Saree Preview" value={productForm.design} onChange={e => setProductForm({...productForm, design: e.target.value})} />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>SEO Meta Description</label>
                        <input className={styles.formInput} placeholder="Exquisite Crimson Red Kanjeevaram Handloom..." value={productForm.colorFamily} onChange={e => setProductForm({...productForm, colorFamily: e.target.value})} />
                      </div>

                      <div className={styles.formGroup} style={{display:'flex',gap:'16px',alignItems:'center',paddingTop:'25px'}}>
                        <label className={styles.checkLabel}>
                          <input type="checkbox" checked={productForm.featured} onChange={e => setProductForm({...productForm, featured: e.target.checked})} /> Featured Product
                        </label>
                        <label className={styles.checkLabel}>
                          <input type="checkbox" checked={productForm.isNew} onChange={e => setProductForm({...productForm, isNew: e.target.checked})} /> New Arrival Strip
                        </label>
                      </div>
                    </div>

                    <div style={{display:'flex',gap:'12px',justifyContent:'flex-end',marginTop:'28px'}}>
                      <button type="button" onClick={resetForm} className={styles.cancelBtn}>Cancel</button>
                      <button type="submit" className={styles.saveBtn}>{editingProductId ? '💾 Save Updates' : '➕ Save Saree'}</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Saree table list */}
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Image</th>
                      <th className={styles.th}>Title</th>
                      <th className={styles.th}>Fabric Type</th>
                      <th className={styles.th}>Boutique Price</th>
                      <th className={styles.th}>Original MRP</th>
                      <th className={styles.th}>Inventory Level</th>
                      <th className={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => {
                      const stockVal = parseInt(p.stock);
                      return (
                        <tr key={p.id} className={styles.tr}>
                          <td className={styles.td}><img src={p.images.split(',')[0]} alt="" className={styles.productThumb} /></td>
                          <td className={styles.td}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <strong>{p.title}</strong>
                              <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
                                {p.featured && <span className={styles.pillLabelActive}>Featured</span>}
                                {p.isNew && <span className={styles.pillLabelNew}>New</span>}
                              </div>
                            </div>
                          </td>
                          <td className={styles.td}>{p.fabric}</td>
                          <td className={styles.td}>₹{p.price.toLocaleString('en-IN')}</td>
                          <td className={styles.td}>{p.mrp ? `₹${p.mrp.toLocaleString('en-IN')}` : '—'}</td>
                          <td className={styles.td}>
                            {stockVal === 0 ? (
                              <span className={`${styles.badgeStock} ${styles.stockOut}`}>Out of Stock</span>
                            ) : stockVal <= 3 ? (
                              <span className={`${styles.badgeStock} ${styles.stockLow}`}>Low Stock ({stockVal})</span>
                            ) : (
                              <span className={`${styles.badgeStock} ${styles.stockIn}`}>In Stock ({stockVal})</span>
                            )}
                          </td>
                          <td className={styles.td}>
                            <div className={styles.actionBtns}>
                              <button className={styles.editBtn} onClick={() => handleLoadEdit(p)}><Edit3 size={14} /></button>
                              <button className={styles.deleteBtn} onClick={() => handleDeleteProduct(p.id)}><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={7} className={styles.td} style={{ textAlign: 'center', padding: '50px' }}>
                          <div className={styles.emptyStateWrap}>
                            <AlertTriangle size={32} style={{ color: 'var(--text-light)', marginBottom: '8px' }} />
                            <span>No product records matching your search queries.</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Tab 3: ORDERS PIPELINE */}
          {!isLoading && activeTab === 'orders' && (
            <>
              <div className={styles.pageHeader}>
                <div>
                  <h1 className={styles.pageTitle}>Order Fulfillment Pipeline</h1>
                  <p className={styles.pageSubtitle}>{orders.length} total boutique sales registered</p>
                </div>
              </div>

              {/* Status Tabs */}
              <div className={styles.filterTabs}>
                {['all', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(f => (
                  <button 
                    key={f} 
                    className={`${styles.filterTab} ${orderFilter === f ? styles.filterTabActive : ''}`} 
                    onClick={() => setOrderFilter(f)}
                  >
                    {f === 'all' ? 'All Orders' : f} ({orders.filter(o => f === 'all' ? true : o.status === f).length})
                  </button>
                ))}
              </div>

              {/* Orders table */}
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Order ID</th>
                      <th className={styles.th}>Date</th>
                      <th className={styles.th}>Customer Details</th>
                      <th className={styles.th}>Items Count</th>
                      <th className={styles.th}>Bill Total</th>
                      <th className={styles.th}>Pipeline Status</th>
                      <th className={styles.th}>Customer Chat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(o => {
                      let items = [];
                      try { items = JSON.parse(o.items); } catch {}
                      return (
                        <tr key={o.id} className={styles.tr}>
                          <td className={styles.td}><code>{o.id.slice(0, 8).toUpperCase()}</code></td>
                          <td className={styles.td}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                          <td className={styles.td}>
                            <strong>{o.customerName}</strong><br />
                            <small style={{ color: 'var(--text-muted)' }}>Phone: {o.customerPhone}</small><br />
                            <small style={{ color: 'var(--text-muted)' }}>Email: {o.customerEmail}</small>
                          </td>
                          <td className={styles.td}>{items.length} Saree{items.length !== 1 ? 's' : ''}</td>
                          <td className={styles.td}><strong>₹{o.totalAmount.toLocaleString('en-IN')}</strong></td>
                          <td className={styles.td}>
                            <select 
                              value={o.status} 
                              onChange={e => handleUpdateOrderStatus(o.id, e.target.value)} 
                              className={`${styles.statusSelect} ${
                                o.status === 'Pending' ? styles.statusSelectPending :
                                o.status === 'Processing' ? styles.statusSelectProcessing :
                                o.status === 'Shipped' ? styles.statusSelectShipped :
                                o.status === 'Delivered' ? styles.statusSelectDelivered :
                                styles.statusSelectCancelled
                              }`}
                            >
                              <option>Pending</option>
                              <option>Processing</option>
                              <option>Shipped</option>
                              <option>Delivered</option>
                              <option>Cancelled</option>
                            </select>
                          </td>
                          <td className={styles.td}>
                            <a 
                              href={`https://wa.me/91${o.customerPhone.replace(/[^0-9]/g,'')}?text=Hi ${o.customerName}, your Vedhika Thread Affairs order ${o.id.slice(0,8).toUpperCase()} status is currently updated to: ${o.status}.`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className={styles.chatActionBtn}
                            >
                              💬 WhatsApp
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={7} className={styles.td} style={{ textAlign: 'center', padding: '50px' }}>
                          <div className={styles.emptyStateWrap}>
                            <AlertTriangle size={32} style={{ color: 'var(--text-light)', marginBottom: '8px' }} />
                            <span>No sales orders found under the "{orderFilter}" status filter.</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Tab 4: CUSTOMERS & LIFETIME VALUE REGISTRY */}
          {!isLoading && activeTab === 'customers' && (
            <>
              <div className={styles.pageHeader}>
                <div>
                  <h1 className={styles.pageTitle}>Registered Customer Registry</h1>
                  <p className={styles.pageSubtitle}>{customers.length} signed up accounts for exclusive previews</p>
                </div>
                <div className={styles.searchWrap}>
                  <Search size={16} className={styles.searchIcon} />
                  <input 
                    className={styles.searchBar} 
                    placeholder="Search customer phone..." 
                    value={searchCustomers} 
                    onChange={e => setSearchCustomers(e.target.value)} 
                  />
                </div>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Customer ID</th>
                      <th className={styles.th}>Customer Details</th>
                      <th className={styles.th}>Join Date</th>
                      <th className={styles.th}>Total Orders</th>
                      <th className={styles.th}>Lifetime Value (LTV)</th>
                      <th className={styles.th}>Status</th>
                      <th className={styles.th}>Chat preview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers
                      .filter(c => c.phone.includes(searchCustomers) || (c.name && c.name.toLowerCase().includes(searchCustomers.toLowerCase())))
                      .map(c => {
                        const ltv = getCustomerLTV(c.phone);
                        return (
                          <tr key={c.id} className={styles.tr}>
                            <td className={styles.td}><code>{c.id.slice(0, 8).toUpperCase()}</code></td>
                            <td className={styles.td}>
                              <strong>{c.name || 'Anonymous User'}</strong><br />
                              <small style={{ color: 'var(--text-muted)' }}>+91 {c.phone}</small>
                            </td>
                            <td className={styles.td}>{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                            <td className={styles.td}>{getCustomerOrderCount(c.phone)} order{getCustomerOrderCount(c.phone) !== 1 ? 's' : ''}</td>
                            <td className={styles.td}><strong style={{ color: ltv > 0 ? '#10ac84' : 'inherit' }}>₹{ltv.toLocaleString('en-IN')}</strong></td>
                            <td className={styles.td}>
                              {ltv > 20000 ? (
                                <span className={styles.pillLabelActive}>VIP Patron</span>
                              ) : ltv > 0 ? (
                                <span className={styles.pillLabelNew}>Active Buyer</span>
                              ) : (
                                <span className={styles.pillLabelMuted}>Registered</span>
                              )}
                            </td>
                            <td className={styles.td}>
                              <a 
                                href={`https://wa.me/91${c.phone.replace(/[^0-9]/g,'')}?text=Hi ${c.name || ''}, thank you for registering with Vedhika Thread Affairs.`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className={styles.chatActionBtn}
                              >
                                WhatsApp
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    {customers.length === 0 && (
                      <tr>
                        <td colSpan={7} className={styles.td} style={{ textAlign: 'center', padding: '50px' }}>
                          <div className={styles.emptyStateWrap}>
                            <AlertTriangle size={32} style={{ color: 'var(--text-light)', marginBottom: '8px' }} />
                            <span>No customer accounts registered in database yet.</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Tab 5: BROWSE ABANDONED RECOVERY */}
          {!isLoading && activeTab === 'abandoned' && (
            <>
              <div className={styles.pageHeader}>
                <div>
                  <h1 className={styles.pageTitle}>Browse Abandonment & Cart Recovery</h1>
                  <p className={styles.pageSubtitle}>Customers who left without placing an order after looking at sarees</p>
                </div>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Saree Thumb</th>
                      <th className={styles.th}>Customer</th>
                      <th className={styles.th}>Stopped At (Product)</th>
                      <th className={styles.th}>Activity Logged</th>
                      <th className={styles.th}>Fulfillment Status</th>
                      <th className={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {abandonedSessions.map(session => (
                      <tr key={session.id} className={styles.tr}>
                        <td className={styles.td}>
                          <img 
                            src={session.productImage} 
                            alt="" 
                            className={styles.productThumb} 
                            style={{ width: '42px', height: '54px', objectFit: 'cover', borderRadius: '2px' }} 
                          />
                        </td>
                        <td className={styles.td}>
                          <strong>{session.name || 'Anonymous Customer'}</strong><br />
                          <small style={{ color: 'var(--text-muted)' }}>+91 {session.phone}</small>
                        </td>
                        <td className={styles.td}>
                          <strong>{session.productTitle}</strong><br />
                          <small style={{ color: 'var(--text-muted)' }}>ID: <code>{session.productId.slice(0, 8).toUpperCase()}</code></small>
                        </td>
                        <td className={styles.td}>
                          {new Date(session.createdAt).toLocaleDateString('en-IN')} <br />
                          <small style={{ color: 'var(--text-muted)' }}>{new Date(session.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</small>
                        </td>
                        <td className={styles.td}>
                          {session.recovered ? (
                            <span className={styles.pillLabelActive}>Auto Recovery Sent</span>
                          ) : (
                            <span className={styles.pillLabelMuted}>Not Notified</span>
                          )}
                        </td>
                        <td className={styles.td}>
                          {!session.recovered ? (
                            <button 
                              onClick={() => handleMarkSessionRecovered(session.id)}
                              className={styles.recoverActionBtn}
                            >
                              Dispatch Recovery WhatsApp
                            </button>
                          ) : (
                            <span style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>Notified ✓</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {abandonedSessions.length === 0 && (
                      <tr>
                        <td colSpan={6} className={styles.td} style={{ textAlign: 'center', padding: '50px' }}>
                          <div className={styles.emptyStateWrap}>
                            <CheckCircle size={32} style={{ color: '#10ac84', marginBottom: '8px' }} />
                            <span>No abandoned browse sessions currently waiting. All buyers finalized orders!</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
