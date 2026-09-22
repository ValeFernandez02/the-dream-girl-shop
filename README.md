# The Dream Girl Shop

Tienda web base hecha para VS Code con:

- Frontend: HTML + CSS + JavaScript
- Backend: Node.js + Express
- Base de datos: SQLite
- Carrito de compras
- Categorías
- Buscador
- Checkout
- Dirección y domicilio
- Fecha del pedido y fecha de entrega
- Registro de pedidos
- Descuento de stock al crear el pedido
- Confirmación por WhatsApp

## 1. Requisitos

Instalar Node.js LTS.

## 2. Instalar dependencias

Abre la carpeta en VS Code y ejecuta:

```bash
npm install
```

## 3. Iniciar

```bash
npm start
```

Luego abre:

http://localhost:3000

Para desarrollo:

```bash
npm run dev
```

## 4. Base de datos

SQLite se crea automáticamente en:

```text
data/shop.db
```

No tienes que instalar MySQL, Oracle ni SQL Server para esta primera versión.

## 5. Estructura

```text
the-dream-girl-shop/
├── data/
│   └── shop.db              # se crea al ejecutar
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── package.json
├── server.js
└── README.md
```

## 6. Cambiar WhatsApp

Busca en `public/app.js`:

```js
const phone = "573000000000";
```

y reemplázalo por el número real con código de país.

También cambia el enlace de WhatsApp en `public/index.html`.

## 7. Próximos pasos

1. Reemplazar los productos de ejemplo por los productos reales de Instagram.
2. Crear panel de administración.
3. Agregar login de administrador.
4. Subir imágenes reales.
5. Configurar métodos de pago.
6. Configurar costo de domicilio por zona.
7. Publicar la web.
