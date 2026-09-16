/* ==========================================================================
   LUCA PIZZA BMX — DATOS DEL SITIO
   --------------------------------------------------------------------------
   ÚNICO archivo a editar para cambiar contenido: precios, carta, eventos,
   horarios, redes, textos e imágenes. La web (index.html) y la carta
   imprimible (carta.html) leen de acá.

   ⚠ Los campos marcados con  // TODO  son supuestos o ejemplos: confirmalos
     con el local antes de publicar.
   ========================================================================== */

window.LUCA = {

  /* ------------------------------------------------------------------ MARCA */
  brand: {
    name: "LUCA PIZZA BMX",
    shortName: "LUCA",
    tagline: "Buena pizza, buena noche.",
    descriptor: "Pizzería artesanal · Pista BMX",
    est: "2024",                                   // TODO: año real de apertura
    logoWordmark: "assets/brand/logo-wordmark.png", // logo blanco (fondo transparente)
    logoBadge: "assets/brand/logo-badge.png"        // logo circular
  },

  /* -------------------------------------------------------------- CONTACTO */
  contact: {
    whatsapp: "5492634529612",          // formato internacional sin + ni espacios
    whatsappDisplay: "2634 529612",
    whatsappGreeting: "Hola Luca! 🍕 Quiero hacer un pedido:",
    instagram: "lucabikepizza",
    address: "Dirección a confirmar",   // TODO: calle y número
    city: "Mendoza, Argentina",         // TODO: confirmar ciudad
    mapsQuery: "Luca Pizza BMX",        // TODO: reemplazar por la dirección exacta
    coords: "33°04′S · 68°28′O",        // TODO: coordenadas reales del spot
    delivery: true
  },

  /* -------------------------------------------------------------- HORARIOS */
  /* d: días de la semana (0 = domingo … 6 = sábado). open/close en 24 h.
     Si close es menor que open, se entiende que cierra pasada la medianoche.
     Con esto la web muestra "ABIERTO AHORA / CERRADO" en vivo.            */
  hours: [                               // TODO: horarios reales
    { days: "Lun — Mar", d: [1, 2] },                                   // sin open = cerrado
    { days: "Mié — Jue", d: [3, 4], open: "20:00", close: "00:00" },
    { days: "Vie — Sáb", d: [5, 6], open: "20:00", close: "02:00" },
    { days: "Domingo",   d: [0],    open: "20:00", close: "00:00" }
  ],

  /* --------------------------------------------------------------- IMÁGENES
     Para cambiar una foto: reemplazá el archivo con el MISMO nombre en
     /assets/img/ o cambiá la ruta acá. Si un archivo no existe, la web
     muestra un placeholder con el nombre esperado.                       */
  images: {
    hero:           { src: "assets/img/hero.jpg",               alt: "Cartel BMX pintado a mano y una bicicleta BMX bajo las luces del patio de noche" },
    // Video de fondo del hero (opcional, desktop). Subí el archivo a
    // assets/video/hero.mp4 y poné la ruta en src. Vacío = solo foto.
    heroVideo:      { src: "" },
    fire:           { src: "assets/img/horno-fuego.jpg",        alt: "Llama encendiendo el horno de ladrillo" },
    track:          { src: "assets/img/pista-bmx.jpg",          alt: "La pista BMX de tierra iluminada con guirnaldas de luces" },
    patio:          { src: "assets/img/patio-noche.jpg",        alt: "Vista aérea del patio con mesas y guirnaldas de luces por la noche" },
    interior:       { src: "assets/img/interior.jpg",           alt: "Cuadros en blanco y negro en la pared de ladrillo del local" },
    dough:          { src: "assets/img/masa.jpg",               alt: "Pizzero espolvoreando harina sobre la mesada" },
    pizzaLuca:      { src: "assets/img/pizza-luca.jpg",         alt: "Pizza Luca con carne, jamón, huevo y morrones, levantando una porción con muzzarella" },
    pizzaLucaTall:  { src: "assets/img/pizza-luca-vertical.jpg",alt: "Pizza Luca recién salida del horno sobre tabla de madera" },
    lomo:           { src: "assets/img/lomo.jpg",               alt: "Lomo en pan de pizza con jamón, huevo, lechuga y tomate" },
    lomoPizza:      { src: "assets/img/lomo-pizza.jpg",         alt: "Lomo pizza sobre tabla de madera" },
    calzon:         { src: "assets/img/calzon.jpg",             alt: "Calzón dorado al horno de barro" },
    bunting:        { src: "assets/img/banderines.jpg",         alt: "Banderines de colores y luces en el patio" }, // TODO: subir foto
    og:             { src: "assets/img/og-image.jpg" }
  },

  /* ------------------------------------------------------------------ CARTA
     price: número (sin puntos). Se formatea solo como $ 16.000
     tag:   etiqueta opcional ("DE LA CASA", "NUEVO", etc.)
     img:   clave de "images" (opcional)                                    */
  currency: { locale: "es-AR", symbol: "$" },

  featured: {
    name: "Pizza Luca",
    kicker: "La de la casa",
    cta: "Pedir la Luca",
    desc: "La que le da nombre al local. Masa madurada, horno de barro y todo lo que te gusta arriba.",
    ingredients: ["Salsa de tomate", "Muzzarella", "Carne", "Cebolla", "Huevo", "Jamón", "Morrones"],
    price: 20000,
    img: "pizzaLuca",
    promo: "Domingos: Pizza Luca + nuditos de ajo y parmesano con mayo casera a $ 15.000" // TODO: confirmar vigencia
  },

  menu: [
    {
      id: "pizzas", title: "Pizzas", img: "pizzaLucaTall",
      note: "Masa artesanal al horno de barro.",
      items: [
        { name: "Muzzarella",  desc: "Salsa de tomate, muzzarella, orégano y aceitunas.", price: 16000 },   // TODO: confirmar ingredientes
        { name: "Especial",    desc: "Muzzarella, jamón, morrones y aceitunas.",          price: 17000 },
        { name: "Doble muzza", desc: "Doble capa de muzzarella gratinada.",               price: 17000 },
        { name: "Napolitana",  desc: "Muzzarella, rodajas de tomate, ajo y orégano.",     price: 16500 },
        { name: "Fugazzeta",   desc: "Muzzarella y cebolla dorada al horno.",             price: 16500 },
        { name: "Roquefort",   desc: "Muzzarella y roquefort.",                           price: 18000 },
        { name: "Luca",        desc: "Carne, cebolla, huevo, jamón y morrones.",          price: 20000, tag: "De la casa" }
      ]
    },
    {
      id: "lomos", title: "Lomos", img: "lomo",
      note: "De carne o pollo. Muzza, jamón, huevo, tomate y condimentos.",
      items: [
        { name: "Lomo clásico",     price: 20000 },
        { name: "Lomo doble carne", price: 22000 },
        { name: "Lomo individual",  price: 15000 },
        { name: "El Lomo Pizza",    desc: "El lomo hecho sobre una pizza entera. Para compartir.", price: 45000, tag: "Para compartir" },
        { name: "½ Lomo Pizza",     price: 27000 }
      ]
    },
    {
      id: "calzones", title: "Calzones", img: "calzon",
      note: "Cerrados y dorados al horno de barro.",
      items: [
        { name: "Calzón de carne",         price: 27000 },
        { name: "Calzón de pollo",         price: 27000 },
        { name: "Calzón de jamón y queso", price: 25000 }
      ]
    },
    {
      id: "burgers", title: "Hamburguesas", img: "lomoPizza",  // TODO: foto de hamburguesa
      note: "Carne, muzza, jamón, huevo, lechuga, tomate y condimentos.",
      items: [
        { name: "La clásica",   price: 15000 },
        { name: "Burger Luca",  price: 10000 },   // TODO: confirmar precio (en la carta vale menos que la clásica)
        { name: "Burger pizza", desc: "Una hamburguesa del tamaño de una pizza.", price: 38000, tag: "Para compartir" }
      ]
    },
    {
      id: "strombolis", title: "Strombolis",
      note: "Carne, muzza, jamón, huevo, lechuga, tomate y condimentos.",
      items: [
        { name: "Carne",         price: 17000 },
        { name: "Pollo",         price: 17000 },
        { name: "Verdura",       price: 15000 },
        { name: "Jamón y queso", price: 15000 },
        { name: "Tostados",      price: 14000 }
      ]
    },
    {
      id: "panchos", title: "Panchos a la masa",
      note: "Todos llevan muzza.",
      items: [
        { name: "Jamón y morrón", price: 6000 },
        { name: "Roquefort",      price: 6000 },
        { name: "Cebolla",        price: 6000 },
        { name: "Jamón y queso",  price: 6000 },
        { name: "Napolitano",     price: 6000 }
      ]
    },
    {
      id: "encargue", title: "Panificado por encargue",
      note: "Pedilo con 1 día de anticipación.",
      items: [
        { name: "Panes",     desc: "Para lomo, burger y pernil." },
        { name: "Nuditos",   desc: "De ajo y parmesano." },
        { name: "Prepizzas", desc: "Chica, media y grande." }
      ]
    }
  ],

  /* -------------------------------------------------------------- THE SPOT */
  spot: {
    features: [                          // TODO: ajustar a la pista real
      { k: "Superficie", v: "Tierra compactada" },
      { k: "Líneas",     v: "Saltos, rollers y peraltes" },
      { k: "Luz",        v: "Guirnaldas toda la noche" },
      { k: "Acceso",     v: "Libre para clientes" }
    ],
    rules: "Casco siempre. Respetá el turno. Cuidá la pista."
  },

  /* ----------------------------------------------------------- EXPERIENCIA */
  experience: [
    { time: "20:30", word: "Llegás",           text: "Luces prendidas, música sonando y olor a horno de barro desde la vereda.", img: "patio" },
    { time: "20:40", word: "Pedís",            text: "Pizza, lomo o calzón. Masa hecha acá, todos los días.",                    img: "dough" },
    { time: "21:05", word: "Comés",            text: "Directo del fuego a la tabla. Sin apuro.",                                img: "pizzaLucaTall" },
    { time: "21:30", word: "Mirás el ride",    text: "Al fondo, la pista se enciende. Saltos, rollers y gente que se anima.",    img: "track" },
    { time: "23:00", word: "Te sumás al spot", text: "Traé la bici o quedate en la tribuna. Acá nadie se va temprano.",         img: "hero" }
  ],

  /* --------------------------------------------------------------- GALERÍA
     size: "tall" | "wide" | "big" | "" (normal)                            */
  gallery: [
    { img: "fire",          size: "tall", caption: "El horno" },
    { img: "track",         size: "tall", caption: "La pista" },
    { img: "pizzaLuca",     size: "wide", caption: "Pizza Luca" },
    { img: "interior",      size: "",     caption: "Adentro" },
    { img: "dough",         size: "tall", caption: "La masa" },
    { img: "patio",         size: "tall", caption: "El patio" },
    { img: "lomo",          size: "wide", caption: "Lomo" },
    { img: "calzon",        size: "",     caption: "Calzón" },
    { img: "bunting",       size: "wide", caption: "Banderines" }
  ],

  /* --------------------------------------------------------------- EVENTOS
     date: "AAAA-MM-DD" o null (evento fijo / a consulta)
     ⚠ TODO: fechas de EJEMPLO. Reemplazar por la agenda real.            */
  events: [
    { date: null,         label: "Todos los domingos", name: "Domingo de Pizza Luca", type: "Promo",   desc: "Pizza Luca + nuditos de ajo y parmesano con mayo casera.", cta: "Reservar" },
    { date: "2026-09-26", name: "BMX Jam",          type: "Ride",   desc: "Sesión abierta en la pista. Todos los niveles, casco obligatorio.", cta: "Anotarme" },
    { date: "2026-10-03", name: "Night Ride",       type: "Ride",   desc: "La pista con luces hasta tarde y música en vivo en el patio.",      cta: "Quiero ir" },
    { date: "2026-10-10", name: "Live DJ",          type: "Música", desc: "Set en el patio desde las 22:00. Pizza al horno toda la noche.",   cta: "Reservar" },
    { date: "2026-10-24", name: "Competencia Luca", type: "Contest",desc: "Mejor truco, mejor línea y premio para el público.",                cta: "Inscribirme" },
    { date: null,         label: "A consulta",         name: "Eventos privados",     type: "Privado", desc: "Cumples, after office y juntadas con la pista incluida.",     cta: "Consultar" }
  ],

  /* ------------------------------------------------------------ TESTIMONIOS
     ⚠ TODO: textos de EJEMPLO. Reemplazar por reseñas reales
       (Google / Instagram) antes de publicar.                             */
  testimonials: [
    { quote: "Pizza brutal y tremendo ambiente.",                          who: "Martín", where: "Google" },
    { quote: "El spot está increíble. Fuimos a comer y terminamos andando.", who: "Caro",  where: "Instagram" },
    { quote: "Venís por la pizza y terminás quedándote toda la noche.",      who: "Nico",  where: "Google" }
  ]
};
