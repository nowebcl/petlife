import { jsPDF } from 'jspdf';
import { formatPrice } from '../data/products.ts';

export interface ReceiptData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress: string;
  customerCity?: string;
  customerNotes?: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    weightOrSize?: string;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod?: string;
  flowOrder?: string | number;
  date?: string;
}

/**
 * Genera el documento PDF del comprobante de compra con diseño oficial PetLife
 */
export function generateOrderReceiptPDF(data: ReceiptData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2; // 178mm

  // 1. Encabezado superior azul PetLife (#061F3D)
  doc.setFillColor(6, 31, 61);
  doc.rect(0, 0, pageWidth, 30, 'F');

  // Línea decorativa naranja (#FF5200)
  doc.setFillColor(255, 82, 0);
  doc.rect(0, 30, pageWidth, 2.5, 'F');

  // Marca y Título
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('PETLIFE STORE', margin, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Todo para tu Mascota • Alimentos, Higiene & Accesorios', margin, 23);

  // Badge Comprobante y Fecha en el extremo derecho
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('COMPROBANTE DE PAGO', pageWidth - margin, 14, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Orden: ${data.orderNumber}`, pageWidth - margin, 20, { align: 'right' });
  const displayDate =
    data.date ||
    new Date().toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  doc.text(`Fecha: ${displayDate}`, pageWidth - margin, 26, { align: 'right' });

  let y = 42;

  // 2. Estado de pago exitoso (Tarjeta verde)
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.setDrawColor(167, 243, 208); // emerald-200
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');

  doc.setTextColor(6, 95, 70); // emerald-800
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PAGO APROBADO EXITOSAMENTE VIA WEBPAY PLUS', margin + 6, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const paymentDetails = `Medio de Pago: ${data.paymentMethod || 'Webpay Plus (Débito / Crédito)'}${
    data.flowOrder ? ` • N° Transacción: #${data.flowOrder}` : ''
  }`;
  doc.text(paymentDetails, margin + 6, y + 10.5);

  y += 20;

  // 3. Ficha de Datos del Cliente y Despacho
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'FD');

  doc.setTextColor(6, 31, 61);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('DATOS DEL CLIENTE Y DESPACHO', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  // Columna Izquierda
  doc.text(`Cliente: ${data.customerName}`, margin + 4, y + 12);
  doc.text(`Correo: ${data.customerEmail}`, margin + 4, y + 17);
  doc.text(`Teléfono: ${data.customerPhone || 'No especificado'}`, margin + 4, y + 22);

  // Columna Derecha
  const colRightX = margin + 95;
  doc.text(`Dirección: ${data.customerAddress}`, colRightX, y + 12);
  doc.text(`Ciudad/Comuna: ${data.customerCity || 'Santiago, Chile'}`, colRightX, y + 17);
  if (data.customerNotes) {
    doc.text(`Notas: ${data.customerNotes.slice(0, 45)}`, colRightX, y + 22);
  }

  y += 33;

  // 4. Tabla de Productos Comprados
  doc.setFillColor(6, 31, 61);
  doc.rect(margin, y, contentWidth, 7, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('CANT', margin + 4, y + 4.8);
  doc.text('DESCRIPCION DEL PRODUCTO', margin + 20, y + 4.8);
  doc.text('FORMATO', margin + 115, y + 4.8);
  doc.text('TOTAL', pageWidth - margin - 4, y + 4.8, { align: 'right' });

  y += 7;

  // Filas de productos
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  data.items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 250, 252);
    }
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + 8, pageWidth - margin, y + 8);

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.quantity}x`, margin + 4, y + 5.2);

    doc.setFont('helvetica', 'normal');
    // Truncar si el nombre es muy largo
    const cleanName = item.name.length > 55 ? item.name.slice(0, 52) + '...' : item.name;
    doc.text(cleanName, margin + 20, y + 5.2);

    doc.setTextColor(100, 116, 139);
    doc.text(item.weightOrSize || '-', margin + 115, y + 5.2);

    doc.setTextColor(6, 31, 61);
    doc.setFont('helvetica', 'bold');
    doc.text(formatPrice(item.price * item.quantity), pageWidth - margin - 4, y + 5.2, {
      align: 'right',
    });

    y += 8;
  });

  y += 4;

  // 5. Bloque de Totales
  const totalsBoxX = margin + 105;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Subtotal:', totalsBoxX, y + 4);
  doc.text(formatPrice(data.subtotal), pageWidth - margin - 4, y + 4, { align: 'right' });

  doc.text('Despacho:', totalsBoxX, y + 9);
  doc.text(
    data.shippingCost === 0 ? 'Gratis' : formatPrice(data.shippingCost),
    pageWidth - margin - 4,
    y + 9,
    { align: 'right' }
  );

  doc.setDrawColor(226, 232, 240);
  doc.line(totalsBoxX, y + 12, pageWidth - margin, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 82, 0); // Orange
  doc.text('TOTAL PAGADO:', totalsBoxX, y + 18);
  doc.text(formatPrice(data.total), pageWidth - margin - 4, y + 18, { align: 'right' });

  y += 26;

  // 6. Tarjeta destacada de Coordinación por WhatsApp (+56 9 8253 5868)
  doc.setFillColor(240, 253, 244); // green-50
  doc.setDrawColor(37, 211, 102); // WhatsApp green (#25D366)
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, y, contentWidth, 22, 2.5, 2.5, 'FD');

  doc.setTextColor(18, 140, 126); // WhatsApp dark green
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('COORDINACION DE DESPACHO INMEDIATA VIA WHATSAPP', margin + 6, y + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(
    'Para coordinar el día y horario de entrega, por favor envía este comprobante al WhatsApp oficial:',
    margin + 6,
    y + 11.5
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 82, 0);
  doc.text('+56 9 8253 5868', margin + 6, y + 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('(Indica tu número de orden ' + data.orderNumber + ')', margin + 46, y + 17);

  // 7. Pie de página del documento
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'PetLife Store Chile • contacto@tiendapetlife.cl • Comprobante electrónico de transacción comercial',
    pageWidth / 2,
    285,
    { align: 'center' }
  );

  return doc;
}

/**
 * Dispara la descarga automática del comprobante de pago en el navegador del cliente
 */
export function downloadOrderReceiptPDF(data: ReceiptData): void {
  try {
    const doc = generateOrderReceiptPDF(data);
    doc.save(`Comprobante_PetLife_${data.orderNumber}.pdf`);
  } catch (err) {
    console.error('Error al generar comprobante de pago PDF:', err);
  }
}
