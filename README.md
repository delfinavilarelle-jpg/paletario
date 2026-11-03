# Matices

Aplicación web para crear, probar y guardar paletas de color. Trabajo Práctico 2 de Desarrollo Frontend II (UADE, 2026), por Delfina Vilarelle.

- **App publicada:** COMPLETAR con la URL de Vercel
- **Repositorio:** https://github.com/delfinavilarelle-jpg/paletario

## Qué hace

- **Home:** teoría del color (familias, tono, saturación, luminosidad, temperatura) y una rueda interactiva con sus combinaciones.
- **Creación de paletas:** elegir entre 2 y 8 colores en la rueda, ponerles nombre y mood, y guardarlas. Se pueden editar, marcar como favoritas y eliminar.
- **Combinaciones:** probar una paleta en una web, una app y un póster; mezclar los colores y aprobarla.
- **Ropa y ambientes:** armar un outfit (casual o formal, de mujer o de hombre) o un ambiente (living o dormitorio) pieza por pieza, eligiendo el color de cada prenda o mueble, con una barra que compara el reparto con la regla 60-30-10.
- **Ideas para paletas:** galería de paletas armadas y de marcas, con buscador, filtros y favoritos. Las marcas que son apps muestran su ícono, que se puede pintar con otra paleta.

## Tecnologías

React 19 + Vite, Firebase (Authentication anónima y Cloud Firestore) y Vercel.

## Cómo ejecutarlo

1. Instalar Node.js 20 o superior.
2. Clonar el repositorio e instalar las dependencias:

   ```
   npm install
   ```

3. Copiar `.env.example` como `.env` y completar los valores de la app web de Firebase (Configuración del proyecto > Tus apps).
4. Iniciar el servidor de desarrollo:

   ```
   npm run dev
   ```

5. Abrir http://localhost:5173. Si se cambia el `.env`, hay que reiniciar `npm run dev`.

## Configuración de Firebase

1. Crear un proyecto en Firebase y registrar una app web.
2. Authentication > Método de acceso > habilitar **Anónimo**.
3. Crear una base de Cloud Firestore (edición Standard, identificador `(default)`).
4. En Firestore > Reglas, pegar el contenido de [`firestore.rules`](firestore.rules) y tocar **Publicar**.

## Datos que se guardan

Cada paleta es un documento en `users/{uid}/palettes/{id}`:

| Campo | Tipo | Detalle |
| --- | --- | --- |
| `name` | texto | de 1 a 60 caracteres |
| `colors` | lista | de 2 a 8 códigos HEX |
| `mood` | texto | de 1 a 30 caracteres |
| `source` | texto | opcional, hasta 120 caracteres |
| `status` | texto | `idea`, `prueba` o `aprobada` |
| `favorite` | booleano | favorita o no |
| `createdAt`, `updatedAt` | fecha | las pone el servidor |

Las reglas solo dejan leer y escribir las paletas propias y validan la forma de cada documento.

## Publicación en Vercel

Importar el repositorio con el preset de Vite (build `npm run build`, salida `dist`) y cargar las cuatro variables del `.env` en Settings > Environment Variables. Cada `git push` a `main` genera un despliegue nuevo.

## Estructura

```
src/
  App.jsx                 navegación y operaciones con Firestore
  firebase.js             inicialización con las variables de entorno
  services/palettes.js    consultar, agregar, modificar y eliminar
  utils/color.js          conversiones, esquemas y contraste
  utils/geometria.js      trazos de las ruedas de color
  data/paletas.js         paletas y marcas de la galería
  components/             pantallas (Home, Creacion, Testeo, Probador, Explorar) y piezas
                          (Escenas, Mockups, IconoApp, RuedaColor, SelectorColor…)
```
