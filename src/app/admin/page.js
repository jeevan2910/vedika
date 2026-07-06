'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Plus, LogOut, Package, ShoppingCart, TrendingUp, AlertTriangle, RefreshCw, Edit3, Trash2, Search, Settings, LayoutDashboard, Clock, Truck, CheckCircle, Users } from 'lucide-react';
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
  const [productForm, setProductForm] = useState({
    title: '', description: '', price: '', mrp: '', discount: '',
    fabric: 'Kanjeevaram Silk', category: 'Bridal', images: '',
    stock: '5', color: 'Red', occasion: 'Wedding',
    featured: false, isNew: false, tags: ''
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fabrics = ['Kanjeevaram Silk', 'Banarasi Silk', 'Organza Silk', 'Linen', 'Georgette', 'Chanderi Silk', 'Cotton', 'Chiffon', 'Crepe', 'Net'];
  const categories = ['Bridal', 'Festive', 'Casual', 'Party', 'Office Wear'];
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
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginForm) });
      const data = await res.json();
      if (res.ok && data.success) { setIsLoggedIn(true); fetchDashboardData(); }
      else setAuthError(data.error || 'Invalid credentials.');
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
    setProductForm({ title: '', description: '', price: '', mrp: '', discount: '', fabric: 'Kanjeevaram Silk', category: 'Bridal', images: '', stock: '5', color: 'Red', occasion: 'Wedding', featured: false, isNew: false, tags: '' });
    setShowProductForm(false); setEditingProductId(null); setFormError(''); setFormSuccess('');
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault(); setFormError(''); setFormSuccess('');
    if (!productForm.title || !productForm.price || !productForm.images) { setFormError('Fill required fields.'); return; }
    try {
      const isEditing = editingProductId !== null;
      const res = await fetch(isEditing ? `/api/products/${editingProductId}` : '/api/products', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      setFormSuccess(isEditing ? 'Updated!' : 'Added!');
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
      featured: p.featured, isNew: p.isNew || false, tags: p.tags || ''
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) fetchDashboardData();
  };

  const handleUpdateOrderStatus = async (id, status) => {
    const res = await fetch(`/api/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    if (res.ok) fetchDashboardData();
  };

  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
  const lowStockCount = products.filter(p => p.stock <= 3).length;
  const filteredProducts = products.filter(p => p.title.toLowerCase().includes(searchProducts.toLowerCase()));
  const filteredOrders = orderFilter === 'all' ? orders : orders.filter(o => o.status === orderFilter);

  if (!isLoggedIn) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginLogo}>V</div>
          <h1 className={styles.loginTitle}>Vedhika Thread Affairs</h1>
          <p className={styles.loginSubtitle}>Admin Portal</p>
          {authError && <div className={styles.alertError}>{authError}</div>}
          <form onSubmit={handleLoginSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Username</label>
              <input type="text" required suppressHydrationWarning className={styles.formInput} value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} placeholder="admin" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Password</label>
              <input type="password" required suppressHydrationWarning className={styles.formInput} value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} placeholder="••••••••" />
            </div>
            <button type="submit" className={styles.loginBtn}>Sign In to Dashboard</button>
          </form>
          <p className={styles.loginNote}>Authorized personnel only</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { key: 'inventory', label: 'Products', icon: <Package size={18} /> },
    { key: 'orders', label: 'Orders', icon: <ShoppingCart size={18} /> },
    { key: 'customers', label: 'Customers', icon: <Users size={18} /> },
    { key: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.sidebarLogoIcon}>V</span>
          <span>Vedhika Admin</span>
        </div>
        <nav className={styles.sidebarNav}>
          {sidebarItems.map(item => (
            <button key={item.key}
              className={`${styles.sidebarNavItem} ${activeTab === item.key ? styles.sidebarNavItemActive : ''}`}
              onClick={() => setActiveTab(item.key)}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <button onClick={handleLogOut} className={styles.logoutBtn}><LogOut size={16} /> Log Out</button>
        </div>
      </aside>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.contentInner}>
          {isLoading && <div className={styles.loading}>Loading data...</div>}

          {/* DASHBOARD */}
          {!isLoading && activeTab === 'dashboard' && (
            <>
              <div className={styles.pageHeader}>
                <div>
                  <h1 className={styles.pageTitle}>Dashboard</h1>
                  <p className={styles.pageSubtitle}>Welcome back, Admin</p>
                </div>
                <button onClick={fetchDashboardData} className={styles.refreshBtn}><RefreshCw size={16} /> Refresh</button>
              </div>
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <div className={`${styles.metricIcon} ${styles.metricGold}`}><TrendingUp size={20} /></div>
                  <span className={styles.metricValue}>₹{totalRevenue.toLocaleString('en-IN')}</span>
                  <span className={styles.metricLabel}>Total Revenue</span>
                </div>
                <div className={styles.metricCard}>
                  <div className={`${styles.metricIcon} ${styles.metricBlue}`}><ShoppingCart size={20} /></div>
                  <span className={styles.metricValue}>{orders.length}</span>
                  <span className={styles.metricLabel}>Total Orders</span>
                </div>
                <div className={styles.metricCard}>
                  <div className={`${styles.metricIcon} ${styles.metricGreen}`}><Package size={20} /></div>
                  <span className={styles.metricValue}>{products.length}</span>
                  <span className={styles.metricLabel}>Products</span>
                </div>
                <div className={styles.metricCard}>
                  <div className={`${styles.metricIcon} ${lowStockCount > 0 ? styles.metricRed : styles.metricGray}`}><AlertTriangle size={20} /></div>
                  <span className={styles.metricValue}>{lowStockCount}</span>
                  <span className={styles.metricLabel}>Low Stock</span>
                </div>
              </div>
              <div className={styles.tableWrap}>
                <div className={styles.tableHeader}><h3 className={styles.tableTitle}>Recent Orders</h3></div>
                <table className={styles.table}>
                  <thead><tr><th className={styles.th}>Order ID</th><th className={styles.th}>Customer</th><th className={styles.th}>Amount</th><th className={styles.th}>Status</th><th className={styles.th}>Date</th></tr></thead>
                  <tbody>
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id} className={styles.tr}>
                        <td className={styles.td}><code>{o.id.slice(0, 8)}</code></td>
                        <td className={styles.td}><strong>{o.customerName}</strong><br/><small style={{color:'var(--text-muted)'}}>{o.customerEmail}</small></td>
                        <td className={styles.td}>₹{o.totalAmount.toLocaleString('en-IN')}</td>
                        <td className={styles.td}><span className={`${styles.statusBadge} ${o.status === 'Pending' ? styles.statusPending : o.status === 'Shipped' ? styles.statusShipped : styles.statusDelivered}`}>{o.status}</span></td>
                        <td className={styles.td}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                    {orders.length === 0 && <tr><td colSpan={5} className={styles.td} style={{textAlign:'center',padding:'40px'}}>No orders yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* PRODUCTS */}
          {!isLoading && activeTab === 'inventory' && (
            <>
              <div className={styles.pageHeader}>
                <div>
                  <h1 className={styles.pageTitle}>Products</h1>
                  <p className={styles.pageSubtitle}>{products.length} sarees in catalog</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div className={styles.searchWrap}>
                    <Search size={16} className={styles.searchIcon} />
                    <input className={styles.searchBar} placeholder="Search products..." value={searchProducts} onChange={e => setSearchProducts(e.target.value)} />
                  </div>
                  <button onClick={() => { showProductForm ? resetForm() : setShowProductForm(true); }} className={styles.addBtn}><Plus size={16} /> Add Saree</button>
                </div>
              </div>

              {showProductForm && (
                <div className={styles.formSection}>
                  <h3 className={styles.formSectionTitle}>{editingProductId ? 'Edit Product' : 'Add New Product'}</h3>
                  {formError && <div className={styles.alertError}>{formError}</div>}
                  {formSuccess && <div className={styles.alertSuccess}>{formSuccess}</div>}
                  <form onSubmit={handleProductSubmit}>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroupFull}><label className={styles.formLabel}>Title *</label><input className={styles.formInput} required value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})} /></div>
                      <div className={styles.formGroupFull}><label className={styles.formLabel}>Description</label><textarea className={styles.formTextarea} rows={3} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} /></div>
                      <div className={styles.formGroup}><label className={styles.formLabel}>Price (₹) *</label><input type="number" className={styles.formInput} required value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} /></div>
                      <div className={styles.formGroup}><label className={styles.formLabel}>MRP (₹)</label><input type="number" className={styles.formInput} value={productForm.mrp} onChange={e => setProductForm({...productForm, mrp: e.target.value})} /></div>
                      <div className={styles.formGroup}><label className={styles.formLabel}>Discount (%)</label><input type="number" className={styles.formInput} value={productForm.discount} onChange={e => setProductForm({...productForm, discount: e.target.value})} /></div>
                      <div className={styles.formGroup}><label className={styles.formLabel}>Stock</label><input type="number" className={styles.formInput} value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} /></div>
                      <div className={styles.formGroupFull}><label className={styles.formLabel}>Image Path *</label><input className={styles.formInput} required value={productForm.images} onChange={e => setProductForm({...productForm, images: e.target.value})} /></div>
                      <div className={styles.formGroup}><label className={styles.formLabel}>Fabric</label><select className={styles.formInput} value={productForm.fabric} onChange={e => setProductForm({...productForm, fabric: e.target.value})}>{fabrics.map(f => <option key={f}>{f}</option>)}</select></div>
                      <div className={styles.formGroup}><label className={styles.formLabel}>Category</label><select className={styles.formInput} value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
                      <div className={styles.formGroup}><label className={styles.formLabel}>Color</label><select className={styles.formInput} value={productForm.color} onChange={e => setProductForm({...productForm, color: e.target.value})}>{colors.map(c => <option key={c}>{c}</option>)}</select></div>
                      <div className={styles.formGroup}><label className={styles.formLabel}>Occasion</label><select className={styles.formInput} value={productForm.occasion} onChange={e => setProductForm({...productForm, occasion: e.target.value})}>{occasions.map(o => <option key={o}>{o}</option>)}</select></div>
                      <div className={styles.formGroup}><label className={styles.formLabel}>Tags</label><input className={styles.formInput} value={productForm.tags} onChange={e => setProductForm({...productForm, tags: e.target.value})} placeholder="bestseller,trending" /></div>
                      <div className={styles.formGroup} style={{display:'flex',gap:'16px',alignItems:'center',paddingTop:'20px'}}>
                        <label className={styles.checkLabel}><input type="checkbox" checked={productForm.featured} onChange={e => setProductForm({...productForm, featured: e.target.checked})} /> Featured</label>
                        <label className={styles.checkLabel}><input type="checkbox" checked={productForm.isNew} onChange={e => setProductForm({...productForm, isNew: e.target.checked})} /> New Arrival</label>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:'12px',justifyContent:'flex-end',marginTop:'24px'}}>
                      <button type="button" onClick={resetForm} className={styles.cancelBtn}>Cancel</button>
                      <button type="submit" className={styles.saveBtn}>{editingProductId ? 'Save Changes' : 'Add Product'}</button>
                    </div>
                  </form>
                </div>
              )}

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead><tr><th className={styles.th}>Image</th><th className={styles.th}>Title</th><th className={styles.th}>Fabric</th><th className={styles.th}>Price</th><th className={styles.th}>MRP</th><th className={styles.th}>Stock</th><th className={styles.th}>Tags</th><th className={styles.th}>Actions</th></tr></thead>
                  <tbody>
                    {filteredProducts.map(p => (
                      <tr key={p.id} className={styles.tr}>
                        <td className={styles.td}><img src={p.images.split(',')[0]} alt="" className={styles.productThumb} /></td>
                        <td className={styles.td}><strong>{p.title}</strong>{p.featured && <span className={styles.featuredBadge}>★</span>}{p.isNew && <span className={styles.newBadge}>NEW</span>}</td>
                        <td className={styles.td}>{p.fabric}</td>
                        <td className={styles.td}>₹{p.price.toLocaleString('en-IN')}</td>
                        <td className={styles.td}>{p.mrp ? `₹${p.mrp.toLocaleString('en-IN')}` : '—'}</td>
                        <td className={styles.td}><span style={{color: p.stock <= 3 ? '#d32f2f' : 'inherit', fontWeight: p.stock <= 3 ? 700 : 400}}>{p.stock}</span></td>
                        <td className={styles.td}><span className={styles.tagsPill}>{p.tags || '—'}</span></td>
                        <td className={styles.td}>
                          <div className={styles.actionBtns}>
                            <button className={styles.editBtn} onClick={() => handleLoadEdit(p)}><Edit3 size={14} /></button>
                            <button className={styles.deleteBtn} onClick={() => handleDeleteProduct(p.id)}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ORDERS */}
          {!isLoading && activeTab === 'orders' && (
            <>
              <div className={styles.pageHeader}>
                <div>
                  <h1 className={styles.pageTitle}>Orders</h1>
                  <p className={styles.pageSubtitle}>{orders.length} total orders</p>
                </div>
              </div>
              <div className={styles.filterTabs}>
                {['all', 'Pending', 'Shipped', 'Delivered'].map(f => (
                  <button key={f} className={`${styles.filterTab} ${orderFilter === f ? styles.filterTabActive : ''}`} onClick={() => setOrderFilter(f)}>
                    {f === 'all' ? 'All' : f} {f !== 'all' && `(${orders.filter(o => o.status === f).length})`}
                  </button>
                ))}
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead><tr><th className={styles.th}>ID</th><th className={styles.th}>Customer</th><th className={styles.th}>Items</th><th className={styles.th}>Amount</th><th className={styles.th}>Status</th><th className={styles.th}>Actions</th></tr></thead>
                  <tbody>
                    {filteredOrders.map(o => {
                      let items = [];
                      try { items = JSON.parse(o.items); } catch {}
                      return (
                        <tr key={o.id} className={styles.tr}>
                          <td className={styles.td}><code>{o.id.slice(0, 8)}</code></td>
                          <td className={styles.td}><strong>{o.customerName}</strong><br/><small>{o.customerPhone}</small></td>
                          <td className={styles.td}>{items.length} item{items.length !== 1 ? 's' : ''}</td>
                          <td className={styles.td}><strong>₹{o.totalAmount.toLocaleString('en-IN')}</strong></td>
                          <td className={styles.td}>
                            <select value={o.status} onChange={e => handleUpdateOrderStatus(o.id, e.target.value)} className={`${styles.statusSelect} ${o.status === 'Pending' ? styles.statusPending : o.status === 'Shipped' ? styles.statusShipped : styles.statusDelivered}`}>
                              <option>Pending</option><option>Shipped</option><option>Delivered</option>
                            </select>
                          </td>
                          <td className={styles.td}>
                            <a href={`https://wa.me/${o.customerPhone?.replace(/[^0-9]/g,'')}?text=Hi ${o.customerName}, your order ${o.id.slice(0,8)} from Vedhika Thread Affairs has been updated.`} target="_blank" rel="noopener noreferrer" className={styles.waBtn}>💬</a>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredOrders.length === 0 && <tr><td colSpan={6} className={styles.td} style={{textAlign:'center',padding:'40px'}}>No orders</td></tr>}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* CUSTOMERS */}
          {!isLoading && activeTab === 'customers' && (
            <>
              <div className={styles.pageHeader}>
                <div>
                  <h1 className={styles.pageTitle}>Customers</h1>
                  <p className={styles.pageSubtitle}>{customers.length} registered accounts</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div className={styles.searchWrap}>
                    <Search size={16} className={styles.searchIcon} />
                    <input 
                      className={styles.searchBar} 
                      placeholder="Search name or phone..." 
                      value={searchCustomers} 
                      onChange={e => setSearchCustomers(e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Customer ID</th>
                      <th className={styles.th}>Name</th>
                      <th className={styles.th}>Phone Number</th>
                      <th className={styles.th}>Joined Date</th>
                      <th className={styles.th}>Quick Chat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers
                      .filter(c => 
                        c.phone.includes(searchCustomers) || 
                        (c.name && c.name.toLowerCase().includes(searchCustomers.toLowerCase()))
                      )
                      .map(c => (
                        <tr key={c.id} className={styles.tr}>
                          <td className={styles.td}><code>{c.id.slice(0, 8)}</code></td>
                          <td className={styles.td}><strong>{c.name || '—'}</strong></td>
                          <td className={styles.td}>{c.phone}</td>
                          <td className={styles.td}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                          <td className={styles.td}>
                            <a 
                              href={`https://wa.me/91${c.phone}?text=Hi ${c.name || ''}, thank you for registering with Vedhika Thread Affairs.`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className={styles.waBtn}
                              style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '4px',
                                textDecoration: 'none',
                                background: '#25D366',
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                fontSize: '0.78rem',
                                fontWeight: '600'
                              }}
                            >
                              WhatsApp
                            </a>
                          </td>
                        </tr>
                      ))}
                    {customers.length === 0 && (
                      <tr>
                        <td colSpan={5} className={styles.td} style={{ textAlign: 'center', padding: '40px' }}>
                          No customer accounts found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Browse Abandonment & Cart Recovery Panel */}
              <div className={styles.pageHeader} style={{ marginTop: '48px', borderTop: '1px solid var(--border-light)', paddingTop: '32px' }}>
                <div>
                  <h2 className={styles.pageTitle} style={{ fontSize: '1.4rem' }}>Abandoned Browse Recovery</h2>
                  <p className={styles.pageSubtitle}>Customers who stopped looking at products without placing an order</p>
                </div>
              </div>

              <div className={styles.tableWrap} style={{ marginBottom: '40px' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Image</th>
                      <th className={styles.th}>Customer</th>
                      <th className={styles.th}>Stopped At (Product)</th>
                      <th className={styles.th}>Time Left</th>
                      <th className={styles.th}>Status</th>
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
                            style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '2px' }} 
                          />
                        </td>
                        <td className={styles.td}>
                          <strong>{session.name || 'Anonymous Customer'}</strong><br />
                          <small style={{ color: 'var(--text-muted)' }}>{session.phone}</small>
                        </td>
                        <td className={styles.td}>
                          <strong>{session.productTitle}</strong><br />
                          <small style={{ color: 'var(--text-muted)' }}>ID: <code>{session.productId.slice(0, 8)}</code></small>
                        </td>
                        <td className={styles.td}>
                          {new Date(session.createdAt).toLocaleDateString('en-IN')} <br />
                          <small style={{ color: 'var(--text-muted)' }}>{new Date(session.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</small>
                        </td>
                        <td className={styles.td}>
                          {session.recovered ? (
                            <span 
                              style={{ 
                                display: 'inline-block', 
                                background: '#e6f4ea', 
                                color: '#137333', 
                                padding: '3px 8px', 
                                borderRadius: '12px', 
                                fontSize: '0.7rem', 
                                fontWeight: '700' 
                              }}
                            >
                              Auto-Sent
                            </span>
                          ) : (
                            <span 
                              style={{ 
                                display: 'inline-block', 
                                background: '#fef7e0', 
                                color: '#b06000', 
                                padding: '3px 8px', 
                                borderRadius: '12px', 
                                fontSize: '0.7rem', 
                                fontWeight: '700' 
                              }}
                            >
                              Waiting
                            </span>
                          )}
                        </td>
                        <td className={styles.td}>
                          {session.recovered ? (
                            <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600 }}>
                              ✓ Dispatched by Automation
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                handleMarkSessionRecovered(session.id);
                                const waUrl = `https://wa.me/91${session.phone}?text=Hi ${session.name || ''}, your dress "${session.productTitle}" is waiting! Look it up here: ${window.location.origin}/product/${session.productId}`;
                                window.open(waUrl, '_blank');
                              }}
                              className={styles.addBtn}
                              style={{ 
                                background: '#25D366', 
                                border: 'none', 
                                padding: '6px 12px', 
                                fontSize: '0.78rem',
                                boxShadow: 'none'
                              }}
                            >
                              💬 Send Recovery WhatsApp
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {abandonedSessions.length === 0 && (
                      <tr>
                        <td colSpan={6} className={styles.td} style={{ textAlign: 'center', padding: '40px' }}>
                          No abandoned browse logs yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* SETTINGS */}
          {!isLoading && activeTab === 'settings' && (
            <>
              <div className={styles.pageHeader}>
                <div>
                  <h1 className={styles.pageTitle}>Settings</h1>
                  <p className={styles.pageSubtitle}>Store configuration</p>
                </div>
              </div>
              <div className={styles.settingsGrid}>
                {[
                  { label: 'Store Name', value: 'Vedhika Thread Affairs' },
                  { label: 'WhatsApp', value: '+91 90304 96646' },
                  { label: 'Address', value: 'Bhavanipuram, Vijayawada, AP — 520012' },
                  { label: 'Free Shipping Threshold', value: '₹5,000' },
                  { label: 'Currency', value: 'INR (₹)' },
                  { label: 'Email', value: 'care@vedhikathreads.com' },
                ].map((s, i) => (
                  <div key={i} className={styles.settingCard}>
                    <span className={styles.settingLabel}>{s.label}</span>
                    <span className={styles.settingValue}>{s.value}</span>
                  </div>
                ))}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '16px' }}>Contact support to update these settings.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
