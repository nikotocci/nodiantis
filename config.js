/**
 * Configuración de la web de Nodiantis.
 * Todo lo editable está en este archivo. Guarda los cambios y recarga la página.
 */
window.NODIANTIS_CONFIG = {
  // Número de WhatsApp en formato internacional, solo dígitos (sin +, espacios ni guiones).
  WHATSAPP_NUMBER: "5491169694354",

  // Enlace de pago de Mercado Pago. Si queda vacío, "Quiero el pack" abre WhatsApp.
  // Si el monto en pesos cambia, actualiza el link aquí y todos los botones lo usan.
  MERCADOPAGO_URL: "https://mpago.li/1WCemVo",

  // Redes sociales. Solo se muestran en el pie de página las que tengan URL.
  SOCIAL: {
    instagram: "",
    linkedin: "",
    tiktok: "",
    youtube: ""
  },

  // Precio que se muestra en la web. Si queda vacío, se oculta.
  PRICE: "USD 18,99",

  // Aclaración que acompaña al precio. Si queda vacía, se oculta.
  PRICE_NOTE: "En Argentina se cobra en pesos, al tipo de cambio del día.",

  // Datos del responsable para la política de privacidad y los términos (Ley 25.326).
  // Completa estos datos antes de publicar: la ley exige identificar al responsable.
  TITULAR: {
    nombre: "Nicoló Tocci", // Nombre y apellido o razón social
    cuit: "",       // Ej.: "20-12345678-9"
    domicilio: ""   // Domicilio legal. Ej.: "Av. Corrientes 1234, CABA, Argentina"
  },

  // Correo para consultas y pedidos sobre datos personales. Si queda vacío, solo se ofrece WhatsApp.
  CONTACT_EMAIL: "",

  // Dirección pública del sitio, cuando tengas dominio (por ejemplo, "https://nodiantis.com").
  SITE_URL: "https://nikotocci.github.io/nodiantis/"
};
