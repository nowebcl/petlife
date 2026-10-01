export const formatPrice = (price: number): string => {
  return '$' + Math.round(price).toLocaleString('es-CL');
};

export interface ProductVariant {
  id: string;
  label: string;
  weightOrSize: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  petType?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'perros' | 'gatos' | 'snacks' | 'higiene' | 'juguetes' | 'accesorios';
  categoryLabel: string;
  petType: 'perro' | 'gato' | 'ambos';
  lifeStage: 'cachorro' | 'adulto' | 'senior' | 'todas';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  weightOrSize: string;
  icon: string;
  bgGradient: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  galleryImages: string[];
  inStock: boolean;
  stockCount: number;
  sku: string;
  variants?: ProductVariant[];
  benefits: string[];
  ingredients?: string[];
  nutritionalAnalysis?: Record<string, string>;
  feedingGuide?: Array<{ weight: string; dailyAmount: string }>;
  reviews?: ProductReview[];
}

export const PRODUCTS_DATABASE: Product[] = [
  {
    "id": "prod-1",
    "name": "Alaska Adulto Todas las Razas Carne de Vacuno",
    "brand": "Alaska",
    "category": "perros",
    "categoryLabel": "Alimentos Perros",
    "petType": "perro",
    "lifeStage": "adulto",
    "price": 47900,
    "rating": 4.8,
    "reviewsCount": 86,
    "weightOrSize": "15 kg",
    "icon": "🐕",
    "bgGradient": "from-amber-500/10 to-orange-500/10 text-orange-600",
    "description": "Alimento completo y balanceado con carne de vacuno de alta digestibilidad para perros adultos de todas las razas.",
    "longDescription": "Alaska Adulto Carne de Vacuno ofrece un perfil de aminoácidos completo que promueve una masa muscular magra y articulaciones protegidas. Enriquecido con vitaminas esenciales y ácidos grasos Omega para una piel sana y pelaje brillante.",
    "imageUrl": "/productos/Alaska Adulto Todas las Razas Carne de Vacuno.jpeg",
    "galleryImages": [
      "/productos/Alaska Adulto Todas las Razas Carne de Vacuno.jpeg"
    ],
    "inStock": true,
    "stockCount": 29,
    "sku": "PL-001",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 3 kg",
        "weightOrSize": "3 kg",
        "price": 11900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Saco 15 kg",
        "weightOrSize": "15 kg",
        "price": 47900,
        "inStock": true
      }
    ],
    "benefits": [
      "Carne de vacuno seleccionada como fuente principal de proteína",
      "Digestión óptima y heces firmes con fibras prebióticas",
      "Pelaje brillante y piel hidratada con omegas naturales",
      "Excelente relación precio-calidad para el día a día"
    ],
    "ingredients": [
      "Carne de vacuno",
      "Maíz seleccionado",
      "Harina de carne y hueso",
      "Aceite de pollo",
      "Prebióticos MOS"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "24.0% mín",
      "Grasa bruta": "10.0% mín",
      "Fibra cruda": "4.0% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "70 - 100 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "100 - 160 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "160 - 320 g"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "320 - 520 g"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-1",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-1",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-2",
    "name": "Americalitter Quick Clumping Cat Litter Unscented",
    "brand": "Americalitter",
    "category": "higiene",
    "categoryLabel": "Arenas & Higiene",
    "petType": "gato",
    "lifeStage": "todas",
    "price": 16900,
    "rating": 4.9,
    "reviewsCount": 112,
    "weightOrSize": "15 kg",
    "icon": "✨",
    "bgGradient": "from-cyan-500/10 to-blue-500/10 text-cyan-600",
    "description": "Arena sanitaria aglutinante instantánea sin fragancia, 99.9% libre de polvo y con control superior de olores.",
    "longDescription": "Americalitter Quick Clumping forma terrones firmes en segundos al contacto con líquidos, permitiendo retirar los residuos fácilmente sin desmoronarse. Ideal para hogares con múltiples gatos y dueños sensibles a perfumes.",
    "imageUrl": "/productos/Americalitter Quick Clumping Cat Litter Unscented.jpeg",
    "galleryImages": [
      "/productos/Americalitter Quick Clumping Cat Litter Unscented.jpeg"
    ],
    "inStock": true,
    "stockCount": 38,
    "sku": "PL-002",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 15 kg",
        "weightOrSize": "15 kg",
        "price": 16900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Bolsa 20 kg",
        "weightOrSize": "20 kg",
        "price": 20900,
        "inStock": true
      }
    ],
    "benefits": [
      "Aglutinación ultra rápida y compacta en menos de 5 segundos",
      "99.9% libre de polvo para proteger las vías respiratorias",
      "Sin aromatizantes artificiales: ideal para gatos sensibles",
      "Mayor rendimiento y duración por cada bolsa"
    ],
    "ingredients": [
      "Bentonita sódica natural purificada"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "26.0% mín",
      "Grasa bruta": "12.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "70 - 100 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "100 - 160 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "160 - 320 g"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "320 - 520 g"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-2",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-2",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-3",
    "name": "Belcando Finest Croc Mini Adult XS-M",
    "brand": "Belcando",
    "category": "perros",
    "categoryLabel": "Alimentos Perros",
    "petType": "perro",
    "lifeStage": "adulto",
    "price": 29900,
    "rating": 4.9,
    "reviewsCount": 78,
    "weightOrSize": "4 kg",
    "icon": "🐕",
    "bgGradient": "from-amber-500/10 to-orange-500/10 text-orange-600",
    "description": "Croquetas de tamaño pequeño con salsa especial instantánea al añadir agua tibia para perros exigentes.",
    "longDescription": "Elaborado en Alemania con ingredientes holísticos de la más alta calidad, Belcando Finest Croc Mini combina carne fresca de ave y pato con semillas de chía y harina de semilla de uva prensada en frío para una vitalidad inigualable.",
    "imageUrl": "/productos/Belcando Finest Croc Mini Adult XS-M.jpeg",
    "galleryImages": [
      "/productos/Belcando Finest Croc Mini Adult XS-M.jpeg"
    ],
    "inStock": true,
    "stockCount": 25,
    "sku": "PL-003",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 1 kg",
        "weightOrSize": "1 kg",
        "price": 11900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Bolsa 4 kg",
        "weightOrSize": "4 kg",
        "price": 29900,
        "inStock": true
      },
      {
        "id": "v3",
        "label": "Saco 12.5 kg",
        "weightOrSize": "12.5 kg",
        "price": 74900,
        "inStock": true
      }
    ],
    "benefits": [
      "Efecto salsa gourmet: mezcla con agua tibia para una delicia irresistible",
      "Carne fresca de ave de consumo humano como primer ingrediente",
      "Semillas de chía ricas en ácidos grasos Omega-3 y mucílagos digestivos",
      "Sin trigo, soya, maíz ni productos lácteos"
    ],
    "ingredients": [
      "Carne fresca de ave (30%)",
      "Arroz",
      "Harina de avena forrajera",
      "Grasa de ave",
      "Semillas de chía (1.5%)"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "26.0% mín",
      "Grasa bruta": "12.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "70 - 100 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "100 - 160 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "160 - 320 g"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "320 - 520 g"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-3",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-3",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-4",
    "name": "Bravery Chicken Adult Cat 7kg",
    "brand": "Bravery",
    "category": "gatos",
    "categoryLabel": "Alimentos Gatos",
    "petType": "gato",
    "lifeStage": "adulto",
    "price": 52900,
    "rating": 5,
    "reviewsCount": 145,
    "weightOrSize": "7 kg",
    "icon": "🐱",
    "bgGradient": "from-purple-500/10 to-pink-500/10 text-purple-600",
    "description": "Nutrición mono-proteica 100% libre de granos elaborada con pollo deshidratado para gatos con digestión delicada.",
    "longDescription": "Bravery Chicken Adult Cat es un alimento super premium español formulado con pollo como única fuente de proteína animal. Libre de cereales (Grain Free) y 100% hipoalergénico con tapioca y levadura de cerveza para un sistema inmune invencible.",
    "imageUrl": "/productos/Bravery Chicken Adult Cat 7kg.jpeg",
    "galleryImages": [
      "/productos/Bravery Chicken Adult Cat 7kg.jpeg"
    ],
    "inStock": true,
    "stockCount": 37,
    "sku": "PL-004",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 2 kg",
        "weightOrSize": "2 kg",
        "price": 17900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Saco 7 kg",
        "weightOrSize": "7 kg",
        "price": 52900,
        "inStock": true
      }
    ],
    "benefits": [
      "100% libre de granos (Grain-Free) e hipoalergénico",
      "Monoproteico: solo carne deshidratada de pollo",
      "Taurina añadida para salud visual y muscular del corazón",
      "Control de bolas de pelo con celulosa purificada"
    ],
    "ingredients": [
      "Carne de pollo deshidratada",
      "Tapioca",
      "Grasa de ave",
      "Guisantes",
      "Aceite de salmón"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "32.0% mín",
      "Grasa bruta": "14.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "40 - 60 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "60 - 90 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "Libre demanda"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "Consultar veterinario"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-4",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-4",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-5",
    "name": "Bravery Chicken Kitten 2kg",
    "brand": "Bravery",
    "category": "gatos",
    "categoryLabel": "Alimentos Gatos",
    "petType": "gato",
    "lifeStage": "cachorro",
    "price": 21900,
    "rating": 4.9,
    "reviewsCount": 94,
    "weightOrSize": "2 kg",
    "icon": "🐱",
    "bgGradient": "from-purple-500/10 to-pink-500/10 text-purple-600",
    "description": "Fórmula ultra digestible libre de granos para gatitos en crecimiento con alto contenido de DHA y calcio.",
    "longDescription": "Especialmente balanceado para el crecimiento acelerado de gatitos desde el destete hasta los 12 meses de edad. Proporciona energía concentrada, refuerzo óseo y desarrollo cerebral con ácidos grasos esenciales EPA y DHA.",
    "imageUrl": "/productos/Bravery Chicken Kitten 2kg.jpeg",
    "galleryImages": [
      "/productos/Bravery Chicken Kitten 2kg.jpeg"
    ],
    "inStock": true,
    "stockCount": 24,
    "sku": "PL-005",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 2 kg",
        "weightOrSize": "2 kg",
        "price": 21900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Saco 7 kg",
        "weightOrSize": "7 kg",
        "price": 52900,
        "inStock": true
      }
    ],
    "benefits": [
      "Crecimiento muscular armónico con proteína pura de pollo",
      "Desarrollo visual y cognitivo impulsado por DHA natural",
      "Prebióticos MOS y FOS para una flora intestinal sana",
      "Croqueta pequeña diseñada para dientes de leche"
    ],
    "ingredients": [
      "Carne de pollo deshidratada",
      "Tapioca",
      "Grasa de ave",
      "Proteína de guisante",
      "Aceite de pescado rico en DHA"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "32.0% mín",
      "Grasa bruta": "14.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "40 - 60 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "60 - 90 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "Libre demanda"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "Consultar veterinario"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-5",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-5",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-6",
    "name": "Bravery Herring Adult Large Medium Breeds 12kg",
    "brand": "Bravery",
    "category": "perros",
    "categoryLabel": "Alimentos Perros",
    "petType": "perro",
    "lifeStage": "adulto",
    "price": 69900,
    "rating": 5,
    "reviewsCount": 160,
    "weightOrSize": "12 kg",
    "icon": "🐕",
    "bgGradient": "from-amber-500/10 to-orange-500/10 text-orange-600",
    "description": "Alimento grain-free con arenque salvaje como única proteína, condroprotectores y omegas para razas medianas y grandes.",
    "longDescription": "Elaborado con arenque capturado responsablemente, este alimento mono-proteico sin cereales es el más recomendado por veterinarios para perros con dermatitis alérgica o estómagos ultra sensibles.",
    "imageUrl": "/productos/Bravery Herring Adult Large Medium Breeds 12kg.jpeg",
    "galleryImages": [
      "/productos/Bravery Herring Adult Large Medium Breeds 12kg.jpeg"
    ],
    "inStock": true,
    "stockCount": 20,
    "sku": "PL-006",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 4 kg",
        "weightOrSize": "4 kg",
        "price": 28900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Saco 12 kg",
        "weightOrSize": "12 kg",
        "price": 69900,
        "inStock": true
      }
    ],
    "benefits": [
      "Arenque salvaje deshidratado como única proteína animal",
      "Niveles elevados de Glucosamina y Condroitina para articulaciones",
      "Piel sin alergias ni rojeces gracias al Omega-3 puro",
      "Sin gluten, trigo, soya ni conservantes artificiales"
    ],
    "ingredients": [
      "Arenque deshidratado",
      "Tapioca",
      "Grasa de ave",
      "Guisantes",
      "Aceite de salmón",
      "Glucosamina",
      "Condroitina"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "26.0% mín",
      "Grasa bruta": "12.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "70 - 100 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "100 - 160 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "160 - 320 g"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "320 - 520 g"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-6",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-6",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-7",
    "name": "Bravery Herring Senior Large Medium Breeds +7 Years 12kg",
    "brand": "Bravery",
    "category": "perros",
    "categoryLabel": "Alimentos Perros",
    "petType": "perro",
    "lifeStage": "senior",
    "price": 72900,
    "rating": 4.9,
    "reviewsCount": 88,
    "weightOrSize": "12 kg",
    "icon": "🐕",
    "bgGradient": "from-amber-500/10 to-orange-500/10 text-orange-600",
    "description": "Nutrición especializada para perros senior mayores de 7 años, baja en fósforo y con soporte articular y cognitivo.",
    "longDescription": "Formulado para proteger los órganos vitales en la vejez: cuida los riñones mediante un control estricto de fósforo, estimula la agilidad articular y mantiene la masa muscular sin acumular grasa excesiva.",
    "imageUrl": "/productos/Bravery Herring Senior Large Medium Breeds +7 Years 12kg.jpeg",
    "galleryImages": [
      "/productos/Bravery Herring Senior Large Medium Breeds +7 Years 12kg.jpeg"
    ],
    "inStock": true,
    "stockCount": 34,
    "sku": "PL-007",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 4 kg",
        "weightOrSize": "4 kg",
        "price": 29900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Saco 12 kg",
        "weightOrSize": "12 kg",
        "price": 72900,
        "inStock": true
      }
    ],
    "benefits": [
      "Control renal con fósforo y sodio reducidos",
      "Doble dosis de condroprotectores para movilidad sin dolor",
      "Antioxidantes naturales para preservar la función cognitiva",
      "Fácil digestión para metabolismos lentos"
    ],
    "ingredients": [
      "Arenque deshidratado",
      "Tapioca",
      "Grasa de ave",
      "Fibra de manzana",
      "Glucosamina (1200 mg/kg)",
      "Condroitina"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "26.0% mín",
      "Grasa bruta": "12.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "70 - 100 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "100 - 160 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "160 - 320 g"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "320 - 520 g"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-7",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-7",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-8",
    "name": "Bravery Salmon Adult Cat 7kg",
    "brand": "Bravery",
    "category": "gatos",
    "categoryLabel": "Alimentos Gatos",
    "petType": "gato",
    "lifeStage": "adulto",
    "price": 48900,
    "rating": 5,
    "reviewsCount": 132,
    "weightOrSize": "7 kg",
    "icon": "🐱",
    "bgGradient": "from-purple-500/10 to-pink-500/10 text-purple-600",
    "description": "Receta sin cereales a base de salmón del Atlántico rica en ácidos grasos Omega-3 para piel saludable y pelaje radiante.",
    "longDescription": "El alimento favorito de los felinos con paladares exigentes. Rico en salmón deshidratado, previene la formación de cálculos de estruvita mediante un pH urinario controlado entre 6.0 y 6.5.",
    "imageUrl": "/productos/Bravery Salmon Adult Cat 7kg.jpeg",
    "galleryImages": [
      "/productos/Bravery Salmon Adult Cat 7kg.jpeg"
    ],
    "inStock": true,
    "stockCount": 36,
    "sku": "PL-008",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 2 kg",
        "weightOrSize": "2 kg",
        "price": 18900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Saco 7 kg",
        "weightOrSize": "7 kg",
        "price": 52900,
        "inStock": true
      }
    ],
    "benefits": [
      "Salmón deshidratado como ingrediente estrella mono-proteico",
      "Pelaje ultra denso y brillante en pocas semanas",
      "Control del pH urinario para salud de la vejiga",
      "100% natural, sin transgénicos ni harinas de relleno"
    ],
    "ingredients": [
      "Salmón deshidratado",
      "Tapioca",
      "Grasa de ave",
      "Levadura de cerveza",
      "Aceite de salmón"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "32.0% mín",
      "Grasa bruta": "14.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "40 - 60 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "60 - 90 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "Libre demanda"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "Consultar veterinario"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-8",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-8",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-9",
    "name": "Champion Cat Arena Aglomerante Bentonita con Carbon Activo 10kg",
    "brand": "Champion Cat",
    "category": "higiene",
    "categoryLabel": "Arenas & Higiene",
    "petType": "gato",
    "lifeStage": "todas",
    "price": 12900,
    "rating": 4.8,
    "reviewsCount": 110,
    "weightOrSize": "10 kg",
    "icon": "✨",
    "bgGradient": "from-cyan-500/10 to-blue-500/10 text-cyan-600",
    "description": "Arena sanitaria aglomerante de bentonita natural con carbón activo para una máxima absorción y bloqueo de olores.",
    "longDescription": "El poder del carbón activado atrapa las moléculas de amoníaco antes de que se evaporen al ambiente. Su granulometría seleccionada evita el arrastre de piedrecitas fuera del arenero.",
    "imageUrl": "/productos/Champion Cat Arena Aglomerante Bentonita con Carbon Activo 10kg.jpeg",
    "galleryImages": [
      "/productos/Champion Cat Arena Aglomerante Bentonita con Carbon Activo 10kg.jpeg"
    ],
    "inStock": true,
    "stockCount": 29,
    "sku": "PL-009",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 10 kg",
        "weightOrSize": "10 kg",
        "price": 12900,
        "inStock": true
      }
    ],
    "benefits": [
      "Carbón activado microporoso que elimina olores de raíz",
      "Terrones firmes fáciles de palear sin romperse",
      "Bajo nivel de polvo que no mancha las patitas",
      "Rendimiento superior para todo el mes"
    ],
    "ingredients": [
      "Bentonita natural seleccionada",
      "Carbón activado"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "26.0% mín",
      "Grasa bruta": "12.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "70 - 100 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "100 - 160 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "160 - 320 g"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "320 - 520 g"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-9",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-9",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-10",
    "name": "Diamond Naturals Indoor Cat Chicken and Rice Formula",
    "brand": "Diamond Naturals",
    "category": "gatos",
    "categoryLabel": "Alimentos Gatos",
    "petType": "gato",
    "lifeStage": "adulto",
    "price": 38900,
    "rating": 4.9,
    "reviewsCount": 124,
    "weightOrSize": "7.5 kg",
    "icon": "🐱",
    "bgGradient": "from-purple-500/10 to-pink-500/10 text-purple-600",
    "description": "Nutrición holística con pollo de libre pastoreo y arroz integral, diseñada para gatos que viven en el hogar.",
    "longDescription": "Proporciona niveles óptimos de calorías y fibra dietética para gatos sedentarios de interior. Contiene superalimentos como col rizada, arándanos y chía combinados con probióticos K9 Strain activos garantizados.",
    "imageUrl": "/productos/Diamond Naturals Indoor Cat Chicken and Rice Formula.jpeg",
    "galleryImages": [
      "/productos/Diamond Naturals Indoor Cat Chicken and Rice Formula.jpeg"
    ],
    "inStock": true,
    "stockCount": 19,
    "sku": "PL-010",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 2.7 kg",
        "weightOrSize": "2.7 kg",
        "price": 19900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Saco 7.5 kg",
        "weightOrSize": "7.5 kg",
        "price": 38900,
        "inStock": true
      }
    ],
    "benefits": [
      "Pollo real de jaula libre como ingrediente número uno",
      "Control de bolas de pelo con celulosa insoluble natural",
      "Superalimentos ricos en antioxidantes celulares",
      "Probióticos viables patentados para salud intestinal"
    ],
    "ingredients": [
      "Pollo",
      "Harina de pollo",
      "Arroz integral",
      "Espinacas",
      "Chía",
      "Arándanos"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "32.0% mín",
      "Grasa bruta": "14.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "40 - 60 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "60 - 90 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "Libre demanda"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "Consultar veterinario"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-10",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-10",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-11",
    "name": "Diamond Naturals Indoor Cat Chicken and Rice",
    "brand": "Diamond Naturals",
    "category": "gatos",
    "categoryLabel": "Alimentos Gatos",
    "petType": "gato",
    "lifeStage": "adulto",
    "price": 19900,
    "rating": 4.8,
    "reviewsCount": 76,
    "weightOrSize": "2.7 kg",
    "icon": "🐱",
    "bgGradient": "from-purple-500/10 to-pink-500/10 text-purple-600",
    "description": "Formato práctico de 2.7 kg con pollo, arroz y superalimentos para gatos de departamento.",
    "longDescription": "La presentación ideal para mantener el alimento fresco y crujiente en cada ración. Contiene taurina esencial, ácidos grasos Omega y cero subproductos de maíz o trigo.",
    "imageUrl": "/productos/Diamond Naturals Indoor Cat Chicken and Rice.jpeg",
    "galleryImages": [
      "/productos/Diamond Naturals Indoor Cat Chicken and Rice.jpeg"
    ],
    "inStock": true,
    "stockCount": 38,
    "sku": "PL-011",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 2.7 kg",
        "weightOrSize": "2.7 kg",
        "price": 19900,
        "inStock": true
      }
    ],
    "benefits": [
      "Fresco y crujiente: tamaño ideal para 1 mes de nutrición",
      "Digestión suave con arroz blanco e integral",
      "Omegas 3 y 6 para pelaje suave y sedoso",
      "Sin colorantes ni saborizantes artificiales"
    ],
    "ingredients": [
      "Pollo",
      "Arroz blanco molido",
      "Arroz integral",
      "Pulpa de remolacha",
      "Linaza"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "32.0% mín",
      "Grasa bruta": "14.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "40 - 60 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "60 - 90 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "Libre demanda"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "Consultar veterinario"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-11",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-11",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-12",
    "name": "DuoMai Super Absorbent Puppy Pads 60x60cm 24 pcs",
    "brand": "DuoMai",
    "category": "higiene",
    "categoryLabel": "Arenas & Higiene",
    "petType": "perro",
    "lifeStage": "todas",
    "price": 14900,
    "rating": 4.9,
    "reviewsCount": 95,
    "weightOrSize": "24 pcs (60x60cm)",
    "icon": "✨",
    "bgGradient": "from-cyan-500/10 to-blue-500/10 text-cyan-600",
    "description": "Sabanillas higiénicas ultra absorbentes de 60x60 cm con polímero bloqueador de líquidos para adiestramiento.",
    "longDescription": "Tecnología de 5 capas de protección con núcleo de polímero que convierte la orina en gel en segundos. Base de polietileno impermeable con bordes anti-desborde para mantener pisos impecables.",
    "imageUrl": "/productos/DuoMai Super Absorbent Puppy Pads 60x60cm 24 pcs.jpeg",
    "galleryImages": [
      "/productos/DuoMai Super Absorbent Puppy Pads 60x60cm 24 pcs.jpeg"
    ],
    "inStock": true,
    "stockCount": 23,
    "sku": "PL-012",
    "variants": [
      {
        "id": "v1",
        "label": "Paquete 24 pcs",
        "weightOrSize": "24 pcs",
        "price": 14900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Pack Ahorro 48 pcs",
        "weightOrSize": "48 pcs",
        "price": 26900,
        "inStock": true
      }
    ],
    "benefits": [
      "Gelifica líquidos en segundos evitando que el perro se moje las patas",
      "Bordes sellados que evitan filtraciones laterales en el suelo",
      "Atrayente aromático sutil para guiar al cachorro",
      "Ideal para departamentos, posoperatorios y cachorros"
    ],
    "ingredients": [
      "Polímero superabsorbente (SAP)",
      "Pulpa de celulosa virgen",
      "Lámina inferior de polietileno"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "26.0% mín",
      "Grasa bruta": "12.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "70 - 100 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "100 - 160 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "160 - 320 g"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "320 - 520 g"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-12",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-12",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-13",
    "name": "DuoMai Super Absorbent Puppy Pads Bamboo Charcoal 33x45cm 12 pcs",
    "brand": "DuoMai",
    "category": "higiene",
    "categoryLabel": "Arenas & Higiene",
    "petType": "perro",
    "lifeStage": "todas",
    "price": 9900,
    "rating": 4.8,
    "reviewsCount": 64,
    "weightOrSize": "12 pcs (33x45cm)",
    "icon": "✨",
    "bgGradient": "from-cyan-500/10 to-blue-500/10 text-cyan-600",
    "description": "Tapetes absorbentes con carbón vegetal de bambú que oculta manchas amarillas y neutraliza olores de pipí.",
    "longDescription": "El carbón de bambú activado proporciona una apariencia limpia de color negro que disimula las manchas visuales y neutraliza el fuerte olor a amoníaco. Tamaño ideal para razas pequeñas y transportadoras.",
    "imageUrl": "/productos/DuoMai Super Absorbent Puppy Pads Bamboo Charcoal 33x45cm 12 pcs.jpeg",
    "galleryImages": [
      "/productos/DuoMai Super Absorbent Puppy Pads Bamboo Charcoal 33x45cm 12 pcs.jpeg"
    ],
    "inStock": true,
    "stockCount": 37,
    "sku": "PL-013",
    "variants": [
      {
        "id": "v1",
        "label": "Paquete 12 pcs",
        "weightOrSize": "12 pcs",
        "price": 9900,
        "inStock": true
      }
    ],
    "benefits": [
      "Color carbón elegante que no deja ver manchas amarillas",
      "Desodorización profunda gracias al carbón de bambú",
      "Tamaño compacto ideal para cachorros minis y caniles",
      "Base antideslizante impermeable"
    ],
    "ingredients": [
      "Carbón activado de bambú",
      "Polímero SAP",
      "Polietileno impermeable"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "26.0% mín",
      "Grasa bruta": "12.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "70 - 100 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "100 - 160 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "160 - 320 g"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "320 - 520 g"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-13",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-13",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-14",
    "name": "Fit Formula Perro Adulto 20kg",
    "brand": "Fit Formula",
    "category": "perros",
    "categoryLabel": "Alimentos Perros",
    "petType": "perro",
    "lifeStage": "adulto",
    "price": 39900,
    "rating": 4.8,
    "reviewsCount": 180,
    "weightOrSize": "20 kg",
    "icon": "🐕",
    "bgGradient": "from-amber-500/10 to-orange-500/10 text-orange-600",
    "description": "Alimento completo desarrollado para cubrir todas las necesidades nutricionales de perros adultos con gran palatabilidad.",
    "longDescription": "Desarrollado en Chile por médicos veterinarios, Fit Formula Adulto aporta proteínas de alta calidad, vitaminas del complejo B y minerales quelados para una condición física atlética y activa.",
    "imageUrl": "/productos/Fit Formula Perro Adulto 20kg.jpeg",
    "galleryImages": [
      "/productos/Fit Formula Perro Adulto 20kg.jpeg"
    ],
    "inStock": true,
    "stockCount": 23,
    "sku": "PL-014",
    "variants": [
      {
        "id": "v1",
        "label": "Saco 20 kg",
        "weightOrSize": "20 kg",
        "price": 39900,
        "inStock": true
      }
    ],
    "benefits": [
      "Proteína animal de excelente asimilación para músculos firmes",
      "Ácidos grasos esenciales para salud de la piel y pelaje",
      "Extracto de Yucca Schidigera que minimiza el olor de las heces",
      "Excelente rendimiento y economía por kilogramo"
    ],
    "ingredients": [
      "Harina de subproductos de ave",
      "Maíz grano molido",
      "Arroz",
      "Harina de carne",
      "Extracto de yucca"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "26.0% mín",
      "Grasa bruta": "12.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "70 - 100 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "100 - 160 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "160 - 320 g"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "320 - 520 g"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-14",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-14",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-15",
    "name": "Happypets Healthy Rodents Conejos y Cuyes 500g",
    "brand": "Happypets",
    "category": "snacks",
    "categoryLabel": "Pequeñas Mascotas",
    "petType": "ambos",
    "lifeStage": "todas",
    "price": 3000,
    "rating": 4.9,
    "reviewsCount": 42,
    "weightOrSize": "500 g",
    "icon": "🐹",
    "bgGradient": "from-emerald-500/10 to-teal-500/10 text-emerald-600",
    "description": "Mix balanceado de heno, cereales y vegetales deshidratados con vitamina C estabilizada para conejos y cobayos.",
    "longDescription": "Nutrición rica en fibras largas que favorece el desgaste dental fisiológico y la motilidad digestiva. Aporta vitamina C esencial no sintetizable por los cobayos para prevenir el escorbuto.",
    "imageUrl": "/productos/Happypets Healthy Rodents Conejos y Cuyes 500g.jpeg",
    "galleryImages": [
      "/productos/Happypets Healthy Rodents Conejos y Cuyes 500g.jpeg"
    ],
    "inStock": true,
    "stockCount": 17,
    "sku": "PL-015",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 500 g",
        "weightOrSize": "500 g",
        "price": 3000,
        "inStock": true
      }
    ],
    "benefits": [
      "Alto contenido en fibra cruda para el correcto desgaste dental",
      "Vitamina C estabilizada indispensable para cuyes y cobayos",
      "Previene el sobrepeso con bajo nivel de azúcares simples",
      "Enriquecido con manzana y zanahoria deshidratada"
    ],
    "ingredients": [
      "Heno de timothy",
      "Alfalfa peletizada",
      "Zanahoria deshidratada",
      "Copos de avena",
      "Vitamina C"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "26.0% mín",
      "Grasa bruta": "12.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "70 - 100 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "100 - 160 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "160 - 320 g"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "320 - 520 g"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-15",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-15",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-16",
    "name": "Happypets Healthy Rodents Mezcla para Cuyes Hamster y Ardillas 500g",
    "brand": "Happypets",
    "category": "snacks",
    "categoryLabel": "Pequeñas Mascotas",
    "petType": "ambos",
    "lifeStage": "todas",
    "price": 3000,
    "rating": 4.9,
    "reviewsCount": 38,
    "weightOrSize": "500 g",
    "icon": "🐹",
    "bgGradient": "from-emerald-500/10 to-teal-500/10 text-emerald-600",
    "description": "Mezcla seleccionada de semillas, frutos secos y pellets de alfalfa para hámsters, ardillas y cuyes activos.",
    "longDescription": "Variedad de texturas y semillas crujientes que estimulan el forrajeo natural y previenen el estrés en roedores pequeños. 100% natural, sin conservantes químicos.",
    "imageUrl": "/productos/Happypets Healthy Rodents Mezcla para Cuyes Hamster y Ardillas 500g.jpeg",
    "galleryImages": [
      "/productos/Happypets Healthy Rodents Mezcla para Cuyes Hamster y Ardillas 500g.jpeg"
    ],
    "inStock": true,
    "stockCount": 28,
    "sku": "PL-016",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 500 g",
        "weightOrSize": "500 g",
        "price": 3000,
        "inStock": true
      }
    ],
    "benefits": [
      "Estimula el comportamiento de forrajeo natural de los roedores",
      "Grasas saludables y proteína de semillas de girasol y maíz",
      "Ayuda a mantener la vitalidad y brillo del pelaje",
      "Mix variado de apetencia garantizada"
    ],
    "ingredients": [
      "Semillas de girasol rayadas",
      "Maíz partido",
      "Trigo inflado",
      "Cacahuetes sin sal",
      "Pellets de heno"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "26.0% mín",
      "Grasa bruta": "12.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "70 - 100 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "100 - 160 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "160 - 320 g"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "320 - 520 g"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-16",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-16",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-17",
    "name": "Leonardo Adult Duck Cat Food",
    "brand": "Leonardo",
    "category": "gatos",
    "categoryLabel": "Alimentos Gatos",
    "petType": "gato",
    "lifeStage": "adulto",
    "price": 49900,
    "rating": 5,
    "reviewsCount": 68,
    "weightOrSize": "7.5 kg",
    "icon": "🐱",
    "bgGradient": "from-purple-500/10 to-pink-500/10 text-purple-600",
    "description": "Nutrición alemana super premium elaborada con carne fresca de pato y chía para gatos sibaritas.",
    "longDescription": "Leonardo Adult Duck combina carne fresca de pato con malta natural para expulsar bolas de pelo con facilidad. Fortalece el sistema inmunitario mediante ProVital a base de beta-glucanos naturales.",
    "imageUrl": "/productos/Leonardo Adult Duck Cat Food.jpeg",
    "galleryImages": [
      "/productos/Leonardo Adult Duck Cat Food.jpeg"
    ],
    "inStock": true,
    "stockCount": 33,
    "sku": "PL-017",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 1.8 kg",
        "weightOrSize": "1.8 kg",
        "price": 18900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Saco 7.5 kg",
        "weightOrSize": "7.5 kg",
        "price": 49900,
        "inStock": true
      }
    ],
    "benefits": [
      "Carne fresca de pato (30%) de digestibilidad insuperable",
      "STAY-Clean: reduce la placa bacteriana dental",
      "Malta aromática que previene la formación de bolas de pelo",
      "Ph-control para la salud de las vías urinarias"
    ],
    "ingredients": [
      "Carne fresca de pato",
      "Proteína de ave deshidratada",
      "Arroz",
      "Semillas de chía",
      "Malta de centeno"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "32.0% mín",
      "Grasa bruta": "14.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "40 - 60 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "60 - 90 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "Libre demanda"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "Consultar veterinario"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-17",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-17",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-18",
    "name": "Loops Arena Sanitaria Bentonita Super Aglutinante Lavanda 9kg",
    "brand": "Loops",
    "category": "higiene",
    "categoryLabel": "Arenas & Higiene",
    "petType": "gato",
    "lifeStage": "todas",
    "price": 12900,
    "rating": 4.8,
    "reviewsCount": 82,
    "weightOrSize": "9 kg",
    "icon": "✨",
    "bgGradient": "from-cyan-500/10 to-blue-500/10 text-cyan-600",
    "description": "Arena sanitaria aglutinante con micro-cápsulas de lavanda que liberan frescura al contacto con las patitas.",
    "longDescription": "Bentonita sódica aglomerante que neutraliza de inmediato los fuertes olores de orina. Forma esferas duras que se retiran sin ensuciar la bandeja sanitaria.",
    "imageUrl": "/productos/Loops Arena Sanitaria Bentonita Super Aglutinante Lavanda 9kg.jpeg",
    "galleryImages": [
      "/productos/Loops Arena Sanitaria Bentonita Super Aglutinante Lavanda 9kg.jpeg"
    ],
    "inStock": true,
    "stockCount": 24,
    "sku": "PL-018",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 9 kg",
        "weightOrSize": "9 kg",
        "price": 12900,
        "inStock": true
      }
    ],
    "benefits": [
      "Fragancia calmante de lavanda que dura semanas",
      "Aglutinación de gran firmeza: no se desmorona",
      "Control bacteriano eficaz que mantiene el arenero fresco",
      "Grano fino suave con las almohadillas del gato"
    ],
    "ingredients": [
      "Bentonita 100% natural",
      "Esencia de lavanda microencapsulada"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "26.0% mín",
      "Grasa bruta": "12.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "70 - 100 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "100 - 160 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "160 - 320 g"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "320 - 520 g"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-18",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-18",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-19",
    "name": "Nomade Adulto Razas Medianas y Grandes 20kg",
    "brand": "Nomade",
    "category": "perros",
    "categoryLabel": "Alimentos Perros",
    "petType": "perro",
    "lifeStage": "adulto",
    "price": 42900,
    "rating": 4.9,
    "reviewsCount": 215,
    "weightOrSize": "20 kg",
    "icon": "🐕",
    "bgGradient": "from-amber-500/10 to-orange-500/10 text-orange-600",
    "description": "Alimento con extracto de quillay, omegas y proteínas de alto valor biológico para perros medianos y grandes.",
    "longDescription": "Nomade es reconocido en todo Chile por su óptima asimilación digestiva y su aporte de saponinas naturales de Quillay que reducen drásticamente el olor de las deposiciones.",
    "imageUrl": "/productos/Nomade Adulto Razas Medianas y Grandes 20kg.jpeg",
    "galleryImages": [
      "/productos/Nomade Adulto Razas Medianas y Grandes 20kg.jpeg"
    ],
    "inStock": true,
    "stockCount": 37,
    "sku": "PL-019",
    "variants": [
      {
        "id": "v1",
        "label": "Saco 20 kg",
        "weightOrSize": "20 kg",
        "price": 42900,
        "inStock": true
      }
    ],
    "benefits": [
      "Extracto de Quillay que reduce notablemente el olor de las heces",
      "Omegas 3 y 6 para pelaje brillante y piel hidratada",
      "Hexametafosfato de sodio que previene el sarro dental",
      "Excelente rendimiento calórico para perros activos"
    ],
    "ingredients": [
      "Harinas de carnes seleccionadas",
      "Maíz",
      "Arroz",
      "Extracto de quillay",
      "Aceite de salmón"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "26.0% mín",
      "Grasa bruta": "12.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "70 - 100 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "100 - 160 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "160 - 320 g"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "320 - 520 g"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-19",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-19",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-20",
    "name": "Nomade Arena Sanitaria Extra Poder Aglutinante 10kg",
    "brand": "Nomade",
    "category": "higiene",
    "categoryLabel": "Arenas & Higiene",
    "petType": "gato",
    "lifeStage": "todas",
    "price": 14500,
    "rating": 4.8,
    "reviewsCount": 90,
    "weightOrSize": "10 kg",
    "icon": "✨",
    "bgGradient": "from-cyan-500/10 to-blue-500/10 text-cyan-600",
    "description": "Bentonita sódica de máxima calidad con esferas de aglutinación rápida y duradera que facilitan la limpieza.",
    "longDescription": "Su tecnología aglomerante avanzada encapsula los líquidos al instante, impidiendo que el fondo de la bandeja se moje y prolongando la vida útil del arenero.",
    "imageUrl": "/productos/Nomade Arena Sanitaria Extra Poder Aglutinante 10kg.jpeg",
    "galleryImages": [
      "/productos/Nomade Arena Sanitaria Extra Poder Aglutinante 10kg.jpeg"
    ],
    "inStock": true,
    "stockCount": 24,
    "sku": "PL-020",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 10 kg",
        "weightOrSize": "10 kg",
        "price": 14500,
        "inStock": true
      }
    ],
    "benefits": [
      "Absorción extra potente que neutraliza olores de inmediato",
      "Bajo polvo para proteger los pulmones de tu mascota",
      "Remoción fácil y limpia con cualquier pala sanitaria",
      "Calidad garantizada por la marca Nomade"
    ],
    "ingredients": [
      "Bentonita sódica aglomerante"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "26.0% mín",
      "Grasa bruta": "12.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "70 - 100 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "100 - 160 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "160 - 320 g"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "320 - 520 g"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-20",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-20",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-21",
    "name": "Nomade Gato Adulto Mix Proteico 10kg",
    "brand": "Nomade",
    "category": "gatos",
    "categoryLabel": "Alimentos Gatos",
    "petType": "gato",
    "lifeStage": "adulto",
    "price": 31900,
    "rating": 4.8,
    "reviewsCount": 135,
    "weightOrSize": "10 kg",
    "icon": "🐱",
    "bgGradient": "from-purple-500/10 to-pink-500/10 text-purple-600",
    "description": "Combinación balanceada de carnes, pescado y taurina esencial para la salud cardíaca y visual de gatos adultos.",
    "longDescription": "Un alimento completo con sabor irresistible para felinos. Diseñado para mantener el tracto urinario despejado y sano con un control adecuado de minerales y cenizas.",
    "imageUrl": "/productos/Nomade Gato Adulto Mix Proteico 10kg.jpeg",
    "galleryImages": [
      "/productos/Nomade Gato Adulto Mix Proteico 10kg.jpeg"
    ],
    "inStock": true,
    "stockCount": 16,
    "sku": "PL-021",
    "variants": [
      {
        "id": "v1",
        "label": "Saco 10 kg",
        "weightOrSize": "10 kg",
        "price": 31900,
        "inStock": true
      }
    ],
    "benefits": [
      "Taurina esencial para visión aguda y corazón vigoroso",
      "Control de pH urinario para prevenir urolitiasis",
      "Extracto de quillay para heces más compactas y sin mal olor",
      "Mix de sabores que fascina a los gatos"
    ],
    "ingredients": [
      "Harina de pescado",
      "Harina de carne y ave",
      "Maíz",
      "Taurina",
      "Extracto de quillay"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "32.0% mín",
      "Grasa bruta": "14.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "40 - 60 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "60 - 90 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "Libre demanda"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "Consultar veterinario"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-21",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-21",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-22",
    "name": "Pampa Premium Total Protection Gatos Adultos 2",
    "brand": "Pampa",
    "category": "gatos",
    "categoryLabel": "Alimentos Gatos",
    "petType": "gato",
    "lifeStage": "adulto",
    "price": 26900,
    "rating": 4.7,
    "reviewsCount": 58,
    "weightOrSize": "8 kg",
    "icon": "🐱",
    "bgGradient": "from-purple-500/10 to-pink-500/10 text-purple-600",
    "description": "Nutrición con probióticos activos, pulpa de remolacha y control de pH urinario para gatos hogareños.",
    "longDescription": "Alimento premium formulado con ingredientes seleccionados para apoyar las defensas naturales y brindar un pelaje brillante a gatos adultos de interior y exterior.",
    "imageUrl": "/productos/Pampa Premium Total Protection Gatos Adultos 2.jpeg",
    "galleryImages": [
      "/productos/Pampa Premium Total Protection Gatos Adultos 2.jpeg"
    ],
    "inStock": true,
    "stockCount": 28,
    "sku": "PL-022",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 8 kg",
        "weightOrSize": "8 kg",
        "price": 26900,
        "inStock": true
      }
    ],
    "benefits": [
      "Probióticos y prebióticos para digestión saludable",
      "Taurina y metionina para protección urinaria",
      "Omegas esenciales para pelaje suave",
      "Gran apetencia y textura crujiente"
    ],
    "ingredients": [
      "Harina de carne",
      "Harina de pollo",
      "Maíz",
      "Pulpa de remolacha",
      "Grasa bovina"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "32.0% mín",
      "Grasa bruta": "14.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "40 - 60 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "60 - 90 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "Libre demanda"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "Consultar veterinario"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-22",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-22",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-23",
    "name": "Pampa Premium Total Protection Gatos Adultos",
    "brand": "Pampa",
    "category": "gatos",
    "categoryLabel": "Alimentos Gatos",
    "petType": "gato",
    "lifeStage": "adulto",
    "price": 42900,
    "rating": 4.7,
    "reviewsCount": 72,
    "weightOrSize": "15 kg",
    "icon": "🐱",
    "bgGradient": "from-purple-500/10 to-pink-500/10 text-purple-600",
    "description": "Formato económico de 15 kg para hogares con múltiples gatos, con protección inmunológica y renal.",
    "longDescription": "La opción más conveniente para alimentar a varios felinos manteniendo una nutrición balanceada y de calidad garantizada durante meses.",
    "imageUrl": "/productos/Pampa Premium Total Protection Gatos Adultos.jpeg",
    "galleryImages": [
      "/productos/Pampa Premium Total Protection Gatos Adultos.jpeg"
    ],
    "inStock": true,
    "stockCount": 32,
    "sku": "PL-023",
    "variants": [
      {
        "id": "v1",
        "label": "Saco 15 kg",
        "weightOrSize": "15 kg",
        "price": 47900,
        "inStock": true
      }
    ],
    "benefits": [
      "Excelente rendimiento por kilogramo para varios gatos",
      "Proteínas animales balanceadas para masa muscular",
      "Fibra digestiva que previene el estreñimiento",
      "Enriquecido con vitaminas A, D3 y E"
    ],
    "ingredients": [
      "Harina de carne y hueso",
      "Harina de ave",
      "Arroz",
      "Aceite vegetal",
      "Minerales"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "32.0% mín",
      "Grasa bruta": "14.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "40 - 60 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "60 - 90 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "Libre demanda"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "Consultar veterinario"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-23",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-23",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-24",
    "name": "Purina Cat Chow Adultos Pescado",
    "brand": "Purina Cat Chow",
    "category": "gatos",
    "categoryLabel": "Alimentos Gatos",
    "petType": "gato",
    "lifeStage": "adulto",
    "price": 28900,
    "rating": 4.8,
    "reviewsCount": 190,
    "weightOrSize": "8 kg",
    "icon": "🐱",
    "bgGradient": "from-purple-500/10 to-pink-500/10 text-purple-600",
    "description": "Con tecnología Defense Plus, antioxidantes y rico sabor a pescado para proteger la vitalidad de tu gato.",
    "longDescription": "Cat Chow Pescado está formulado con fuentes naturales de fibra, antioxidantes y vitaminas que fortalecen el sistema inmunológico y protegen el tracto urinario de los felinos.",
    "imageUrl": "/productos/Purina Cat Chow Adultos Pescado.jpeg",
    "galleryImages": [
      "/productos/Purina Cat Chow Adultos Pescado.jpeg"
    ],
    "inStock": true,
    "stockCount": 27,
    "sku": "PL-024",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 3 kg",
        "weightOrSize": "3 kg",
        "price": 12900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Bolsa 8 kg",
        "weightOrSize": "8 kg",
        "price": 28900,
        "inStock": true
      }
    ],
    "benefits": [
      "Tecnología Defense Plus con vitaminas y minerales esenciales",
      "Proteínas de pescado de alta digestibilidad",
      "Control de pH urinario para salud de riñones y vejiga",
      "Sin colorantes artificiales añadidos"
    ],
    "ingredients": [
      "Harina de pescado",
      "Harina de subproductos de pollo",
      "Maíz amarillo",
      "Trigo",
      "Taurina"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "32.0% mín",
      "Grasa bruta": "14.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "40 - 60 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "60 - 90 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "Libre demanda"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "Consultar veterinario"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-24",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-24",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-25",
    "name": "Purina One Adultos Pollo y Salmon 2kg",
    "brand": "Purina One",
    "category": "gatos",
    "categoryLabel": "Alimentos Gatos",
    "petType": "gato",
    "lifeStage": "adulto",
    "price": 18900,
    "rating": 4.9,
    "reviewsCount": 104,
    "weightOrSize": "2 kg",
    "icon": "🐱",
    "bgGradient": "from-purple-500/10 to-pink-500/10 text-purple-600",
    "description": "Nutrición superior con carne real de pollo y salmón como ingredientes #1 para energía y digestión en 28 días.",
    "longDescription": "Purina ONE combina ingredientes naturales con croquetas crujientes y tiernas que producen cambios visibles en la salud de tu gato en solo 28 días: mayor energía, ojos brillantes y pelaje sedoso.",
    "imageUrl": "/productos/Purina One Adultos Pollo y Salmon 2kg.jpeg",
    "galleryImages": [
      "/productos/Purina One Adultos Pollo y Salmon 2kg.jpeg"
    ],
    "inStock": true,
    "stockCount": 22,
    "sku": "PL-025",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 2 kg",
        "weightOrSize": "2 kg",
        "price": 18900,
        "inStock": true
      }
    ],
    "benefits": [
      "Carne real de pollo y salmón como ingredientes número 1",
      "Cambio visible en la vitalidad y brillo del pelaje en 28 días",
      "Prebiótico natural que fortalece la microbiota intestinal",
      "Taurina natural para corazón y retina saludables"
    ],
    "ingredients": [
      "Pollo",
      "Salmón",
      "Harina de pollo",
      "Arroz",
      "Grasa vacuna",
      "Inulina"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "32.0% mín",
      "Grasa bruta": "14.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "40 - 60 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "60 - 90 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "Libre demanda"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "Consultar veterinario"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-25",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-25",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-26",
    "name": "Purina One Perros Adultos Medianos y Grandes Pollo y Cordero",
    "brand": "Purina One",
    "category": "perros",
    "categoryLabel": "Alimentos Perros",
    "petType": "perro",
    "lifeStage": "adulto",
    "price": 52900,
    "rating": 4.9,
    "reviewsCount": 128,
    "weightOrSize": "15 kg",
    "icon": "🐕",
    "bgGradient": "from-amber-500/10 to-orange-500/10 text-orange-600",
    "description": "Combinación crujiente de croquetas y bocados tiernos de pollo y cordero para músculos fuertes y articulaciones.",
    "longDescription": "Fórmula de nutrición avanzada con carne real como primer ingrediente. Diseñada para mantener el peso ideal y la masa muscular en perros de razas medianas y grandes.",
    "imageUrl": "/productos/Purina One Perros Adultos Medianos y Grandes Pollo y Cordero.jpeg",
    "galleryImages": [
      "/productos/Purina One Perros Adultos Medianos y Grandes Pollo y Cordero.jpeg"
    ],
    "inStock": true,
    "stockCount": 25,
    "sku": "PL-026",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 3.5 kg",
        "weightOrSize": "3.5 kg",
        "price": 17900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Saco 15 kg",
        "weightOrSize": "15 kg",
        "price": 47900,
        "inStock": true
      }
    ],
    "benefits": [
      "Carne real de pollo y cordero como primer ingrediente",
      "Bocados tiernos y croquetas crujientes de doble textura",
      "Glucosamina natural para soporte de cadera y rodillas",
      "Digestión óptima y absorción de nutrientes comprobada"
    ],
    "ingredients": [
      "Pollo",
      "Cordero",
      "Arroz cervecero",
      "Harina de ave",
      "Aceite de pescado"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "26.0% mín",
      "Grasa bruta": "12.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "70 - 100 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "100 - 160 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "160 - 320 g"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "320 - 520 g"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-26",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-26",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-27",
    "name": "Purina One Perros Adultos Minis y Pequenos Pollo y Cordero",
    "brand": "Purina One",
    "category": "perros",
    "categoryLabel": "Alimentos Perros",
    "petType": "perro",
    "lifeStage": "adulto",
    "price": 34900,
    "rating": 4.9,
    "reviewsCount": 115,
    "weightOrSize": "7.5 kg",
    "icon": "🐕",
    "bgGradient": "from-amber-500/10 to-orange-500/10 text-orange-600",
    "description": "Bocados de tamaño adaptado a mandíbulas pequeñas con pollo y cordero para un metabolismo acelerado y activo.",
    "longDescription": "Los perros minis queman energía más rápidamente. Esta receta concentra nutrientes y calorías precisas en croquetas pequeñas que cuidan sus dientes y satisfacen su apetito exigente.",
    "imageUrl": "/productos/Purina One Perros Adultos Minis y Pequenos Pollo y Cordero.jpeg",
    "galleryImages": [
      "/productos/Purina One Perros Adultos Minis y Pequenos Pollo y Cordero.jpeg"
    ],
    "inStock": true,
    "stockCount": 25,
    "sku": "PL-027",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 1.5 kg",
        "weightOrSize": "1.5 kg",
        "price": 9900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Saco 7.5 kg",
        "weightOrSize": "7.5 kg",
        "price": 34900,
        "inStock": true
      }
    ],
    "benefits": [
      "Croqueta mini fácil de masticar que combate el sarro",
      "Alto contenido calórico adaptado al metabolismo de razas minis",
      "Pollo y cordero reales para máxima palatabilidad",
      "Piel radiante con ácidos grasos Omega 6"
    ],
    "ingredients": [
      "Pollo",
      "Cordero",
      "Harina de subproductos de ave",
      "Arroz",
      "Grasa animal"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "26.0% mín",
      "Grasa bruta": "12.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "70 - 100 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "100 - 160 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "160 - 320 g"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "320 - 520 g"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-27",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-27",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-28",
    "name": "Purina Pro Plan Adult Gatos Optiprebio",
    "brand": "Purina Pro Plan",
    "category": "gatos",
    "categoryLabel": "Alimentos Gatos",
    "petType": "gato",
    "lifeStage": "adulto",
    "price": 54900,
    "rating": 5,
    "reviewsCount": 175,
    "weightOrSize": "7.5 kg",
    "icon": "🐱",
    "bgGradient": "from-purple-500/10 to-pink-500/10 text-purple-600",
    "description": "Nutrición médica veterinaria con prebióticos naturales que optimizan la digestión y refuerzan las defensas.",
    "longDescription": "Purina Pro Plan con Optiprebio incluye una mezcla exclusiva de prebióticos naturales que estabilizan la microflora intestinal, optimizan la absorción de nutrientes y protegen el tracto urinario felino.",
    "imageUrl": "/productos/Purina Pro Plan Adult Gatos Optiprebio.jpeg",
    "galleryImages": [
      "/productos/Purina Pro Plan Adult Gatos Optiprebio.jpeg"
    ],
    "inStock": true,
    "stockCount": 33,
    "sku": "PL-028",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 3 kg",
        "weightOrSize": "3 kg",
        "price": 27900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Saco 7.5 kg",
        "weightOrSize": "7.5 kg",
        "price": 54900,
        "inStock": true
      }
    ],
    "benefits": [
      "Tecnología Optiprebio con inulina de achicoria prebiótica",
      "Carne fresca de salmón y pollo de calidad superior",
      "Protección renal comprobada científicamente",
      "Reducción comprobada del olor de las deposiciones"
    ],
    "ingredients": [
      "Carne de pollo",
      "Salmón",
      "Arroz cervecero",
      "Inulina prebiótica",
      "Vitaminas C y E"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "32.0% mín",
      "Grasa bruta": "14.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "40 - 60 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "60 - 90 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "Libre demanda"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "Consultar veterinario"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-28",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-28",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-29",
    "name": "Purina Pro Plan Kitten Optistart",
    "brand": "Purina Pro Plan",
    "category": "gatos",
    "categoryLabel": "Alimentos Gatos",
    "petType": "gato",
    "lifeStage": "cachorro",
    "price": 29900,
    "rating": 5,
    "reviewsCount": 130,
    "weightOrSize": "3 kg",
    "icon": "🐱",
    "bgGradient": "from-purple-500/10 to-pink-500/10 text-purple-600",
    "description": "Formulado con calostro materno, anticuerpos naturales y DHA para un crecimiento y cerebro óptimos en gatitos.",
    "longDescription": "Optistart con calostro vacuno extiende la ventana de inmunidad materna tras el destete, estimulando las defensas naturales y promoviendo huesos y músculos fuertes.",
    "imageUrl": "/productos/Purina Pro Plan Kitten Optistart.jpeg",
    "galleryImages": [
      "/productos/Purina Pro Plan Kitten Optistart.jpeg"
    ],
    "inStock": true,
    "stockCount": 31,
    "sku": "PL-029",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 1 kg",
        "weightOrSize": "1 kg",
        "price": 11900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Bolsa 3 kg",
        "weightOrSize": "3 kg",
        "price": 29900,
        "inStock": true
      }
    ],
    "benefits": [
      "Calostro materno que refuerza el sistema inmunitario inmaduro",
      "Ácido graso DHA para desarrollo cerebral y agudeza visual",
      "Proteínas de pollo de alto valor biológico para crecimiento muscular",
      "Calcio y fósforo en balance exacto para huesos fuertes"
    ],
    "ingredients": [
      "Pollo",
      "Calostro bovino en polvo",
      "Aceite de pescado (fuente de DHA)",
      "Gluten de maíz"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "32.0% mín",
      "Grasa bruta": "14.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "40 - 60 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "60 - 90 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "Libre demanda"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "Consultar veterinario"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-29",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-29",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-30",
    "name": "Purina Pro Plan Puppy Razas Pequenas Optistart",
    "brand": "Purina Pro Plan",
    "category": "perros",
    "categoryLabel": "Alimentos Perros",
    "petType": "perro",
    "lifeStage": "cachorro",
    "price": 49900,
    "rating": 5,
    "reviewsCount": 154,
    "weightOrSize": "7.5 kg",
    "icon": "🐕",
    "bgGradient": "from-amber-500/10 to-orange-500/10 text-orange-600",
    "description": "Nutrición científica para cachorros de razas pequeñas con calostro vacuno que extiende la protección materna.",
    "longDescription": "Desarrollado para cachorros que alcanzan hasta 10 kg de peso adulto. Su croqueta pequeña favorece la prensión y masticación, mientras el calostro protege su delicado sistema digestivo.",
    "imageUrl": "/productos/Purina Pro Plan Puppy Razas Pequenas Optistart.jpeg",
    "galleryImages": [
      "/productos/Purina Pro Plan Puppy Razas Pequenas Optistart.jpeg"
    ],
    "inStock": true,
    "stockCount": 39,
    "sku": "PL-030",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 3 kg",
        "weightOrSize": "3 kg",
        "price": 24900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Saco 7.5 kg",
        "weightOrSize": "7.5 kg",
        "price": 49900,
        "inStock": true
      }
    ],
    "benefits": [
      "Calostro vacuno con anticuerpos naturales activos",
      "Estimula la respuesta ante las primeras vacunas del cachorro",
      "Croqueta de tamaño microscópico para mandíbulas minis",
      "Carne fresca de pollo como fuente proteica primordial"
    ],
    "ingredients": [
      "Carne de pollo",
      "Calostro bovino en polvo",
      "Arroz",
      "Grasa vacuna",
      "Aceite de pescado rico en DHA"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "26.0% mín",
      "Grasa bruta": "12.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "70 - 100 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "100 - 160 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "160 - 320 g"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "320 - 520 g"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-30",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-30",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-31",
    "name": "Purina Pro Plan Sterilized Gatos Optirenal",
    "brand": "Purina Pro Plan",
    "category": "gatos",
    "categoryLabel": "Alimentos Gatos",
    "petType": "gato",
    "lifeStage": "adulto",
    "price": 56900,
    "rating": 5,
    "reviewsCount": 165,
    "weightOrSize": "7.5 kg",
    "icon": "🐱",
    "bgGradient": "from-purple-500/10 to-pink-500/10 text-purple-600",
    "description": "Especialmente formulado para gatos esterilizados con calorías controladas y tecnología Optirenal para riñones sanos.",
    "longDescription": "Tras la castración, el metabolismo felino disminuye un 20%. Pro Plan Sterilized evita el aumento de peso y previene la formación de urolitos gracias a minerales equilibrados y un pH urinario controlado.",
    "imageUrl": "/productos/Purina Pro Plan Sterilized Gatos Optirenal.jpeg",
    "galleryImages": [
      "/productos/Purina Pro Plan Sterilized Gatos Optirenal.jpeg"
    ],
    "inStock": true,
    "stockCount": 27,
    "sku": "PL-031",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 3 kg",
        "weightOrSize": "3 kg",
        "price": 28900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Saco 7.5 kg",
        "weightOrSize": "7.5 kg",
        "price": 56900,
        "inStock": true
      }
    ],
    "benefits": [
      "Tecnología Optirenal clínicamente probada para salud renal",
      "Niveles reducidos de grasas y calorías para evitar el sobrepeso",
      "Fibras naturales que aumentan la saciedad del gato",
      "Control riguroso de pH urinario para evitar cálculos"
    ],
    "ingredients": [
      "Pollo",
      "Salmón",
      "Gluten de trigo",
      "Fibra de soja",
      "Aceite de pescado"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "32.0% mín",
      "Grasa bruta": "14.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "40 - 60 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "60 - 90 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "Libre demanda"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "Consultar veterinario"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-31",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-31",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-32",
    "name": "Purina Pro Plan Urinary Gatos",
    "brand": "Purina Pro Plan",
    "category": "gatos",
    "categoryLabel": "Alimentos Gatos",
    "petType": "gato",
    "lifeStage": "adulto",
    "price": 58900,
    "rating": 5,
    "reviewsCount": 140,
    "weightOrSize": "7.5 kg",
    "icon": "🐱",
    "bgGradient": "from-purple-500/10 to-pink-500/10 text-purple-600",
    "description": "Protección urinaria de grado veterinario que ayuda a mantener el pH urinario óptimo y disolver cálculos.",
    "longDescription": "Recomendado por veterinarios para felinos propensos a cistitis idiopática o cálculos de estruvita. Acidifica suavemente la orina y estimula el consumo de agua para diluir la concentración de minerales.",
    "imageUrl": "/productos/Purina Pro Plan Urinary Gatos.jpeg",
    "galleryImages": [
      "/productos/Purina Pro Plan Urinary Gatos.jpeg"
    ],
    "inStock": true,
    "stockCount": 36,
    "sku": "PL-032",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 3 kg",
        "weightOrSize": "3 kg",
        "price": 29900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Saco 7.5 kg",
        "weightOrSize": "7.5 kg",
        "price": 58900,
        "inStock": true
      }
    ],
    "benefits": [
      "Acidificación urinaria precisa para disolver urolitos de estruvita",
      "Bajo contenido de magnesio y fósforo para no saturar la vejiga",
      "Ácidos grasos Omega-3 que calman la inflamación de las vías urinarias",
      "Sabor irresistible que asegura ingesta continua"
    ],
    "ingredients": [
      "Carne de pollo",
      "Arroz",
      "Gluten de maíz",
      "Sulfato de glucosamina",
      "Aceite de salmón"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "32.0% mín",
      "Grasa bruta": "14.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "40 - 60 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "60 - 90 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "Libre demanda"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "Consultar veterinario"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-32",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-32",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-33",
    "name": "Raza Gatos Pollo y Leche 10kg",
    "brand": "Raza",
    "category": "gatos",
    "categoryLabel": "Alimentos Gatos",
    "petType": "gato",
    "lifeStage": "adulto",
    "price": 24900,
    "rating": 4.7,
    "reviewsCount": 75,
    "weightOrSize": "10 kg",
    "icon": "🐱",
    "bgGradient": "from-purple-500/10 to-pink-500/10 text-purple-600",
    "description": "Alimento completo con delicioso sabor a pollo y leche, enriquecido con vitaminas, minerales y omegas.",
    "longDescription": "La combinación favorita de sabor lácteo y proteínas de ave para gatos adultos. Proporciona una nutrición completa a un precio muy accesible.",
    "imageUrl": "/productos/Raza Gatos Pollo y Leche 10kg.jpeg",
    "galleryImages": [
      "/productos/Raza Gatos Pollo y Leche 10kg.jpeg"
    ],
    "inStock": true,
    "stockCount": 18,
    "sku": "PL-033",
    "variants": [
      {
        "id": "v1",
        "label": "Saco 10 kg",
        "weightOrSize": "10 kg",
        "price": 24900,
        "inStock": true
      }
    ],
    "benefits": [
      "Sabor apetecible a pollo con toque de leche",
      "Taurina añadida para mantener la agudeza visual",
      "Ácidos grasos para pelaje brillante",
      "Excelente valor por saco de 10 kg"
    ],
    "ingredients": [
      "Harina de pollo",
      "Maíz",
      "Arroz",
      "Leche en polvo deslactosada",
      "Grasa animal"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "32.0% mín",
      "Grasa bruta": "14.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "40 - 60 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "60 - 90 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "Libre demanda"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "Consultar veterinario"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-33",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-33",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-34",
    "name": "Taste of the Wild Rocky Mountain Feline Recipe",
    "brand": "Taste of the Wild",
    "category": "gatos",
    "categoryLabel": "Alimentos Gatos",
    "petType": "gato",
    "lifeStage": "todas",
    "price": 59900,
    "rating": 5,
    "reviewsCount": 185,
    "weightOrSize": "6.6 kg",
    "icon": "🐱",
    "bgGradient": "from-purple-500/10 to-pink-500/10 text-purple-600",
    "description": "Alimento libre de cereales con venado asado y salmón ahumado. Rica fuente de proteína salvaje para felinos.",
    "longDescription": "Inspirado en la dieta salvaje de los felinos ancestrales. Taste of the Wild Rocky Mountain combina venado asado y salmón ahumado con batatas, arándanos y frambuesas para una explosión de sabor y salud.",
    "imageUrl": "/productos/Taste of the Wild Rocky Mountain Feline Recipe.jpeg",
    "galleryImages": [
      "/productos/Taste of the Wild Rocky Mountain Feline Recipe.jpeg"
    ],
    "inStock": true,
    "stockCount": 15,
    "sku": "PL-034",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 2 kg",
        "weightOrSize": "2 kg",
        "price": 23900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Saco 6.6 kg",
        "weightOrSize": "6.6 kg",
        "price": 59900,
        "inStock": true
      }
    ],
    "benefits": [
      "Venado asado y salmón ahumado para paladares salvajes",
      "Sin granos, maíz, trigo ni subproductos artificiales",
      "Antioxidantes naturales de frambuesas y arándanos silvestres",
      "Ácidos grasos y zinc para pelaje exuberante"
    ],
    "ingredients": [
      "Harina de pollo",
      "Guisantes",
      "Batatas",
      "Venado asado",
      "Salmón ahumado",
      "Tomates",
      "Frambuesas"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "32.0% mín",
      "Grasa bruta": "14.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "40 - 60 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "60 - 90 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "Libre demanda"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "Consultar veterinario"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-34",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-34",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-35",
    "name": "Top One Gatos Adultos con Pollo y Salmon 9kg",
    "brand": "Top One",
    "category": "gatos",
    "categoryLabel": "Alimentos Gatos",
    "petType": "gato",
    "lifeStage": "adulto",
    "price": 27900,
    "rating": 4.8,
    "reviewsCount": 65,
    "weightOrSize": "9 kg",
    "icon": "🐱",
    "bgGradient": "from-purple-500/10 to-pink-500/10 text-purple-600",
    "description": "Receta equilibrada con proteínas de pollo y salmón, reforzada con taurina para corazón y vista.",
    "longDescription": "Top One Gatos combina dos fuentes de proteína de alta digestibilidad con minerales quelados para el bienestar diario de gatos adultos.",
    "imageUrl": "/productos/Top One Gatos Adultos con Pollo y Salmon 9kg.jpeg",
    "galleryImages": [
      "/productos/Top One Gatos Adultos con Pollo y Salmon 9kg.jpeg"
    ],
    "inStock": true,
    "stockCount": 26,
    "sku": "PL-035",
    "variants": [
      {
        "id": "v1",
        "label": "Saco 9 kg",
        "weightOrSize": "9 kg",
        "price": 27900,
        "inStock": true
      }
    ],
    "benefits": [
      "Sabor irresistible a pollo y salmón fresco",
      "Taurina y metionina para protección urinaria",
      "Pelaje brillante con ácidos grasos esenciales",
      "Gran formato económico para todo el mes"
    ],
    "ingredients": [
      "Harina de pollo",
      "Harina de salmón",
      "Maíz",
      "Arroz",
      "Aceite vegetal"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "32.0% mín",
      "Grasa bruta": "14.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "40 - 60 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "60 - 90 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "Libre demanda"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "Consultar veterinario"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-35",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-35",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-36",
    "name": "Top One Perros Adultos 10kg",
    "brand": "Top One",
    "category": "perros",
    "categoryLabel": "Alimentos Perros",
    "petType": "perro",
    "lifeStage": "adulto",
    "price": 22900,
    "rating": 4.7,
    "reviewsCount": 54,
    "weightOrSize": "10 kg",
    "icon": "🐕",
    "bgGradient": "from-amber-500/10 to-orange-500/10 text-orange-600",
    "description": "Nutrición balanceada con aminoácidos esenciales y prebióticos naturales para energía diaria en perros adultos.",
    "longDescription": "Diseñado para perros de todas las razas con actividad normal a alta. Aporta calcio y fósforo para huesos sanos y digestión equilibrada.",
    "imageUrl": "/productos/Top One Perros Adultos 10kg.jpeg",
    "galleryImages": [
      "/productos/Top One Perros Adultos 10kg.jpeg"
    ],
    "inStock": true,
    "stockCount": 30,
    "sku": "PL-036",
    "variants": [
      {
        "id": "v1",
        "label": "Saco 10 kg",
        "weightOrSize": "10 kg",
        "price": 22900,
        "inStock": true
      }
    ],
    "benefits": [
      "Energía equilibrada para perros activos",
      "Digestión sin gases con fibras seleccionadas",
      "Fortalece dientes y mandíbula al masticar",
      "Excelente relación costo-beneficio"
    ],
    "ingredients": [
      "Harina de carne",
      "Maíz",
      "Afrechillo de trigo",
      "Grasa vacuna",
      "Minerales"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "26.0% mín",
      "Grasa bruta": "12.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "70 - 100 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "100 - 160 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "160 - 320 g"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "320 - 520 g"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-36",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-36",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-37",
    "name": "Top One Perros Adultos Medianos y Grandes con Pollo 9kg",
    "brand": "Top One",
    "category": "perros",
    "categoryLabel": "Alimentos Perros",
    "petType": "perro",
    "lifeStage": "adulto",
    "price": 21900,
    "rating": 4.8,
    "reviewsCount": 60,
    "weightOrSize": "9 kg",
    "icon": "🐕",
    "bgGradient": "from-amber-500/10 to-orange-500/10 text-orange-600",
    "description": "Croquetas de tamaño adaptado a perros medianos y grandes que fomentan la masticación y la salud dental.",
    "longDescription": "El tamaño de bocado estimula la masticación pausada y limpia los dientes mediante abrasión mecánica suave durante cada comida.",
    "imageUrl": "/productos/Top One Perros Adultos Medianos y Grandes con Pollo 9kg.jpeg",
    "galleryImages": [
      "/productos/Top One Perros Adultos Medianos y Grandes con Pollo 9kg.jpeg"
    ],
    "inStock": true,
    "stockCount": 32,
    "sku": "PL-037",
    "variants": [
      {
        "id": "v1",
        "label": "Saco 9 kg",
        "weightOrSize": "9 kg",
        "price": 21900,
        "inStock": true
      }
    ],
    "benefits": [
      "Tamaño de croqueta adecuado para perros de más de 10 kg",
      "Proteína de pollo digestible para vitalidad muscular",
      "Salud dental con efecto limpiador al masticar",
      "Grasas controladas para evitar el sobrepeso"
    ],
    "ingredients": [
      "Harina de pollo",
      "Maíz grano",
      "Harina de carne",
      "Aceite de pollo",
      "Prebióticos"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "26.0% mín",
      "Grasa bruta": "12.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "70 - 100 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "100 - 160 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "160 - 320 g"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "320 - 520 g"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-37",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-37",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-38",
    "name": "Vitalcan Balanced Natural Recipe Carne Argentina Seleccionada 17kg",
    "brand": "Vitalcan",
    "category": "perros",
    "categoryLabel": "Alimentos Perros",
    "petType": "perro",
    "lifeStage": "adulto",
    "price": 57900,
    "rating": 4.9,
    "reviewsCount": 138,
    "weightOrSize": "17 kg",
    "icon": "🐕",
    "bgGradient": "from-amber-500/10 to-orange-500/10 text-orange-600",
    "description": "Receta natural argentina con carne de vacuno seleccionada, pulpa de remolacha y extracto de romero.",
    "longDescription": "Vitalcan Balanced Natural Recipe destaca por sus ingredientes 100% nobles sin conservantes químicos artificiales. El romero y el tocoferol actúan como antioxidantes celulares naturales.",
    "imageUrl": "/productos/Vitalcan Balanced Natural Recipe Carne Argentina Seleccionada 17kg.jpeg",
    "galleryImages": [
      "/productos/Vitalcan Balanced Natural Recipe Carne Argentina Seleccionada 17kg.jpeg"
    ],
    "inStock": true,
    "stockCount": 38,
    "sku": "PL-038",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 3 kg",
        "weightOrSize": "3 kg",
        "price": 15900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Saco 17 kg",
        "weightOrSize": "17 kg",
        "price": 57900,
        "inStock": true
      }
    ],
    "benefits": [
      "Carne argentina de vacuno seleccionada como primer ingrediente",
      "Conservación 100% natural con extracto de romero y vitamina E",
      "Fibras prebióticas para una asimilación gastrointestinal óptima",
      "Salud articular con condroitina y glucosamina"
    ],
    "ingredients": [
      "Carne vacuna deshidratada",
      "Arroz",
      "Gluten de maíz",
      "Pulpa de remolacha",
      "Extracto de romero"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "26.0% mín",
      "Grasa bruta": "12.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "70 - 100 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "100 - 160 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "160 - 320 g"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "320 - 520 g"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-38",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-38",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-39",
    "name": "Vitalcan Balanced Natural Recipe Salmon Rosado Skin Care",
    "brand": "Vitalcan",
    "category": "perros",
    "categoryLabel": "Alimentos Perros",
    "petType": "perro",
    "lifeStage": "adulto",
    "price": 36900,
    "rating": 5,
    "reviewsCount": 92,
    "weightOrSize": "7.5 kg",
    "icon": "🐕",
    "bgGradient": "from-amber-500/10 to-orange-500/10 text-orange-600",
    "description": "Especialmente creado para perros con piel sensible o alergias alimentarias, formulado con salmón rosado y omegas.",
    "longDescription": "Alimento hipoalergénico formulado con salmón rosado como fuente proteica alternativa. Alivia el picor, la caspa y el enrojecimiento dérmico en pocas semanas.",
    "imageUrl": "/productos/Vitalcan Balanced Natural Recipe Salmon Rosado Skin Care.jpeg",
    "galleryImages": [
      "/productos/Vitalcan Balanced Natural Recipe Salmon Rosado Skin Care.jpeg"
    ],
    "inStock": true,
    "stockCount": 24,
    "sku": "PL-039",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 3 kg",
        "weightOrSize": "3 kg",
        "price": 18900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Saco 7.5 kg",
        "weightOrSize": "7.5 kg",
        "price": 36900,
        "inStock": true
      }
    ],
    "benefits": [
      "Salmón rosado como fuente de proteína hipoalergénica",
      "Alivia la irritación dérmica y el rascado continuo",
      "Rico en ácidos grasos Omega-3 y Omega-6 puros",
      "Sin carne de vacuno ni pollo para evitar alergias cruzadas"
    ],
    "ingredients": [
      "Salmón rosado deshidratado",
      "Arroz integral",
      "Aceite de pescado",
      "Semillas de lino"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "26.0% mín",
      "Grasa bruta": "12.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "70 - 100 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "100 - 160 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "160 - 320 g"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "320 - 520 g"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-39",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-39",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  },
  {
    "id": "prod-40",
    "name": "Vitalcan Premium Cordero Perros Adultos Todas las Razas",
    "brand": "Vitalcan",
    "category": "perros",
    "categoryLabel": "Alimentos Perros",
    "petType": "perro",
    "lifeStage": "adulto",
    "price": 49900,
    "rating": 4.9,
    "reviewsCount": 110,
    "weightOrSize": "15 kg",
    "icon": "🐕",
    "bgGradient": "from-amber-500/10 to-orange-500/10 text-orange-600",
    "description": "Fórmula premium con carne de cordero hipoalergénica para perros de todas las razas con estómagos delicados.",
    "longDescription": "El cordero es una proteína noble y sabrosa con bajísima incidencia de intolerancias. Aporta minerales quelados y prebióticos para deposiciones consistentes y sin olor.",
    "imageUrl": "/productos/Vitalcan Premium Cordero Perros Adultos Todas las Razas.jpeg",
    "galleryImages": [
      "/productos/Vitalcan Premium Cordero Perros Adultos Todas las Razas.jpeg"
    ],
    "inStock": true,
    "stockCount": 37,
    "sku": "PL-040",
    "variants": [
      {
        "id": "v1",
        "label": "Bolsa 3 kg",
        "weightOrSize": "3 kg",
        "price": 14900,
        "inStock": true
      },
      {
        "id": "v2",
        "label": "Saco 15 kg",
        "weightOrSize": "15 kg",
        "price": 47900,
        "inStock": true
      }
    ],
    "benefits": [
      "Carne de cordero como proteína hipoalergénica de alto valor",
      "Digestión suave y sin pesadez estomacal",
      "Pelaje brillante y denso con ácidos grasos naturales",
      "Fórmula completa para razas pequeñas, medianas y grandes"
    ],
    "ingredients": [
      "Carne de cordero deshidratada",
      "Arroz",
      "Maíz",
      "Grasa de pollo",
      "Prebióticos FOS"
    ],
    "nutritionalAnalysis": {
      "Proteína bruta": "26.0% mín",
      "Grasa bruta": "12.0% mín",
      "Fibra cruda": "3.5% máx",
      "Humedad": "10.0% máx"
    },
    "feedingGuide": [
      {
        "weight": "Hasta 5 kg",
        "dailyAmount": "70 - 100 g"
      },
      {
        "weight": "5 - 10 kg",
        "dailyAmount": "100 - 160 g"
      },
      {
        "weight": "10 - 25 kg",
        "dailyAmount": "160 - 320 g"
      },
      {
        "weight": "Más de 25 kg",
        "dailyAmount": "320 - 520 g"
      }
    ],
    "reviews": [
      {
        "id": "rev-1-prod-40",
        "author": "Carolina M.",
        "rating": 5,
        "date": "Hace 4 días",
        "comment": "Excelente producto, a mi mascota le encantó de inmediato. El despacho llegó al día siguiente.",
        "verified": true
      },
      {
        "id": "rev-2-prod-40",
        "author": "Rodrigo S.",
        "rating": 5,
        "date": "Hace 2 semanas",
        "comment": "Muy buena calidad y precio. Se nota la diferencia en su pelaje y energía.",
        "verified": true
      }
    ]
  }
];

export const ALL_CATEGORIES = [
  { id: 'todos', label: 'Todos los productos', count: PRODUCTS_DATABASE.length },
  { id: 'perros', label: 'Alimentos Perros', count: PRODUCTS_DATABASE.filter(p => p.category === 'perros').length },
  { id: 'gatos', label: 'Alimentos Gatos', count: PRODUCTS_DATABASE.filter(p => p.category === 'gatos').length },
  { id: 'higiene', label: 'Arenas & Higiene', count: PRODUCTS_DATABASE.filter(p => p.category === 'higiene').length },
  { id: 'snacks', label: 'Pequeñas Mascotas & Snacks', count: PRODUCTS_DATABASE.filter(p => p.category === 'snacks').length },
];

export const FEATURED_PRODUCT_IDS: string[] = [
  'prod-30', // Purina Pro Plan Puppy Razas Pequeñas Optistart
  'prod-6',  // Bravery Herring Adult Large Medium Breeds 12kg
  'prod-14', // Fit Formula Perro Adulto 20kg
  'prod-38', // Vitalcan Balanced Natural Recipe Carne Argentina Seleccionada 17kg
  'prod-28', // Purina Pro Plan Adult Gatos Optiprebio
  'prod-8',  // Bravery Salmon Adult Cat 7kg
  'prod-34', // Taste of the Wild Rocky Mountain Feline Recipe
  'prod-10', // Diamond Naturals Indoor Cat Chicken and Rice Formula
  'prod-18', // Loops Arena Sanitaria Bentonita Super Aglutinante Lavanda 9kg
  'prod-15', // Happypets Healthy Rodents Conejos y Cuyes 500g
];

export const FEATURED_PRODUCTS: Product[] = FEATURED_PRODUCT_IDS
  .map(id => PRODUCTS_DATABASE.find(p => p.id === id))
  .filter((p): p is Product => Boolean(p));

