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
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  Check,
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

  // Main navigation view
  // 'dashboard' = lists (products, inventory, orders, transbank)
  // 'product_editor' = FULL-PAGE dedicated product creator/editor
  const [activeView, setActiveView] = useState<'dashboard' | 'product_editor'>('dashboard');
  const [activeTab, setActiveTab] = useState<'products' | 'inventory' | 'orders' | 'transbank'>('products');

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [productSearch, setProductSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Product Form State (Full-Page Editor)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formName, setFormName] = useState<string>('');
  const [formBrand, setFormBrand] = useState<string>('');
  const [formCategory, setFormCategory] = useState<'perros' | 'gatos' | 'higiene' | 'snacks' | 'accesorios'>('perros');
  const [formPrice, setFormPrice] = useState<number>(19900);
  const [formWeightOrSize, setFormWeightOrSize] = useState<string>('');
  const [formStock, setFormStock] = useState<number>(25);
  const [formInStock, setFormInStock] = useState<boolean>(true);
  const [formSku, setFormSku] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [productFormError, setProductFormError] = useState<string | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);
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

  // Load products from PocketBase
  const loadProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const data = await fetchAllProducts();
      setProducts(data);
    } catch {
      showToast('Error al cargar productos desde PocketBase', 'error');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Load orders from PocketBase
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

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    const res = await adminLogin(loginEmail.trim(), loginPassword);
    setIsLoggingIn(false);

    if (res.success) {
      setIsAuthenticated(true);
      showToast('¡Bienvenido al Panel de Administración PetLife!');
      loadProducts();
      loadOrders();
    } else {
      setLoginError(res.error || 'Credenciales incorrectas. Verifica tu contraseña.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    adminLogout();
    setIsAuthenticated(false);
    showToast('Sesión de administrador cerrada');
  };

  // Navigate to Full-Page Editor for New Product
  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setFormName('');
    setFormBrand('');
    setFormCategory('perros');
    setFormPrice(19900);
    setFormWeightOrSize('');
    setFormStock(25);
    setFormInStock(true);
    setFormSku(`PL-${Math.floor(100 + Math.random() * 900)}`);
    setFormDescription('');
    setSelectedImageFile(null);
    setImagePreview(null);
    setProductFormError(null);
    setActiveView('product_editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to Full-Page Editor for Editing Existing Product
  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormBrand(p.brand || '');
    setFormCategory(
      (p.category as any) ||
        (p.name.toLowerCase().includes('gato') || p.petType === 'gato' ? 'gatos' : 'perros')
    );
    setFormPrice(p.price);
    setFormWeightOrSize(p.weightOrSize || '');
    setFormStock(p.stockCount !== undefined ? p.stockCount : 15);
    setFormInStock(p.inStock);
    setFormSku(p.sku || `PL-${p.id.slice(0, 4)}`);
    setFormDescription(p.description || '');
    setSelectedImageFile(null);
    setImagePreview(p.imageUrl);
    setProductFormError(null);
    setActiveView('product_editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      setProductFormError('El precio debe ser un número mayor a $0.');
      return;
    }

    setIsSavingProduct(true);
    setProductFormError(null);

    const formData = new FormData();
    formData.append('name', formName.trim());
    formData.append('brand', formBrand.trim());
    formData.append('category', formCategory);

    const categoryLabel =
      formCategory === 'perros'
        ? 'Alimentos Perros'
        : formCategory === 'gatos'
        ? 'Alimentos Gatos'
        : formCategory === 'higiene'
        ? 'Arenas & Higiene'
        : formCategory === 'snacks'
        ? 'Snacks & Premios'
        : 'Accesorios';
    formData.append('categoryLabel', categoryLabel);

    const inferredPetType =
      formCategory === 'gatos' ? 'gato' : formCategory === 'perros' ? 'perro' : 'ambos';
    formData.append('petType', inferredPetType);
    formData.append('lifeStage', 'adulto');
    formData.append('price', String(formPrice));
    formData.append('weightOrSize', formWeightOrSize.trim());
    formData.append('stockCount', String(formStock));
    formData.append('inStock', String(formInStock));
    formData.append('sku', formSku.trim() || `PL-${Math.floor(100 + Math.random() * 900)}`);
    formData.append('description', formDescription.trim());
    formData.append('benefits', JSON.stringify([]));

    if (selectedImageFile) {
      formData.append('image', selectedImageFile);
    }

    try {
      if (editingProduct) {
        const res = await adminUpdateProduct(editingProduct.id, formData);
        if (res.success) {
          showToast(`Producto "${formName}" actualizado con éxito`);
          setActiveView('dashboard');
          await loadProducts();
          onRefreshProducts?.();
        } else {
          setProductFormError(res.error || 'Error al actualizar el producto');
        }
      } else {
        const res = await adminCreateProduct(formData);
        if (res.success) {
          showToast(`Producto "${formName}" creado exitosamente`);
          setActiveView('dashboard');
          await loadProducts();
          onRefreshProducts?.();
        } else {
          setProductFormError(res.error || 'Error al crear el producto');
        }
      }
    } catch (err: any) {
      setProductFormError(err.message || 'Error en la conexión con PocketBase');
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
      showToast(`Producto "${p.name}" eliminado de la base de datos`);
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
    setTbkSuccessMsg('¡Configuración de Transbank Webpay Plus guardada!');
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
  // VIEW 1: LOGIN A PANTALLA COMPLETA
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-[#061F3D] flex flex-col items-center justify-center p-4 sm:p-6 animate-fade-in">
        <div className="mb-6">
          <button
            onClick={onClose}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer bg-slate-800/90 px-4 py-2 rounded-full border border-slate-700 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Tienda</span>
          </button>
        </div>

        <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF5200] via-[#FF7A00] to-[#FFA611]" />

          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFF8F5] border border-[#FF5200]/20 flex items-center justify-center text-2xl shadow-xs mb-3">
              🐾
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#061F3D]">
              Panel de Control PetLife
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Gestión de productos, inventario real y pedidos en tiempo real
            </p>
          </div>

          {loginError && (
            <div className="mb-5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1.5">
                Correo Administrador
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="contacto@tiendapetlife.cl"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-[#061F3D] focus:outline-none focus:border-[#FF5200] focus:ring-2 focus:ring-[#FF5200]/10 transition-all"
              />
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
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-[#061F3D] focus:outline-none focus:border-[#FF5200] focus:ring-2 focus:ring-[#FF5200]/10 transition-all"
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
  // VIEW 2: EDITOR DE PRODUCTO A PANTALLA COMPLETA (CREAR O EDITAR)
  // =========================================================================
  if (activeView === 'product_editor') {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col animate-fade-in pb-20">
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

        {/* Top Header / Breadcrumbs Bar */}
        <header className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-8 sticky top-0 z-30 shadow-2xs">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setActiveView('dashboard')}
                className="p-2 rounded-xl text-slate-500 hover:text-[#061F3D] hover:bg-slate-100 transition-colors flex items-center space-x-1.5 text-xs font-bold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a Productos</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-black text-[#FF5200] uppercase tracking-wider">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setActiveView('dashboard')}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveProduct}
                disabled={isSavingProduct}
                className="px-5 py-2 rounded-full bg-[#FF5200] hover:bg-[#FF6508] text-white font-extrabold text-xs shadow-orange-glow transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center space-x-1.5"
              >
                {isSavingProduct ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{editingProduct ? 'Guardar Cambios' : 'Crear Producto'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Form Container */}
        <main className="max-w-5xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-[#061F3D]">
              {editingProduct ? `Editar: ${formName || 'Producto'}` : 'Crear Nuevo Producto'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Completa la información esencial. Los datos e imágenes se guardan directamente en PocketBase.
            </p>
          </div>

          {productFormError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
              <span>{productFormError}</span>
            </div>
          )}

          <form onSubmit={handleSaveProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (8 cols): Main details */}
            <div className="lg:col-span-8 space-y-6">
              {/* Card 1: Basic Info */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-2xs space-y-5">
                <h3 className="text-sm font-black text-[#061F3D] uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF5200]" />
                  <span>Información Principal</span>
                </h3>

                {/* Product Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nombre del producto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ej: Bravery Salmon Adult Cat 7kg"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 font-bold text-sm text-[#061F3D] focus:outline-none focus:border-[#FF5200] focus:ring-2 focus:ring-[#FF5200]/10 transition-all placeholder:font-normal"
                  />
                </div>

                {/* Price & Weight/Size Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Precio de Venta ($ CLP) *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-slate-400 font-black text-sm">$</span>
                      <input
                        type="number"
                        required
                        min={1}
                        value={formPrice}
                        onChange={(e) => setFormPrice(Number(e.target.value))}
                        placeholder="Ej: 47900"
                        className="w-full pl-8 pr-4 py-3 rounded-2xl border border-slate-200 font-black text-base text-[#061F3D] focus:outline-none focus:border-[#FF5200] focus:ring-2 focus:ring-[#FF5200]/10 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Formato / Presentación (Kilos, Gramos)
                    </label>
                    <input
                      type="text"
                      value={formWeightOrSize}
                      onChange={(e) => setFormWeightOrSize(e.target.value)}
                      placeholder="Ej: 15 kg, 2 kg, 500 g"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 font-semibold text-sm text-[#061F3D] focus:outline-none focus:border-[#FF5200] focus:ring-2 focus:ring-[#FF5200]/10 transition-all"
                    />
                  </div>
                </div>

                {/* Category & Brand Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Categoría del Producto *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 font-bold text-xs sm:text-sm text-[#061F3D] focus:outline-none focus:border-[#FF5200] focus:ring-2 focus:ring-[#FF5200]/10 transition-all bg-white"
                    >
                      <option value="perros">🐕 Alimentos Perros</option>
                      <option value="gatos">🐱 Alimentos Gatos</option>
                      <option value="higiene">🧼 Arenas & Higiene</option>
                      <option value="snacks">🦴 Snacks & Premios</option>
                      <option value="accesorios">🎾 Accesorios</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Marca o Fabricante
                    </label>
                    <input
                      type="text"
                      value={formBrand}
                      onChange={(e) => setFormBrand(e.target.value)}
                      placeholder="Ej: Bravery, Belcando, Champion"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 font-semibold text-sm text-[#061F3D] focus:outline-none focus:border-[#FF5200] focus:ring-2 focus:ring-[#FF5200]/10 transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Descripción del Producto (Opcional)
                  </label>
                  <textarea
                    rows={4}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Escribe una breve descripción del alimento, beneficios nutricionales o recomendaciones de uso..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 font-medium text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-[#FF5200] focus:ring-2 focus:ring-[#FF5200]/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Right Column (4 cols): Image, Stock & Status */}
            <div className="lg:col-span-4 space-y-6">
              {/* Card 2: Main Image Upload */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-sm font-black text-[#061F3D] uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF5200]" />
                  <span>Foto Principal</span>
                </h3>

                <div className="w-full aspect-square max-h-56 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-3 relative overflow-hidden group">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-500">Sin imagen seleccionada</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">JPEG, PNG o WEBP</p>
                    </div>
                  )}
                </div>

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
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-[#FF5200]" />
                  <span>{imagePreview ? 'Cambiar Imagen' : 'Subir Imagen'}</span>
                </button>
              </div>

              {/* Card 3: Stock & Availability */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-sm font-black text-[#061F3D] uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF5200]" />
                  <span>Inventario</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Unidades en Stock
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formStock}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormStock(val);
                      if (val <= 0) setFormInStock(false);
                      else setFormInStock(true);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-black text-sm text-[#061F3D] focus:outline-none focus:border-[#FF5200]"
                  />
                </div>

                {/* Big Visual Availability Switch */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Disponibilidad en Tienda
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormInStock(!formInStock)}
                    className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer border ${
                      formInStock
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {formInStock ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                        <span>✓ Producto en Stock (Visible)</span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 text-rose-600 stroke-[3]" />
                        <span>✕ Producto Agotado</span>
                      </>
                    )}
                  </button>
                </div>

                {/* SKU Code */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Código SKU (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="PL-001"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 font-mono font-bold text-xs text-[#061F3D] focus:outline-none focus:border-[#FF5200]"
                  />
                </div>
              </div>

              {/* Save & Cancel Buttons Mobile / Sticky */}
              <div className="pt-2 flex flex-col space-y-2">
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="w-full py-3.5 rounded-full bg-[#FF5200] hover:bg-[#FF6508] text-white font-extrabold text-sm shadow-orange-glow transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
                >
                  {isSavingProduct ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Guardando en PocketBase...</span>
                    </>
                  ) : (
                    <span>{editingProduct ? 'Guardar Cambios' : 'Crear Producto'}</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('dashboard')}
                  className="w-full py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-center"
                >
                  Cancelar y Volver
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: ADMIN DASHBOARD PRINCIPAL (PRODUCTOS, INVENTARIO, PEDIDOS, TRANSBANK)
  // =========================================================================
  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col animate-fade-in pb-16">
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

      {/* Top Navbar */}
      <header className="bg-white px-4 sm:px-8 py-3.5 border-b border-slate-200 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-2xs">
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

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => {
              setActiveTab('products');
              setSelectedOrder(null);
            }}
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
            onClick={() => {
              setActiveTab('inventory');
              setSelectedOrder(null);
            }}
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
            onClick={() => {
              setActiveTab('transbank');
              setSelectedOrder(null);
            }}
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

        {/* Actions: View Store & Logout */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-[#061F3D] hover:bg-slate-100 transition-colors flex items-center space-x-1.5 cursor-pointer border border-slate-200"
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
        </div>
      </header>

      {/* Mobile Navigation Tabs */}
      <div className="md:hidden flex items-center justify-around bg-white border-b border-slate-200 px-2 py-2 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('products');
            setSelectedOrder(null);
          }}
          className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap ${
            activeTab === 'products' ? 'bg-[#FF5200] text-white' : 'text-slate-600'
          }`}
        >
          Productos ({products.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('inventory');
            setSelectedOrder(null);
          }}
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
          onClick={() => {
            setActiveTab('transbank');
            setSelectedOrder(null);
          }}
          className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap ${
            activeTab === 'transbank' ? 'bg-[#FF5200] text-white' : 'text-slate-600'
          }`}
        >
          Transbank
        </button>
      </div>

      {/* Top Stat Summary Cards */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-5 pb-2 grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              Total Productos
            </span>
            <p className="text-xl font-black text-[#061F3D]">{products.length}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF5200]">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              Stock Total
            </span>
            <p className="text-xl font-black text-[#061F3D]">{totalStockCount}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
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
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              lowStockCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              Pedidos
            </span>
            <p className="text-xl font-black text-[#061F3D]">{orders.length}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-4 flex-1 flex flex-col">
        {/* ===================================================================== */}
        {/* TAB 1: PRODUCTOS                                                     */}
        {/* ===================================================================== */}
        {activeTab === 'products' && (
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Buscar por nombre, marca o SKU..."
                    className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FF5200]"
                  />
                  {productSearch && (
                    <button
                      onClick={() => setProductSearch('')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#FF5200] bg-white cursor-pointer"
                >
                  <option value="all">Todas las categorías</option>
                  <option value="perros">Alimentos Perros</option>
                  <option value="gatos">Alimentos Gatos</option>
                  <option value="higiene">Arenas & Higiene</option>
                  <option value="snacks">Snacks & Premios</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  onClick={loadProducts}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Refrescar productos"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingProducts ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={handleOpenNewProduct}
                  className="py-2 px-4 rounded-xl bg-[#FF5200] hover:bg-[#FF6508] text-white font-extrabold text-xs shadow-orange-glow transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Nuevo Producto</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Producto</th>
                      <th className="py-3 px-3">Categoría</th>
                      <th className="py-3 px-3">Formato</th>
                      <th className="py-3 px-3">Precio</th>
                      <th className="py-3 px-3">Stock</th>
                      <th className="py-3 px-3">Estado</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-[#061F3D]">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = '/product-dog-food.jpg';
                                }}
                              />
                            </div>
                            <div className="max-w-[200px] sm:max-w-xs">
                              <span className="font-bold text-xs sm:text-sm text-[#061F3D] block truncate">
                                {p.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {p.brand ? `${p.brand} • ` : ''}{p.sku || `PL-${p.id.slice(0, 4)}`}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold capitalize">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-medium">
                          {p.weightOrSize || '-'}
                        </td>
                        <td className="py-3 px-3 font-black text-[#061F3D]">
                          {formatPrice(p.price)}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`font-black text-xs ${
                              (p.stockCount || 0) < 5 ? 'text-rose-600' : 'text-slate-700'
                            }`}
                          >
                            {p.stockCount !== undefined ? p.stockCount : 15} un.
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => handleToggleInStock(p)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold cursor-pointer transition-colors ${
                              p.inStock
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {p.inStock ? '✓ En Stock' : '✕ Agotado'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-[#FF5200] hover:bg-orange-50 transition-colors cursor-pointer"
                              title="Editar producto a pantalla completa"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: INVENTARIO RÁPIDO                                             */}
        {/* ===================================================================== */}
        {activeTab === 'inventory' && (
          <div className="flex-1 flex flex-col">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 mb-4 flex items-center justify-between shadow-2xs">
              <span className="text-xs font-bold text-slate-600">
                Ajuste rápido de unidades disponibles y visibilidad en tiempo real
              </span>
              <button
                onClick={loadProducts}
                className="py-1.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProducts ? 'animate-spin' : ''}`} />
                <span>Actualizar stock</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Producto</th>
                      <th className="py-3 px-3">Formato</th>
                      <th className="py-3 px-3">Precio</th>
                      <th className="py-3 px-3">Stock Actual</th>
                      <th className="py-3 px-3">Ajuste Rápido</th>
                      <th className="py-3 px-4 text-right">Disponibilidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-[#061F3D]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4">
                          <span className="font-bold text-xs text-[#061F3D] block truncate max-w-xs">
                            {p.name}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-medium">
                          {p.weightOrSize || '-'}
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
                            {p.stockCount !== undefined ? p.stockCount : 15}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center space-x-1.5">
                            <button
                              onClick={() => handleQuickStock(p, -1)}
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center cursor-pointer"
                              title="Restar 1 unidad"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => handleQuickStock(p, 1)}
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center cursor-pointer"
                              title="Sumar 1 unidad"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => handleQuickStock(p, 5)}
                              className="px-2 h-7 rounded-lg bg-[#FFF2EA] hover:bg-[#FFE6D6] text-[#FF5200] font-black flex items-center justify-center cursor-pointer text-[10px]"
                              title="Sumar 5 unidades"
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
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: PEDIDOS (SIN POPUPS - VISTA DEDICADA SI SE SELECCIONA)        */}
        {/* ===================================================================== */}
        {activeTab === 'orders' && (
          <div className="flex-1 flex flex-col">
            {selectedOrder ? (
              /* DETALLE DEL PEDIDO (IN-PAGE COMPLETO) */
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-2 rounded-xl text-slate-500 hover:text-[#061F3D] hover:bg-slate-100 transition-colors flex items-center space-x-1.5 text-xs font-bold cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Volver a todos los pedidos</span>
                    </button>
                    <span className="text-slate-300">/</span>
                    <span className="text-xs font-black text-[#FF5200] uppercase tracking-wider">
                      Orden {selectedOrder.orderNumber}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 font-semibold">
                    {new Date(selectedOrder.created).toLocaleString('es-CL')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info Card */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs text-slate-600">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      Datos de Despacho y Contacto
                    </span>
                    <p className="text-base font-black text-[#061F3D]">
                      {selectedOrder.customerName}
                    </p>
                    <p className="flex items-center space-x-2 text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{selectedOrder.customerEmail}</span>
                    </p>
                    {selectedOrder.customerPhone && (
                      <p className="flex items-center space-x-2 text-slate-600">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{selectedOrder.customerPhone}</span>
                      </p>
                    )}
                    <p className="flex items-center space-x-2 text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>
                        {selectedOrder.customerAddress}, {selectedOrder.customerCity || 'Santiago'}
                      </span>
                    </p>
                  </div>

                  {/* Order Status & Actions Card */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      Estado Actual del Pedido
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs uppercase">
                        {selectedOrder.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        Total:{' '}
                        <strong className="text-base font-black text-[#061F3D]">
                          {formatPrice(selectedOrder.total)}
                        </strong>
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1.5">
                        Cambiar estado con 1 clic:
                      </label>
                      <div className="grid grid-cols-3 gap-2 text-[11px] font-bold">
                        {(['pendiente', 'pagado', 'en_preparacion', 'despachado', 'entregado', 'cancelado'] as const).map(
                          (st) => (
                            <button
                              key={st}
                              onClick={() => handleChangeOrderStatus(selectedOrder.id, st)}
                              className={`py-1.5 px-2 rounded-xl border capitalize cursor-pointer transition-colors text-center ${
                                selectedOrder.status === st
                                  ? 'bg-[#FF5200] text-white border-[#FF5200]'
                                  : 'border-slate-200 hover:bg-white text-slate-600'
                              }`}
                            >
                              {st.replace('_', ' ')}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items in this Order */}
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">
                    Productos del Pedido ({selectedOrder.items?.length || 0})
                  </h4>
                  <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
                    {selectedOrder.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 flex items-center justify-between text-xs sm:text-sm bg-white"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 rounded-lg bg-orange-50 text-[#FF5200] font-black flex items-center justify-center text-xs">
                            {item.quantity}x
                          </span>
                          <div>
                            <span className="font-bold text-[#061F3D] block">{item.name}</span>
                            <span className="text-[11px] text-slate-400">
                              {formatPrice(item.price)} c/u
                            </span>
                          </div>
                        </div>
                        <span className="font-black text-[#061F3D]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* TABLA DE PEDIDOS */
              <>
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-500">Filtrar por estado:</span>
                    <select
                      value={orderFilter}
                      onChange={(e) => setOrderFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#FF5200] bg-white cursor-pointer"
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

                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                        <tr>
                          <th className="py-3 px-4">N° Pedido</th>
                          <th className="py-3 px-3">Cliente</th>
                          <th className="py-3 px-3">Contacto</th>
                          <th className="py-3 px-3">Total</th>
                          <th className="py-3 px-3">Estado</th>
                          <th className="py-3 px-3">Fecha</th>
                          <th className="py-3 px-4 text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-[#061F3D]">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                              No hay pedidos registrados aún.
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((ord) => (
                            <tr key={ord.id} className="hover:bg-slate-50/80">
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
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                                    ord.status === 'pagado' || ord.status === 'entregado'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : ord.status === 'despachado' || ord.status === 'en_preparacion'
                                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                                      : 'bg-amber-50 text-amber-700 border-amber-200'
                                  }`}
                                >
                                  {ord.status.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-[11px] text-slate-400">
                                {new Date(ord.created).toLocaleDateString('es-CL')}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => setSelectedOrder(ord)}
                                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#FF5200] hover:text-white font-bold text-xs transition-colors cursor-pointer"
                                >
                                  Ver Detalle
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 4: TRANSBANK WEBPAY CONFIGURATION                                */}
        {/* ===================================================================== */}
        {activeTab === 'transbank' && (
          <div className="max-w-2xl mx-auto w-full">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
              <div>
                <h3 className="text-xl font-black text-[#061F3D] flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-[#FF5200]" />
                  <span>Configuración Transbank Webpay Plus</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ingresa las credenciales oficiales de Transbank para procesar pagos reales con tarjetas de crédito, débito y prepago.
                </p>
              </div>

              {tbkSuccessMsg && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{tbkSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveTransbank} className="space-y-4">
                {/* Environment Mode */}
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1.5">
                    Ambiente de Pagos
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTbkConfig({ ...tbkConfig, environment: 'integration' })}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-left ${
                        tbkConfig.environment === 'integration'
                          ? 'border-[#FF5200] bg-orange-50/50 text-[#FF5200]'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span className="block font-black text-sm">🧪 Integración (Pruebas)</span>
                      <span className="text-[11px] font-normal opacity-80">
                        Tarjetas de prueba de Transbank
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTbkConfig({ ...tbkConfig, environment: 'production' })}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-left ${
                        tbkConfig.environment === 'production'
                          ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span className="block font-black text-sm">🔒 Producción Real</span>
                      <span className="text-[11px] font-normal opacity-80">
                        Cobros y dinero real en tu cuenta
                      </span>
                    </button>
                  </div>
                </div>

                {/* Commerce Code */}
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1.5">
                    Código de Comercio
                  </label>
                  <input
                    type="text"
                    required
                    value={tbkConfig.commerceCode}
                    onChange={(e) => setTbkConfig({ ...tbkConfig, commerceCode: e.target.value.trim() })}
                    placeholder="Ej: 597055555532 o el entregado por Transbank"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono font-semibold focus:outline-none focus:border-[#FF5200]"
                  />
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
                    Se guarda de manera segura para autenticar las transacciones con Transbank Webpay Plus.
                  </span>
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
      </main>
    </div>
  );
};
