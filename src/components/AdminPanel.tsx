import { useState, useEffect, useMemo, useRef, type FC } from 'react';
import {
  Package,
  Layers,
  ShoppingBag,
  CreditCard,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Upload,
  Image as ImageIcon,
  X,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import type { Product } from '../data/products.ts';
import { formatPrice } from '../data/products.ts';
import {
  adminLogin,
  adminLogout,
  isUserAdmin,
  getAdminEmail,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminUpdateStock,
  adminFetchOrders,
  adminUpdateOrderStatus,
  fetchAllProducts,
  type OrderRecord,
} from '../services/pocketbase.ts';
import {
  getTransbankConfig,
  saveTransbankConfig,
  type TransbankConfig,
} from '../services/transbank.ts';

interface AdminPanelProps {
  onClose: () => void;
  onRefreshProducts?: () => void;
}

export const AdminPanel: FC<AdminPanelProps> = ({ onClose, onRefreshProducts }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isUserAdmin());
  const [loginEmail, setLoginEmail] = useState<string>('contacto@tiendapetlife.cl');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'products' | 'inventory' | 'orders' | 'transbank'>('products');

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [productSearch, setProductSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Product modal state (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);
  const [productFormError, setProductFormError] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCategory, setFormCategory] = useState<'perros' | 'gatos' | 'snacks' | 'higiene' | 'juguetes' | 'accesorios'>('perros');
  const [formPetType, setFormPetType] = useState<'perro' | 'gato' | 'ambos'>('perro');
  const [formLifeStage, setFormLifeStage] = useState<'cachorro' | 'adulto' | 'senior' | 'todas'>('adulto');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formWeightOrSize, setFormWeightOrSize] = useState('');
  const [formStock, setFormStock] = useState<number>(20);
  const [formInStock, setFormInStock] = useState<boolean>(true);
  const [formSku, setFormSku] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formBenefits, setFormBenefits] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Orders state
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false);
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  // Transbank config state
  const [tbkConfig, setTbkConfig] = useState<TransbankConfig>(getTransbankConfig());
  const [tbkSuccessMsg, setTbkSuccessMsg] = useState<string | null>(null);

  // Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load products on mount
  const loadProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const data = await fetchAllProducts();
      setProducts(data);
    } catch {
      showToast('Error al cargar productos desde la base de datos', 'error');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Load orders on mount or tab change
  const loadOrders = async () => {
    if (!isAuthenticated) return;
    setIsLoadingOrders(true);
    try {
      const res = await adminFetchOrders();
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
    } catch {
      showToast('Error al cargar pedidos', 'error');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
      loadOrders();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated) {
      loadOrders();
    }
  }, [activeTab]);

  // Auth Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    const res = await adminLogin(loginEmail, loginPassword, true);
    setIsLoggingIn(false);

    if (res.success) {
      setIsAuthenticated(true);
      showToast('¡Bienvenido al Panel de Administración PetLife!');
    } else {
      setLoginError(res.error || 'Credenciales inválidas.');
    }
  };

  const handleLogout = () => {
    adminLogout();
    setIsAuthenticated(false);
    showToast('Sesión de administrador cerrada');
  };

  // Open Product Modal (New or Edit)
  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setFormName('');
    setFormBrand('');
    setFormCategory('perros');
    setFormPetType('perro');
    setFormLifeStage('adulto');
    setFormPrice(19900);
    setFormWeightOrSize('');
    setFormStock(25);
    setFormInStock(true);
    setFormSku(`PL-${Math.floor(100 + Math.random() * 900)}`);
    setFormDescription('');
    setFormBenefits('');
    setSelectedImageFile(null);
    setImagePreview(null);
    setProductFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormBrand(p.brand || '');
    setFormCategory(p.category);
    setFormPetType(p.petType);
    setFormLifeStage(p.lifeStage);
    setFormPrice(p.price);
    setFormWeightOrSize(p.weightOrSize || '');
    setFormStock(p.stockCount || 0);
    setFormInStock(p.inStock);
    setFormSku(p.sku || '');
    setFormDescription(p.description || '');
    setFormBenefits((p.benefits || []).join('\n'));
    setSelectedImageFile(null);
    setImagePreview(p.imageUrl);
    setProductFormError(null);
    setIsModalOpen(true);
  };

  // Handle Image File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setProductFormError('El nombre del producto es obligatorio.');
      return;
    }
    if (formPrice <= 0) {
      setProductFormError('El precio debe ser un número mayor a 0.');
      return;
    }

    setIsSavingProduct(true);
    setProductFormError(null);

    const benefitsArray = formBenefits
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);

    const formData = new FormData();
    formData.append('name', formName.trim());
    formData.append('brand', formBrand.trim());
    formData.append('category', formCategory);
    formData.append(
      'categoryLabel',
      formCategory === 'perros'
        ? 'Alimentos Perros'
        : formCategory === 'gatos'
        ? 'Alimentos Gatos'
        : formCategory === 'higiene'
        ? 'Arenas & Higiene'
        : 'Snacks & Premios'
    );
    formData.append('petType', formPetType);
    formData.append('lifeStage', formLifeStage);
    formData.append('price', String(formPrice));
    formData.append('weightOrSize', formWeightOrSize.trim());
    formData.append('stockCount', String(formStock));
    formData.append('inStock', String(formInStock));
    formData.append('sku', formSku.trim());
    formData.append('description', formDescription.trim());
    formData.append('longDescription', formDescription.trim());
    formData.append('benefits', JSON.stringify(benefitsArray));

    if (selectedImageFile) {
      formData.append('image', selectedImageFile);
    }

    try {
      if (editingProduct) {
        const res = await adminUpdateProduct(editingProduct.id, formData);
        if (res.success) {
          showToast(`Producto "${formName}" actualizado con éxito`);
          setIsModalOpen(false);
          await loadProducts();
          onRefreshProducts?.();
        } else {
          setProductFormError(res.error || 'Error al actualizar el producto');
        }
      } else {
        const res = await adminCreateProduct(formData);
        if (res.success) {
          showToast(`Producto "${formName}" creado exitosamente`);
          setIsModalOpen(false);
          await loadProducts();
          onRefreshProducts?.();
        } else {
          setProductFormError(res.error || 'Error al crear el producto');
        }
      }
    } catch (err: any) {
      setProductFormError(err.message || 'Error en la conexión');
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (p: Product) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente "${p.name}"?`)) {
      return;
    }
    const res = await adminDeleteProduct(p.id);
    if (res.success) {
      showToast(`Producto "${p.name}" eliminado`);
      await loadProducts();
      onRefreshProducts?.();
    } else {
      showToast(res.error || 'Error al eliminar producto', 'error');
    }
  };

  // Quick Stock Adjustment
  const handleQuickStock = async (product: Product, delta: number) => {
    const newStock = Math.max(0, (product.stockCount || 0) + delta);
    const newInStock = newStock > 0;

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((item) =>
        item.id === product.id ? { ...item, stockCount: newStock, inStock: newInStock } : item
      )
    );

    const res = await adminUpdateStock(product.id, newStock, newInStock);
    if (!res.success) {
      showToast('Error al actualizar stock', 'error');
      await loadProducts();
    } else {
      onRefreshProducts?.();
    }
  };

  // Quick Toggle inStock
  const handleToggleInStock = async (product: Product) => {
    const newInStock = !product.inStock;
    setProducts((prev) =>
      prev.map((item) => (item.id === product.id ? { ...item, inStock: newInStock } : item))
    );
    const res = await adminUpdateStock(product.id, product.stockCount || 0, newInStock);
    if (!res.success) {
      showToast('Error al cambiar disponibilidad', 'error');
      await loadProducts();
    } else {
      onRefreshProducts?.();
    }
  };

  // Order Status Change
  const handleChangeOrderStatus = async (orderId: string, status: OrderRecord['status']) => {
    const res = await adminUpdateOrderStatus(orderId, status);
    if (res.success) {
      showToast(`Estado del pedido actualizado a: ${status}`);
      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } else {
      showToast('Error al actualizar estado del pedido', 'error');
    }
  };

  // Transbank Save
  const handleSaveTransbank = (e: React.FormEvent) => {
    e.preventDefault();
    saveTransbankConfig(tbkConfig);
    setTbkSuccessMsg('¡Configuración de Transbank guardada con éxito!');
    showToast('Configuración de Transbank actualizada');
    setTimeout(() => setTbkSuccessMsg(null), 4000);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !productSearch.trim() ||
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(productSearch.toLowerCase())) ||
        (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase()));

      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [products, productSearch, selectedCategory]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    if (orderFilter === 'all') return orders;
    return orders.filter((o) => o.status === orderFilter);
  }, [orders, orderFilter]);

  // Overall Stats
  const totalStockCount = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.stockCount || 0), 0);
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => (p.stockCount || 0) < 5).length;
  }, [products]);

  // =========================================================================
  // VIEW: LOGIN MODAL (SI NO ESTÁ AUTENTICADO)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#061F3D]/80 backdrop-blur-md animate-fade-in">
        <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden">
          {/* Top banner decor */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF5200] via-[#FF7A00] to-[#FFA611]" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6 pt-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFF8F5] border border-[#FF5200]/20 flex items-center justify-center mb-3 shadow-xs">
              <ShieldCheck className="w-7 h-7 text-[#FF5200]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#061F3D]">
              Panel de Administración
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Ingresa tus credenciales seguras para administrar PetLife
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1.5">
                Usuario / Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="contacto@tiendapetlife.cl"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF5200] focus:ring-2 focus:ring-[#FF5200]/20 text-xs sm:text-sm font-semibold text-[#061F3D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF5200] focus:ring-2 focus:ring-[#FF5200]/20 text-xs sm:text-sm font-semibold text-[#061F3D]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-full bg-[#FF5200] hover:bg-[#FF6508] text-white font-extrabold text-sm shadow-orange-glow transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2 mt-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verificando acceso...</span>
                </>
              ) : (
                <span>Ingresar al Administrador</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">
              Conexión directa y cifrada a PocketBase sin credenciales expuestas.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: ADMIN DASHBOARD PRINCIPAL
  // =========================================================================
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center space-x-2 animate-bounce-in ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Admin Card */}
      <div className="bg-[#F8FAFC] w-full max-w-7xl h-[95vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white px-4 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFF8F5] border border-[#FF5200]/20 flex items-center justify-center text-[#FF5200] font-black text-lg">
              🐾
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-black text-[#061F3D]">
                  PetLife Admin
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[10px] border border-emerald-200">
                  En Vivo
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Sesión: <span className="font-semibold text-slate-600">{getAdminEmail()}</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs Header */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'products'
                  ? 'bg-white text-[#FF5200] shadow-xs'
                  : 'text-slate-600 hover:text-[#061F3D]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Productos ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'inventory'
                  ? 'bg-white text-[#FF5200] shadow-xs'
                  : 'text-slate-600 hover:text-[#061F3D]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Inventario</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'orders'
                  ? 'bg-white text-[#FF5200] shadow-xs'
                  : 'text-slate-600 hover:text-[#061F3D]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Pedidos ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('transbank')}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'transbank'
                  ? 'bg-white text-[#FF5200] shadow-xs'
                  : 'text-slate-600 hover:text-[#061F3D]'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Transbank Webpay</span>
            </button>
          </nav>

          {/* Actions: View Store & Logout & Close */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-[#061F3D] hover:bg-slate-100 transition-colors flex items-center space-x-1 cursor-pointer"
              title="Volver a la tienda"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Tienda</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Cerrar panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex items-center justify-around bg-white border-b border-slate-200 px-2 py-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap ${
              activeTab === 'products' ? 'bg-[#FF5200] text-white' : 'text-slate-600'
            }`}
          >
            Productos ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap ${
              activeTab === 'inventory' ? 'bg-[#FF5200] text-white' : 'text-slate-600'
            }`}
          >
            Inventario
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap ${
              activeTab === 'orders' ? 'bg-[#FF5200] text-white' : 'text-slate-600'
            }`}
          >
            Pedidos ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('transbank')}
            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap ${
              activeTab === 'transbank' ? 'bg-[#FF5200] text-white' : 'text-slate-600'
            }`}
          >
            Transbank
          </button>
        </div>

        {/* Top Summary Stat Cards */}
        <div className="px-4 sm:px-6 pt-4 pb-2 grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                Total Productos
              </span>
              <p className="text-xl font-black text-[#061F3D]">{products.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF5200]">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                Unidades en Stock
              </span>
              <p className="text-xl font-black text-[#061F3D]">{totalStockCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                Stock Crítico (&lt; 5)
              </span>
              <p className={`text-xl font-black ${lowStockCount > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                {lowStockCount}
              </p>
            </div>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                lowStockCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                Pedidos Registrados
              </span>
              <p className="text-xl font-black text-[#061F3D]">{orders.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* TAB 1: PRODUCTOS (GESTIÓN COMPLETA Y CREACIÓN)                       */}
        {/* ===================================================================== */}
        {activeTab === 'products' && (
          <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden">
            {/* Toolbar */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Buscar por nombre, marca o SKU..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5200]"
                  />
                  {productSearch && (
                    <button
                      onClick={() => setProductSearch('')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#FF5200]"
                >
                  <option value="all">Todas las categorías</option>
                  <option value="perros">Perros</option>
                  <option value="gatos">Gatos</option>
                  <option value="higiene">Arenas & Higiene</option>
                  <option value="snacks">Snacks</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  onClick={loadProducts}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                  title="Recargar productos"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingProducts ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={handleOpenNewProduct}
                  className="py-2.5 px-4 rounded-xl bg-[#FF5200] hover:bg-[#FF6508] text-white font-extrabold text-xs shadow-orange-glow transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Producto</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Producto</th>
                    <th className="py-3 px-3">Categoría</th>
                    <th className="py-3 px-3">Precio (CLP)</th>
                    <th className="py-3 px-3">Presentación</th>
                    <th className="py-3 px-3">Stock</th>
                    <th className="py-3 px-3">Estado</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-[#061F3D]">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-11 h-11 rounded-xl bg-slate-100 p-1 border border-slate-200/60 shrink-0 flex items-center justify-center overflow-hidden">
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.src = '/product-dog-food.jpg';
                              }}
                            />
                          </div>
                          <div className="max-w-xs sm:max-w-md">
                            <span className="font-bold text-xs text-[#061F3D] block truncate">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              SKU: {p.sku || 'N/A'} • {p.brand}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 capitalize">
                        {p.category}
                      </td>
                      <td className="py-3 px-3 font-black text-[#061F3D]">
                        {formatPrice(p.price)}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {p.weightOrSize || '-'}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-black ${
                            (p.stockCount || 0) < 5 ? 'text-rose-600' : 'text-[#061F3D]'
                          }`}
                        >
                          {p.stockCount || 0}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            p.inStock
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {p.inStock ? 'Disponible' : 'Agotado'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center space-x-1">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#FF5200] hover:bg-[#FFF8F5] transition-colors"
                            title="Editar producto"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No se encontraron productos con los criterios de búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: INVENTARIO RÁPIDO                                             */}
        {/* ===================================================================== */}
        {activeTab === 'inventory' && (
          <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 mb-4 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-sm text-[#061F3D]">Control Rápido de Stock</h3>
                <p className="text-[11px] text-slate-400">
                  Ajusta existencias y disponibilidad con un clic en tiempo real.
                </p>
              </div>
              <div className="w-64">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Filtrar por nombre o SKU..."
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5200]"
                />
              </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Producto</th>
                    <th className="py-3 px-3">Precio</th>
                    <th className="py-3 px-3">Estado Actual</th>
                    <th className="py-3 px-4 text-center">Ajustar Unidades (+ / -)</th>
                    <th className="py-3 px-4 text-right">Interruptor de Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-[#061F3D]">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={p.imageUrl}
                            alt=""
                            className="w-9 h-9 object-contain rounded-lg bg-slate-50 p-0.5 border border-slate-100 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-xs text-[#061F3D] block truncate max-w-xs sm:max-w-md">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              SKU: {p.sku || '-'} • {p.weightOrSize || '-'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-black text-[#061F3D]">
                        {formatPrice(p.price)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-black text-sm ${
                            (p.stockCount || 0) < 5 ? 'text-rose-600' : 'text-slate-800'
                          }`}
                        >
                          {p.stockCount || 0} un.
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
                          <button
                            onClick={() => handleQuickStock(p, -5)}
                            className="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-black text-[11px] shadow-2xs transition-colors cursor-pointer"
                            title="Restar 5"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleQuickStock(p, -1)}
                            className="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-black text-[11px] shadow-2xs transition-colors cursor-pointer"
                            title="Restar 1"
                          >
                            -1
                          </button>
                          <span className="px-2 font-black text-xs text-[#061F3D]">
                            {p.stockCount || 0}
                          </span>
                          <button
                            onClick={() => handleQuickStock(p, 1)}
                            className="px-2 py-1 rounded-lg bg-white hover:bg-emerald-50 hover:text-emerald-600 text-slate-700 font-black text-[11px] shadow-2xs transition-colors cursor-pointer"
                            title="Sumar 1"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => handleQuickStock(p, 5)}
                            className="px-2 py-1 rounded-lg bg-white hover:bg-emerald-50 hover:text-emerald-600 text-slate-700 font-black text-[11px] shadow-2xs transition-colors cursor-pointer"
                            title="Sumar 5"
                          >
                            +5
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleToggleInStock(p)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            p.inStock
                              ? 'bg-emerald-500 text-white shadow-emerald-500/20 shadow-xs'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {p.inStock ? '✓ En Stock' : '✕ Sin Stock'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: ADMINISTRACIÓN DE PEDIDOS                                     */}
        {/* ===================================================================== */}
        {activeTab === 'orders' && (
          <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden">
            {/* Orders Toolbar */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-500">Filtrar por estado:</span>
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#FF5200]"
                >
                  <option value="all">Todos los estados</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="pagado">Pagado</option>
                  <option value="en_preparacion">En preparación</option>
                  <option value="despachado">Despachado</option>
                  <option value="entregado">Entregado</option>
                </select>
              </div>

              <button
                onClick={loadOrders}
                className="py-1.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                <span>Actualizar pedidos</span>
              </button>
            </div>

            {/* Orders Table */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <tr>
                    <th className="py-3 px-4">N° Pedido</th>
                    <th className="py-3 px-3">Cliente</th>
                    <th className="py-3 px-3">Contacto</th>
                    <th className="py-3 px-3">Total</th>
                    <th className="py-3 px-3">Estado</th>
                    <th className="py-3 px-3">Fecha</th>
                    <th className="py-3 px-4 text-right">Detalle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-[#061F3D]">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-black text-[#FF5200]">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-xs text-[#061F3D] block">
                          {ord.customerName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {ord.customerCity || 'Santiago'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[11px] text-slate-600 block">{ord.customerEmail}</span>
                        <span className="text-[10px] text-slate-400">{ord.customerPhone}</span>
                      </td>
                      <td className="py-3 px-3 font-black text-[#061F3D]">
                        {formatPrice(ord.total)}
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={ord.status}
                          onChange={(e) => handleChangeOrderStatus(ord.id, e.target.value as any)}
                          className={`px-2 py-1 rounded-full text-[10px] font-extrabold border cursor-pointer ${
                            ord.status === 'pagado' || ord.status === 'entregado'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : ord.status === 'despachado' || ord.status === 'en_preparacion'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="pagado">Pagado</option>
                          <option value="en_preparacion">En preparación</option>
                          <option value="despachado">Despachado</option>
                          <option value="entregado">Entregado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-[11px] text-slate-400">
                        {new Date(ord.created).toLocaleDateString('es-CL')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#FF5200] hover:text-white font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Ver ítems
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No hay pedidos registrados en este momento.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 4: CONFIGURACIÓN DE TRANSBANK WEBPAY PLUS                         */}
        {/* ===================================================================== */}
        {activeTab === 'transbank' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-[#FF5200] flex items-center justify-center text-white shadow-xs">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#061F3D]">
                    Configuración Transbank Webpay Plus
                  </h3>
                  <p className="text-xs text-slate-400">
                    Acepta tarjetas de débito (Redcompra), crédito y prepago en Chile.
                  </p>
                </div>
              </div>

              {tbkSuccessMsg && (
                <div className="mb-5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{tbkSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveTransbank} className="space-y-5">
                {/* Environment Selector */}
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-2">
                    Ambiente de Operación
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                        tbkConfig.environment === 'integration'
                          ? 'border-[#FF5200] bg-[#FFF8F5] font-bold text-[#FF5200]'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="tbk-env"
                        className="hidden"
                        checked={tbkConfig.environment === 'integration'}
                        onChange={() => setTbkConfig({ ...tbkConfig, environment: 'integration' })}
                      />
                      <span className="text-xs block">🧪 Pruebas / Integración</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Tarjetas de prueba Transbank
                      </span>
                    </label>

                    <label
                      className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                        tbkConfig.environment === 'production'
                          ? 'border-emerald-500 bg-emerald-50/50 font-bold text-emerald-700'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="tbk-env"
                        className="hidden"
                        checked={tbkConfig.environment === 'production'}
                        onChange={() => setTbkConfig({ ...tbkConfig, environment: 'production' })}
                      />
                      <span className="text-xs block">🚀 Producción Real</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Pagos bancarios chilenos reales
                      </span>
                    </label>
                  </div>
                </div>

                {/* Commerce Code */}
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1.5">
                    Código de Comercio (Commerce Code)
                  </label>
                  <input
                    type="text"
                    required
                    value={tbkConfig.commerceCode}
                    onChange={(e) => setTbkConfig({ ...tbkConfig, commerceCode: e.target.value.trim() })}
                    placeholder="Ej: 597055555532 o el entregado por Transbank"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono font-semibold focus:outline-none focus:border-[#FF5200]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    En ambiente de pruebas puedes usar el código oficial: <code>597055555532</code>
                  </span>
                </div>

                {/* API Key */}
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1.5">
                    API Key Secreta
                  </label>
                  <input
                    type="password"
                    required
                    value={tbkConfig.apiKey}
                    onChange={(e) => setTbkConfig({ ...tbkConfig, apiKey: e.target.value.trim() })}
                    placeholder="Pega aquí la API Key que te entrega Transbank..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono font-semibold focus:outline-none focus:border-[#FF5200]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Nunca compartas esta clave. Se resguarda de forma segura para las transacciones.
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                  <span className="font-extrabold text-[#061F3D] block">
                    ¿Cómo obtener tus credenciales de producción?
                  </span>
                  <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-500">
                    <li>Ingresa a tu portal de clientes de Transbank o Transbank Developers.</li>
                    <li>Solicita la activación de Webpay Plus REST API.</li>
                    <li>Copia tu Código de Comercio y tu API Key generada.</li>
                    <li>Pégalos aquí, selecciona "Producción Real" y guarda los cambios.</li>
                  </ol>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#FF5200] hover:bg-[#FF6508] text-white font-extrabold text-sm shadow-orange-glow transition-all active:scale-95 cursor-pointer"
                >
                  Guardar Configuración de Transbank
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* MODAL: AGREGAR O EDITAR PRODUCTO                                     */}
      {/* ===================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#061F3D]/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 my-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#061F3D] mb-1">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Los cambios se guardarán directamente en la base de datos real de PocketBase.
            </p>

            {productFormError && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{productFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Product Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nombre completo del producto *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej: Bravery Salmon Adult Cat 7kg"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-[#061F3D] focus:outline-none focus:border-[#FF5200]"
                />
              </div>

              {/* Brand & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marca</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="Ej: Bravery, Alaska, Purina"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-[#061F3D] focus:outline-none focus:border-[#FF5200]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-[#061F3D] focus:outline-none focus:border-[#FF5200]"
                  >
                    <option value="perros">Alimentos Perros</option>
                    <option value="gatos">Alimentos Gatos</option>
                    <option value="higiene">Arenas & Higiene</option>
                    <option value="snacks">Snacks & Premios</option>
                    <option value="juguetes">Juguetes</option>
                    <option value="accesorios">Accesorios</option>
                  </select>
                </div>
              </div>

              {/* Pet Type & Life Stage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Mascota</label>
                  <select
                    value={formPetType}
                    onChange={(e) => setFormPetType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-[#061F3D] focus:outline-none focus:border-[#FF5200]"
                  >
                    <option value="perro">🐕 Perro</option>
                    <option value="gato">🐱 Gato</option>
                    <option value="ambos">🐾 Ambos / Roedores</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Etapa de Vida</label>
                  <select
                    value={formLifeStage}
                    onChange={(e) => setFormLifeStage(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-[#061F3D] focus:outline-none focus:border-[#FF5200]"
                  >
                    <option value="adulto">Adulto</option>
                    <option value="cachorro">Cachorro / Kitten</option>
                    <option value="senior">Senior (+7 años)</option>
                    <option value="todas">Todas las edades</option>
                  </select>
                </div>
              </div>

              {/* Price & Weight/Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Precio en Pesos Chilenos (CLP) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    placeholder="Ej: 47900"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-black text-[#061F3D] focus:outline-none focus:border-[#FF5200]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Presentación / Formato
                  </label>
                  <input
                    type="text"
                    value={formWeightOrSize}
                    onChange={(e) => setFormWeightOrSize(e.target.value)}
                    placeholder="Ej: 15 kg, 2 kg, 500 g"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-[#061F3D] focus:outline-none focus:border-[#FF5200]"
                  />
                </div>
              </div>

              {/* Stock Count & InStock Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Cantidad en Stock
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-[#061F3D] focus:outline-none focus:border-[#FF5200]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="PL-001"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-[#061F3D] focus:outline-none focus:border-[#FF5200]"
                  />
                </div>
                <div className="pb-1">
                  <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formInStock}
                      onChange={(e) => setFormInStock(e.target.checked)}
                      className="accent-[#FF5200] w-4 h-4 rounded cursor-pointer"
                    />
                    <span>Producto en Stock</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Descripción detallada del producto..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium text-slate-700 focus:outline-none focus:border-[#FF5200]"
                />
              </div>

              {/* Benefits (one per line) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Beneficios clave (uno por línea)
                </label>
                <textarea
                  rows={2}
                  value={formBenefits}
                  onChange={(e) => setFormBenefits(e.target.value)}
                  placeholder="Carne de vacuno como primer ingrediente&#10;Pelaje brillante y saludable&#10;Digestión óptima"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium text-slate-700 focus:outline-none focus:border-[#FF5200]"
                />
              </div>

              {/* Image Upload Box */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Imagen Principal del Producto
                </label>
                <div className="flex items-center space-x-4 p-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="py-1.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-[#FF5200] text-slate-700 font-bold text-xs flex items-center space-x-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#FF5200]" />
                      <span>{imagePreview ? 'Cambiar imagen' : 'Subir imagen desde tu equipo'}</span>
                    </button>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Formatos recomendados: JPEG, PNG, WEBP (Hasta 5MB).
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-full border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-6 py-2.5 rounded-full bg-[#FF5200] hover:bg-[#FF6508] text-white font-extrabold shadow-orange-glow transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center space-x-2"
                >
                  {isSavingProduct ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Guardando en base de datos...</span>
                    </>
                  ) : (
                    <span>{editingProduct ? 'Guardar Cambios' : 'Crear Producto'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: DETALLE DEL PEDIDO                                            */}
      {/* ===================================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#061F3D]/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 p-6 relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-4">
              <span className="px-2.5 py-1 rounded-full bg-orange-50 text-[#FF5200] font-black text-xs">
                {selectedOrder.orderNumber}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {new Date(selectedOrder.created).toLocaleString('es-CL')}
              </span>
            </div>

            <h3 className="text-lg font-black text-[#061F3D] mb-4">
              Detalle del Pedido
            </h3>

            {/* Customer info */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1 text-xs text-slate-600 mb-4">
              <p className="font-bold text-[#061F3D]">{selectedOrder.customerName}</p>
              <p className="flex items-center space-x-1.5 text-slate-500">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedOrder.customerEmail}</span>
              </p>
              {selectedOrder.customerPhone && (
                <p className="flex items-center space-x-1.5 text-slate-500">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedOrder.customerPhone}</span>
                </p>
              )}
              <p className="flex items-center space-x-1.5 text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedOrder.customerAddress}, {selectedOrder.customerCity || 'Santiago'}</span>
              </p>
            </div>

            {/* Items list */}
            <div className="max-h-48 overflow-y-auto space-y-2 mb-4">
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                  <div className="max-w-[240px] truncate">
                    <span className="font-bold text-[#061F3D] block truncate">{item.name}</span>
                    <span className="text-[10px] text-slate-400">Cant: {item.quantity} • {formatPrice(item.price)} c/u</span>
                  </div>
                  <span className="font-black text-[#061F3D]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between mb-4">
              <span className="font-bold text-slate-600 text-xs">Total del pedido:</span>
              <span className="font-black text-lg text-[#061F3D]">{formatPrice(selectedOrder.total)}</span>
            </div>

            {/* Change Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Cambiar estado del pedido:
              </label>
              <div className="grid grid-cols-3 gap-2 text-[11px] font-bold">
                {(['pendiente', 'pagado', 'en_preparacion', 'despachado', 'entregado', 'cancelado'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleChangeOrderStatus(selectedOrder.id, st)}
                    className={`py-1.5 px-2 rounded-xl border capitalize cursor-pointer transition-colors ${
                      selectedOrder.status === st
                        ? 'bg-[#FF5200] text-white border-[#FF5200]'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
