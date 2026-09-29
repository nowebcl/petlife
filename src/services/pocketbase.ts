import type { Product } from '../data/products.ts';
import { PRODUCTS_DATABASE } from '../data/products.ts';

export const POCKETBASE_URL =
  (import.meta as any).env?.VITE_POCKETBASE_URL || 'https://petlife.noweb.cl';

export interface PocketBaseRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  [key: string]: any;
}

export interface PocketBaseProductRecord extends PocketBaseRecord {
  name: string;
  brand: string;
  category: 'perros' | 'gatos' | 'snacks' | 'higiene' | 'juguetes' | 'accesorios';
  categoryLabel: string;
  petType: 'perro' | 'gato' | 'ambos';
  lifeStage: 'cachorro' | 'adulto' | 'senior' | 'todas';
  price: number;
  weightOrSize: string;
  stockCount: number;
  inStock: boolean;
  sku: string;
  imageUrl: string;
  image?: string;
  description: string;
  longDescription: string;
  benefits?: string[];
  featured: boolean;
  rating: number;
  reviewsCount: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weightOrSize?: string;
  imageUrl?: string;
}

export interface OrderRecord extends PocketBaseRecord {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerNotes?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: 'pendiente' | 'pagado' | 'en_preparacion' | 'despachado' | 'entregado' | 'cancelado';
  paymentMethod: string;
  paymentStatus: string;
  transbankToken?: string;
}

const ADMIN_TOKEN_KEY = 'petlife_pb_admin_token';
const ADMIN_EMAIL_KEY = 'petlife_pb_admin_email';

/**
 * Obtener URL de imagen optimizada de PocketBase o URL local de respaldo
 */
export function getProductImageUrl(p: {
  image?: string;
  collectionId?: string;
  id?: string;
  imageUrl?: string;
}): string {
  if (p.image && p.collectionId && p.id) {
    return `${POCKETBASE_URL}/api/files/${p.collectionId}/${p.id}/${p.image}`;
  }
  if (p.imageUrl && p.imageUrl.trim()) {
    return p.imageUrl;
  }
  return '/product-dog-food.jpg';
}

/**
 * Mapear registro de PocketBase al formato Product usado en componentes UI
 */
export function mapRecordToProduct(r: PocketBaseProductRecord): Product {
  let benefitsList: string[] = [];
  try {
    if (typeof r.benefits === 'string') {
      benefitsList = JSON.parse(r.benefits);
    } else if (Array.isArray(r.benefits)) {
      benefitsList = r.benefits;
    }
  } catch {
    benefitsList = [];
  }

  const resolvedImage = getProductImageUrl(r);

  return {
    id: r.id,
    name: r.name,
    brand: r.brand || '',
    category: r.category || 'perros',
    categoryLabel: r.categoryLabel || 'Alimentos Perros',
    petType: r.petType || 'perro',
    lifeStage: r.lifeStage || 'adulto',
    price: Number(r.price) || 0,
    rating: Number(r.rating) || 4.8,
    reviewsCount: Number(r.reviewsCount) || 10,
    weightOrSize: r.weightOrSize || '',
    icon: r.petType === 'gato' ? '🐱' : '🐕',
    bgGradient:
      r.category === 'gatos'
        ? 'from-purple-500/10 to-pink-500/10 text-purple-600'
        : r.category === 'higiene'
        ? 'from-cyan-500/10 to-blue-500/10 text-cyan-600'
        : 'from-amber-500/10 to-orange-500/10 text-orange-600',
    description: r.description || '',
    longDescription: r.longDescription || '',
    imageUrl: resolvedImage,
    galleryImages: [resolvedImage],
    inStock: r.inStock !== false && (Number(r.stockCount) > 0 || r.stockCount === undefined),
    stockCount: Number(r.stockCount) || 0,
    sku: r.sku || '',
    benefits: benefitsList.length > 0 ? benefitsList : ['Excelente calidad garantizada', 'Nutrición óptima'],
  };
}

/**
 * Obtener todos los productos reales desde PocketBase
 * Con tolerancia a fallos (fallback a base local si no hay conexión)
 */
export async function fetchAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${POCKETBASE_URL}/api/collections/products/records?perPage=200&sort=-created`);
    if (!res.ok) {
      console.warn(`PocketBase returned ${res.status}, using local fallback.`);
      return PRODUCTS_DATABASE;
    }
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      return data.items.map(mapRecordToProduct);
    }
    return PRODUCTS_DATABASE;
  } catch (err) {
    console.warn('Network error reaching PocketBase, using local fallback:', err);
    return PRODUCTS_DATABASE;
  }
}

/**
 * =========================================================================
 * AUTENTICACIÓN ADMIN / SUPERUSER
 * =========================================================================
 */

export function getAdminToken(): string | null {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function getAdminEmail(): string | null {
  return sessionStorage.getItem(ADMIN_EMAIL_KEY) || localStorage.getItem(ADMIN_EMAIL_KEY);
}

export function isUserAdmin(): boolean {
  return Boolean(getAdminToken());
}

export function adminLogout(): void {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_EMAIL_KEY);
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_EMAIL_KEY);
}

/**
 * Iniciar sesión de Superusuario / Administrador en PocketBase
 */
export async function adminLogin(
  email: string,
  pass: string,
  remember: boolean = false
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch(`${POCKETBASE_URL}/api/collections/_superusers/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: email.trim(), password: pass }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(ADMIN_TOKEN_KEY, data.token);
      storage.setItem(ADMIN_EMAIL_KEY, email.trim());
      return { success: true, token: data.token };
    }

    return {
      success: false,
      error: data.message || 'Credenciales inválidas. Verifica tu correo y contraseña.',
    };
  } catch (err: any) {
    return {
      success: false,
      error: 'No se pudo conectar con el servidor: ' + (err.message || 'Error de red'),
    };
  }
}

/**
 * =========================================================================
 * ACCIONES DE ADMINISTRADOR (PROTEGIDAS)
 * =========================================================================
 */

/**
 * Crear un nuevo producto en PocketBase con subida de imagen
 */
export async function adminCreateProduct(
  formData: FormData
): Promise<{ success: boolean; data?: any; error?: string }> {
  const token = getAdminToken();
  if (!token) return { success: false, error: 'No autorizado. Por favor inicia sesión.' };

  try {
    const res = await fetch(`${POCKETBASE_URL}/api/collections/products/records`, {
      method: 'POST',
      headers: { Authorization: token },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      return { success: true, data };
    }
    return { success: false, error: data.message || JSON.stringify(data.data) };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al crear producto' };
  }
}

/**
 * Actualizar un producto existente
 */
export async function adminUpdateProduct(
  id: string,
  payload: FormData | Record<string, any>
): Promise<{ success: boolean; data?: any; error?: string }> {
  const token = getAdminToken();
  if (!token) return { success: false, error: 'No autorizado. Por favor inicia sesión.' };

  try {
    const isFormData = payload instanceof FormData;
    const headers: Record<string, string> = { Authorization: token };
    if (!isFormData) headers['Content-Type'] = 'application/json';

    const res = await fetch(`${POCKETBASE_URL}/api/collections/products/records/${id}`, {
      method: 'PATCH',
      headers,
      body: isFormData ? payload : JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      return { success: true, data };
    }
    return { success: false, error: data.message || JSON.stringify(data.data) };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al actualizar producto' };
  }
}

/**
 * Ajustar stock e inventario rápidamente
 */
export async function adminUpdateStock(
  id: string,
  stockCount: number,
  inStock?: boolean
): Promise<{ success: boolean; error?: string }> {
  const token = getAdminToken();
  if (!token) return { success: false, error: 'No autorizado' };

  try {
    const body: Record<string, any> = { stockCount };
    if (inStock !== undefined) body.inStock = inStock;
    else body.inStock = stockCount > 0;

    const res = await fetch(`${POCKETBASE_URL}/api/collections/products/records/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (res.ok) return { success: true };
    const err = await res.json();
    return { success: false, error: err.message };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Eliminar un producto
 */
export async function adminDeleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  const token = getAdminToken();
  if (!token) return { success: false, error: 'No autorizado' };

  try {
    const res = await fetch(`${POCKETBASE_URL}/api/collections/products/records/${id}`, {
      method: 'DELETE',
      headers: { Authorization: token },
    });

    if (res.status === 204 || res.ok) {
      return { success: true };
    }
    const err = await res.json();
    return { success: false, error: err.message };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * =========================================================================
 * PEDIDOS (ORDERS)
 * =========================================================================
 */

/**
 * Crear un pedido (Público, durante el checkout del cliente)
 */
export async function submitOrder(orderData: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress: string;
  customerCity?: string;
  customerNotes?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost?: number;
  total: number;
  paymentMethod?: string;
  transbankToken?: string;
}): Promise<{ success: boolean; order?: any; error?: string }> {
  try {
    const orderNumber = `PL-${Date.now().toString().slice(-6)}`;
    const payload = {
      orderNumber,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone || '',
      customerAddress: orderData.customerAddress,
      customerCity: orderData.customerCity || 'Santiago',
      customerNotes: orderData.customerNotes || '',
      items: orderData.items,
      subtotal: orderData.subtotal,
      shippingCost: orderData.shippingCost || 0,
      total: orderData.total,
      status: 'pendiente',
      paymentMethod: orderData.paymentMethod || 'Webpay Plus Transbank',
      paymentStatus: 'pendiente',
      transbankToken: orderData.transbankToken || '',
    };

    const res = await fetch(`${POCKETBASE_URL}/api/collections/orders/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      return { success: true, order: data };
    }
    return { success: false, error: data.message || 'Error al registrar pedido' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error de conexión' };
  }
}

/**
 * Obtener lista de pedidos (Solo Admin)
 */
export async function adminFetchOrders(): Promise<{ success: boolean; orders?: OrderRecord[]; error?: string }> {
  const token = getAdminToken();
  if (!token) return { success: false, error: 'No autorizado' };

  try {
    const res = await fetch(`${POCKETBASE_URL}/api/collections/orders/records?perPage=100&sort=-created`, {
      headers: { Authorization: token },
    });

    const data = await res.json();
    if (res.ok) {
      return { success: true, orders: data.items || [] };
    }
    return { success: false, error: data.message };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Cambiar estado de un pedido (Solo Admin)
 */
export async function adminUpdateOrderStatus(
  id: string,
  status: OrderRecord['status']
): Promise<{ success: boolean; error?: string }> {
  const token = getAdminToken();
  if (!token) return { success: false, error: 'No autorizado' };

  try {
    const res = await fetch(`${POCKETBASE_URL}/api/collections/orders/records/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (res.ok) return { success: true };
    const err = await res.json();
    return { success: false, error: err.message };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
