-- SQLite
INSERT INTO categories (name) VALUES ('Collares');

INSERT INTO categories (name) VALUES ('Kit');


SELECT * FROM categories;

// Collares
INSERT INTO products
(category_id,name,description,price,stock,image,featured)
VALUES
(11,'Collar Clásico Dorado','Collar dorado minimalista.',35000,10,'/images/Collares/Collar1.JPG',1),

(11,'Collar Cadena Elegance','Collar delicado con diseño elegante.',38000,10,'/images/Collares/Collar2.JPG',1),

(11,'Collar Inicial Dorado','Collar con dije decorativo.',40000,10,'/images/Collares/Collar3.JPG',1),

(11,'Collar Perlas Dream','Collar con perlas decorativas.',45000,10,'/images/Collares/Collar4.JPG',1),

(11,'Collar Medalla Premium','Collar con dije tipo medalla.',42000,10,'/images/Collares/Collar5.JPG',1);


SELECT id, name, image
FROM products
WHERE category_id = 3;

// Anillos
INSERT INTO products
(category_id, name, description, price, stock, image, featured)
VALUES

(3, 'Anillo Estrella Perla', 'Anillo dorado con estrella y detalle de perla.', 28000, 10, '/images/anillos/Anillo1.jpeg', 1),

(3, 'Anillo Corazón Rojo', 'Anillo dorado con corazón rojo decorativo.', 32000, 10, '/images/anillos/Anillo2.jpeg', 1),

(3, 'Anillo Estrella Marina', 'Anillo inspirado en estrella marina.', 30000, 10, '/images/anillos/Anillo3.jpeg', 1),

(3, 'Anillo Alas Doradas', 'Anillo dorado con diseño de alas.', 29000, 10, '/images/anillos/Anillo4.jpeg', 1);

SELECT id, name, image
FROM products
WHERE category_id = 3;

DELETE FROM products
WHERE id = 3;

SELECT *
FROM products
WHERE category_id = 3;


SELECT * FROM categories;

// Bolsos y Cosmetiquera
SELECT id, name, image
FROM products
WHERE category_id = 9;

DELETE FROM products
WHERE id = 19;

INSERT INTO products
(category_id, name, description, price, stock, image, featured)
VALUES
(
9,
'Cosmetiquera BIMBA Y LOLA',
'Cosmetiquera práctica y elegante para maquillaje y accesorios.',
35000,
10,
'/images/bolsos/Cosmetiquera.JPG',
1
);

// kits

INSERT INTO products
(category_id, name, description, price, stock, image, featured)
VALUES

(12, 'Kit Victoria Secret', 'Kit de cuidado corporal y fragancia.', 120000, 10, '/images/Kit/Kit1.JPG', 1),

(12, 'Kit Natura Tododia Ciruela', 'Kit de crema y splash corporal.', 95000, 10, '/images/Kit/Kit2.JPG', 1),

(12, 'Kit Natura Lumina', 'Kit de cuidado capilar y corporal.', 135000, 10, '/images/Kit/Kit3.JPG', 1);

SELECT id, name, image
FROM products
WHERE category_id = 12;

// Cremas

INSERT INTO products
(category_id, name, description, price, stock, image, featured)
VALUES

(8, 'Crema Mango Temptation', 'Crema corporal hidratante con aroma a mango.', 45000, 10, '/images/cremas/Crema1.jpeg', 1),

(8, 'Splash Natura Tododia Ciruela Negra', 'Splash corporal Natura Tododia.', 55000, 10, '/images/cremas/Crema2.JPG', 1),

(8, 'Crema Sandía Pound Cake', 'Crema corporal hidratante con aroma a sandía.', 45000, 10, '/images/cremas/Crema3.jpeg', 1),

(8, 'Crema Chiffon Pound Cake', 'Crema corporal hidratante con fragancia dulce.', 45000, 10, '/images/cremas/Crema4.jpeg', 1);

SELECT id, name, image
FROM products
WHERE category_id = 8;

DELETE FROM products
WHERE id = 8;

// Manillas

INSERT INTO products
(category_id, name, description, price, stock, image, featured)
VALUES

(2, 'Manilla Virgen Dorada', 'Manilla ajustable con dije decorativo.', 25000, 10, '/images/manillas/Manillas1.JPG', 1),

(2, 'Manilla Marco Dorado', 'Manilla ajustable con detalle dorado.', 25000, 10, '/images/manillas/Manillas2.JPG', 1),

(2, 'Manilla Corazón Multicolor', 'Manilla ajustable con dije de corazón.', 22000, 10, '/images/manillas/Manillas3.JPG', 1),

(2, 'Manilla Virgen Premium', 'Manilla elegante ajustable.', 25000, 10, '/images/manillas/Manillas4.JPG', 1),

(2, 'Manilla Rectangular Dorada', 'Manilla ajustable con dije rectangular.', 25000, 10, '/images/manillas/Manillas5.JPG', 1),

(2, 'Set de Manillas Elegance', 'Conjunto de manillas decorativas.', 45000, 10, '/images/manillas/Manillas6.JPG', 1),

(2, 'Manilla Marco Gold', 'Manilla ajustable con detalle dorado.', 25000, 10, '/images/manillas/Manillas7.JPG', 1);

DELETE FROM products
WHERE id = 2;

SELECT id, name, image
FROM products
WHERE category_id = 2;

// Medias

INSERT INTO products
(category_id, name, description, price, stock, image, featured)
VALUES

(7, 'Medias Chanel Clásicas', 'Medias con diseño tipo Chanel en varios colores.', 18000, 20, '/images/medias/Medias1.JPG', 1),

(7, 'Medias Adidas y LV', 'Set de medias surtidas con diferentes diseños.', 18000, 20, '/images/medias/Medias2.JPG', 1),

(7, 'Medias Chanel Collection', 'Medias estampadas en tonos café y beige.', 18000, 20, '/images/medias/Medias3.JPG', 1),

(7, 'Medias Gucci Collection', 'Medias estampadas en varios colores.', 18000, 20, '/images/medias/Medias4.JPG', 1);

SELECT id, name
FROM products
WHERE category_id = 7;

DELETE FROM products
WHERE id = 7;

// Perfumes

INSERT INTO products
(category_id, name, description, price, stock, image, featured)
VALUES

(4, 'Victoria Secret Garden View', 'Splash corporal con aroma floral y frutal.', 65000, 10, '/images/perfumes/Per1.JPG', 1),

(4, 'Diesel D Feminine', 'Perfume femenino con notas intensas y modernas.', 120000, 10, '/images/perfumes/Per2.JPG', 1),

(4, 'Diesel D Feminine Eau de Toilette', 'Fragancia femenina de larga duración.', 120000, 10, '/images/perfumes/Per3.JPG', 1),

(4, 'Diesel Amber Gold', 'Perfume con notas cálidas y elegantes.', 135000, 10, '/images/perfumes/Per4.JPG', 1),

(4, 'Diesel Kamikashi Blue', 'Fragancia fresca y sofisticada.', 130000, 10, '/images/perfumes/Per5.JPG', 1),

(4, 'Diesel Kamikashi Edition', 'Perfume masculino de aroma intenso.', 130000, 10, '/images/perfumes/Per6.JPG', 1);

SELECT id, name
FROM products
WHERE category_id = 4;

DELETE FROM products
WHERE id = 4;