import type { LocaleText } from '../lib/locale';

export type FaqAudienceId = 'habitants' | 'commercants' | 'services';

export interface FaqItem {
  id: string;
  q: LocaleText;
  a: LocaleText;
}

export interface FaqAudience {
  id: FaqAudienceId;
  icon: string;
  label: LocaleText;
  kicker: LocaleText;
  intro: LocaleText;
  items: FaqItem[];
  cta: {
    to: string;
    label: LocaleText;
  };
}

export const FAQ_PAGE = {
  kicker: { fr: 'Aide & questions', en: 'Help & questions', es: 'Ayuda y preguntas' },
  title: { fr: 'FAQ IDÉA CHARTRONS', en: 'IDÉA CHARTRONS FAQ', es: 'FAQ IDÉA CHARTRONS' },
  subtitle: {
    fr: 'Assistant intelligent et vitrine hyper-locale des Chartrons : Concierge IA, IA Chineur, Marché des Brocanteurs et annuaire — gratuits pour les habitants, sans téléchargement obligatoire.',
    en: 'An intelligent assistant and hyper-local storefront for the Chartrons: AI Concierge, Hunter AI, the Antique Dealers’ Market and the directory — free for residents, with no mandatory download.',
    es: 'Asistente inteligente y escaparate hiperlocal de los Chartrons: Conserje IA, IA Chineur, Mercado de Anticuarios y directorio — gratis para los vecinos, sin descarga obligatoria.',
  },
} as const satisfies Record<string, LocaleText>;

export const FAQ_AUDIENCES: FaqAudience[] = [
  {
    id: 'habitants',
    icon: '🏘️',
    label: { fr: 'Pour les Habitants', en: 'For residents', es: 'Para los vecinos' },
    kicker: { fr: 'Habitants & visiteurs', en: 'Residents & visitors', es: 'Vecinos y visitantes' },
    intro: {
      fr: 'IDÉA CHARTRONS est 100 % gratuite pour les habitants et les visiteurs, sans compte et sans application à télécharger. La barre de recherche unifiée ouvre le Concierge IA, l’annuaire, les annonces et l’agenda du quartier.',
      en: 'IDÉA CHARTRONS is 100% free for residents and visitors, with no account and no app to download. The unified search bar opens the AI Concierge, the directory, listings and the neighborhood calendar.',
      es: 'IDÉA CHARTRONS es 100 % gratis para vecinos y visitantes, sin cuenta y sin aplicación que descargar. La barra de búsqueda única abre el Conserje IA, el directorio, los anuncios y la agenda del barrio.',
    },
    cta: {
      to: '/acteurs',
      label: { fr: 'Explorer l’annuaire', en: 'Browse the directory', es: 'Explorar el directorio' },
    },
    items: [
      {
        id: 'what-is',
        q: { fr: 'Qu’est-ce qu’IDÉA Chartrons ?', en: 'What is IDÉA Chartrons?', es: '¿Qué es IDÉA Chartrons?' },
        a: {
          fr: 'Un assistant intelligent et une vitrine hyper-locale dédiés au quartier des Chartrons pour les résidents, visiteurs et commerçants. Vous y trouvez l’annuaire, les annonces, l’agenda associatif, le Marché des Brocanteurs et un concierge IA cantonné au quartier.',
          en: 'An intelligent assistant and a hyper-local storefront dedicated to the Chartrons district, for residents, visitors and shopkeepers. You will find the directory, listings, the community calendar, the Antique Dealers’ Market and an AI concierge scoped to the neighborhood.',
          es: 'Un asistente inteligente y un escaparate hiperlocal dedicados al barrio de los Chartrons, para vecinos, visitantes y comerciantes. Encontrará el directorio, los anuncios, la agenda comunitaria, el Mercado de Anticuarios y un conserje IA limitado al barrio.',
        },
      },
      {
        id: 'concierge-chineur',
        q: {
          fr: 'Comment fonctionne l’IA Concierge & IA Chineur ?',
          en: 'How do the AI Concierge and Hunter AI work?',
          es: '¿Cómo funcionan el Conserje IA y la IA Chineur?',
        },
        a: {
          fr: 'Une recherche unifiée par langage naturel, dans la barre du haut. Le Concierge IA recommande des commerces, oriente vers les événements locaux et peut préparer un parcours à pied. Sur l’onglet Brocanteurs, il devient l’IA Chineur : styles, époques, meubles, pépites en vitrine et boutiques d’antiquaires du quartier.',
          en: 'A unified natural-language search, from the top bar. The AI Concierge recommends shops, points you to local events and can sketch a walking route. On the Brocanteurs tab it becomes Hunter AI: styles, eras, furniture, window finds and antique shops in the neighborhood.',
          es: 'Una búsqueda única en lenguaje natural, desde la barra superior. El Conserje IA recomienda comercios, le orienta hacia los eventos locales y puede esbozar un recorrido a pie. En la pestaña Brocanteurs se convierte en la IA Chineur: estilos, épocas, muebles, hallazgos de escaparate y tiendas de antigüedades del barrio.',
        },
      },
      {
        id: 'brocanteurs',
        q: {
          fr: 'Qu’est-ce que le Marché des Brocanteurs ?',
          en: 'What is the Antique Dealers’ Market?',
          es: '¿Qué es el Mercado de Anticuarios?',
        },
        a: {
          fr: 'Un espace dédié aux antiquaires et brocanteurs de la rue Notre-Dame et des Chartrons pour exposer leurs pépites et arrivages en temps réel. Vous y voyez la carte, l’annuaire Antiquaires, le calendrier des puces du dimanche et des foires du Cours Portal, et la vitrine Pépites & Arrivages.',
          en: 'A dedicated space for antique dealers and flea shops on rue Notre-Dame and in the Chartrons, to show their finds and new arrivals in real time. You get the map, the Antiquaires directory, the Sunday flea and Cours Portal fair calendar, and the Finds & Arrivals showcase.',
          es: 'Un espacio dedicado a los anticuarios y tiendas de segunda mano de la rue Notre-Dame y de los Chartrons, para mostrar sus hallazgos y novedades en tiempo real. Incluye el mapa, el directorio de anticuarios, el calendario del mercadillo del domingo y de la feria del Cours Portal, y el escaparate de Hallazgos y Novedades.',
        },
      },
      {
        id: 'add-shop',
        q: {
          fr: 'Comment ajouter mon commerce ou mes pépites ?',
          en: 'How do I add my shop or my finds?',
          es: '¿Cómo añado mi comercio o mis hallazgos?',
        },
        a: {
          fr: 'Les commerçants et brocanteurs peuvent ouvrir un espace Pro pour enregistrer leur boutique, publier leurs arrivages ou proposer des offres. La fiche gratuite apparaît sur la carte et dans l’annuaire. En Premium Pro, un brocanteur publie jusqu’à 10 pépites actives, est prioritaire dans l’IA Chineur et affiche le badge Boutique Certifiée Notre-Dame.',
          en: 'Shopkeepers and antique dealers can open a Pro space to register their shop, publish new arrivals or offer deals. A free listing appears on the map and in the directory. With Premium Pro, a dealer can publish up to 10 active finds, ranks higher in Hunter AI and shows the Notre-Dame Certified Shop badge.',
          es: 'Los comerciantes y anticuarios pueden abrir un espacio Pro para registrar su tienda, publicar novedades o ofrecer promociones. Una ficha gratuita aparece en el mapa y en el directorio. Con Premium Pro, un anticuario puede publicar hasta 10 hallazgos activos, aparece mejor posicionado en la IA Chineur y muestra la insignia «Boutique Certifiée Notre-Dame».',
        },
      },
      {
        id: 'free-residents',
        q: {
          fr: 'L’application est-elle gratuite pour les habitants ?',
          en: 'Is the app free for residents?',
          es: '¿Es gratuita la aplicación para los vecinos?',
        },
        a: {
          fr: 'Oui, 100 % gratuite et accessible sans téléchargement obligatoire. Vous pouvez chercher, parcourir l’annuaire, poser une question à l’IA et consulter l’agenda dans le navigateur, sans créer de compte. L’installation en raccourci (PWA) reste optionnelle.',
          en: 'Yes — 100% free, with no mandatory download. You can search, browse the directory, ask the AI and check the calendar in the browser, with no account. Installing it as a shortcut (PWA) is optional.',
          es: 'Sí, es 100 % gratuita y sin descarga obligatoria. Puede buscar, consultar el directorio, preguntar a la IA y ver la agenda desde el navegador, sin cuenta. Instalarla como acceso directo (PWA) es opcional.',
        },
      },
      {
        id: 'association',
        q: {
          fr: 'Qui porte la plateforme et comment est-elle financée ?',
          en: 'Who runs the platform and how is it funded?',
          es: '¿Quién gestiona la plataforma y cómo se financia?',
        },
        a: {
          fr: 'L’association locale édite IDÉA CHARTRONS comme un bien commun. Les habitants consultent tout gratuitement. Le modèle économique repose uniquement sur l’abonnement « Premium Pro » des commerçants, sans publicité intrusive ni commission sur les ventes.',
          en: 'The local association publishes IDÉA CHARTRONS as a common good. Residents browse everything for free. The only revenue is the “Premium Pro” merchant subscription — no intrusive ads, no commission on sales.',
          es: 'La asociación local edita IDÉA CHARTRONS como un bien común. Los vecinos consultan todo gratuitamente. El único ingreso es la suscripción «Premium Pro» de los comerciantes, sin publicidad intrusiva ni comisión sobre las ventas.',
        },
      },
      {
        id: 'account',
        q: {
          fr: 'Dois-je créer un compte pour utiliser le site ou publier une annonce ?',
          en: 'Do I need an account to use the site or to post?',
          es: '¿Necesito una cuenta para usar el sitio o para publicar?',
        },
        a: {
          fr: 'Non. La consultation est libre et anonyme. Pour la première annonce (don, petit boulot, entraide, vente ou offre pro), un code OTP à 4 chiffres est envoyé par e-mail ou SMS : cela vérifie que vous êtes joignable, sans créer de compte ni mot de passe.',
          en: 'No. Browsing is open and anonymous. For the first post (giveaway, small job, mutual aid, sale or pro offer), a 4-digit OTP is sent by email or SMS: it only checks that you can be reached, with no account and no password.',
          es: 'No. La navegación es abierta y anónima. Para la primera publicación (regalo, pequeño trabajo, ayuda mutua, venta u oferta profesional) se envía un código de 4 cifras por e-mail o SMS: solo comprueba que se le puede contactar, sin cuenta ni contraseña.',
        },
      },
      {
        id: 'free-contacts',
        q: {
          fr: 'Quels contacts des commerces puis-je utiliser gratuitement ?',
          en: 'Which business contacts can I use for free?',
          es: '¿Qué datos de contacto de los comercios puedo usar gratis?',
        },
        a: {
          fr: 'Tous les commerces locaux ont un téléphone cliquable, un e-mail cliquable dès qu’il est connu, et leurs réseaux (Instagram, Facebook, WhatsApp). Le lien direct vers le site web, la mise en avant par le concierge IA et les modules d’action (Click & Collect, prise de RDV, ardoise) sont réservés aux abonnés Premium Pro.',
          en: 'Every local business has a clickable phone, a clickable email when known, and social links (Instagram, Facebook, WhatsApp). The direct website link, AI concierge priority and action modules (Click & Collect, booking, daily specials) are reserved for Premium Pro subscribers.',
          es: 'Todos los comercios locales tienen un teléfono pulsable, un e-mail pulsable cuando se conoce y enlaces a sus redes (Instagram, Facebook, WhatsApp). El enlace directo al sitio web, la prioridad en el conserje IA y los módulos de acción (Click & Collect, reserva, plato del día) están reservados a los suscriptores Premium Pro.',
        },
      },
      {
        id: 'click-collect',
        q: {
          fr: 'Comment fonctionne le Click & Collect / Réservation express ?',
          en: 'How does Click & Collect / Express reservation work?',
          es: '¿Cómo funciona el Click & Collect / reserva exprés?',
        },
        a: {
          fr: 'Sur la fiche des commerçants Premium Pro disposant du bouton « Commander / Réserver », remplissez vos coordonnées et votre demande. Un récapitulatif pré-rempli s’ouvre directement sur votre téléphone (WhatsApp ou SMS) pour valider votre commande en direct avec le commerçant. Le règlement s’effectue sur place.',
          en: 'On Premium Pro listings with the “Order / Reserve” button, fill in your details and request. A pre-filled summary opens on your phone (WhatsApp or SMS) so you can confirm the order live with the merchant. Payment is made on site.',
          es: 'En las fichas Premium Pro con el botón «Pedir / Reservar», rellene sus datos y su solicitud. Se abre en su teléfono un resumen ya preparado (WhatsApp o SMS) para confirmar el pedido en directo con el comerciante. El pago se hace en el local.',
        },
      },
      {
        id: 'anti-gaspi',
        q: {
          fr: 'C’est quoi la rubrique Anti-Gaspi, et pourquoi payer en ligne ?',
          en: 'What is the Anti-Waste section, and why pay online?',
          es: '¿Qué es la sección Antidesperdicio y por qué pagar en línea?',
        },
        a: {
          fr: 'Anti-Gaspi est un espace dédié aux commerces du quartier pour écouler invendus, surplus et produits à date courte — séparé du fil d’entraide entre voisins. Payer en ligne (CB) bloque l’offre : cela évite les réservations non honorées. Vous pouvez aussi appeler le commerce pour un retrait. Les tarifs étudiants (sacs surprise, viennoiseries de fin de journée) y sont clairement identifiés. Les offres expirées disparaissent automatiquement.',
          en: 'Anti-Waste is a dedicated space for neighborhood shops to sell unsold items, surplus and short-date products — kept apart from the neighbor-to-neighbor feed. Paying online (card) locks the offer, which prevents no-shows. You can also call the shop to reserve a pickup. Student-friendly deals (surprise bags, end-of-day pastries) are clearly labelled. Expired offers disappear automatically.',
          es: 'Antidesperdicio es un espacio dedicado a que los comercios del barrio vendan artículos no vendidos, excedentes y productos de fecha corta, separado del tablón entre vecinos. Pagar en línea (tarjeta) bloquea la oferta y evita las ausencias. También puede llamar al comercio para reservar una recogida. Las ofertas para estudiantes (bolsas sorpresa, pasteles de fin de jornada) están claramente señaladas. Las ofertas caducadas desaparecen automáticamente.',
        },
      },
      {
        id: 'reviews',
        q: {
          fr: 'Comment laisser un avis sur un commerce ?',
          en: 'How do I leave a review on a business?',
          es: '¿Cómo dejo una opinión sobre un comercio?',
        },
        a: {
          fr: 'Sur la fiche détaillée du commerçant, vous pouvez attribuer une note (étoiles) et rédiger un commentaire pour partager votre expérience avec la communauté du quartier.',
          en: 'On the merchant’s detailed listing, you can give a star rating and write a comment to share your experience with the neighborhood community.',
          es: 'En la ficha detallada del comerciante puede dar una puntuación en estrellas y escribir un comentario para compartir su experiencia con la comunidad del barrio.',
        },
      },
    ],
  },
  {
    id: 'commercants',
    icon: '✨',
    label: { fr: 'Pour les Commerçants', en: 'For merchants', es: 'Para los comerciantes' },
    kicker: { fr: 'Commerçants & Premium Pro', en: 'Merchants & Premium Pro', es: 'Comerciantes y Premium Pro' },
    intro: {
      fr: 'Chaque commerce est référencé gratuitement sur la carte et dans l’annuaire. L’espace Pro / Premium Pro débloque le site web, la priorité IA, les modules d’action, l’onglet Communication et, pour les brocanteurs, jusqu’à 10 pépites en vitrine.',
      en: 'Every business is listed for free on the map and in the directory. Pro / Premium Pro unlocks the website, AI priority, action modules, the Communication tab and, for antique dealers, up to 10 finds in the showcase.',
      es: 'Todos los comercios figuran gratis en el mapa y en el directorio. Pro / Premium Pro desbloquea el sitio web, la prioridad IA, los módulos de acción, la pestaña Comunicación y, para los anticuarios, hasta 10 hallazgos en el escaparate.',
    },
    cta: {
      to: '/acteurs?referencer=1',
      label: { fr: 'Référencer mon commerce', en: 'List my business', es: 'Registrar mi comercio' },
    },
    items: [
      {
        id: 'add-shop-pro',
        q: {
          fr: 'Comment ajouter mon commerce ou mes pépites ?',
          en: 'How do I add my shop or my finds?',
          es: '¿Cómo añado mi comercio o mis hallazgos?',
        },
        a: {
          fr: 'Les commerçants et brocanteurs peuvent ouvrir un espace Pro pour enregistrer leur boutique, publier leurs arrivages ou proposer des offres. Utilisez « Référencer mon commerce » : la fiche gratuite suffit pour apparaître sur la carte et dans l’annuaire. En Premium Pro, un antiquaire publie jusqu’à 10 pépites actives dans Pépites & Arrivages, est mis en avant par l’IA Chineur et affiche le badge Boutique Certifiée Notre-Dame.',
          en: 'Shopkeepers and antique dealers can open a Pro space to register their shop, publish new arrivals or offer deals. Use “List my business”: a free listing is enough to appear on the map and in the directory. With Premium Pro, an antique dealer publishes up to 10 active finds in Finds & Arrivals, is featured by Hunter AI and shows the Notre-Dame Certified Shop badge.',
          es: 'Los comerciantes y anticuarios pueden abrir un espacio Pro para registrar su tienda, publicar novedades o ofrecer promociones. Use «Registrar mi comercio»: una ficha gratuita basta para aparecer en el mapa y en el directorio. Con Premium Pro, un anticuario publica hasta 10 hallazgos activos en Hallazgos y Novedades, es destacado por la IA Chineur y muestra la insignia «Boutique Certifiée Notre-Dame».',
        },
      },
      {
        id: 'listed',
        q: {
          fr: 'Mon établissement est-il déjà référencé sur la plateforme ?',
          en: 'Is my establishment already listed on the platform?',
          es: '¿Mi establecimiento ya figura en la plataforma?',
        },
        a: {
          fr: 'La plateforme référence plus de 360 adresses réelles du quartier, extraites d’OpenStreetMap puis enrichies ; le chiffre exact s’affiche sur l’accueil. Vérifiez votre fiche via la barre de recherche (elle accepte les accents, le pluriel et des alias comme DAB, cash ou crèche). Si elle n’apparaît pas, demandez son ajout gratuit via « Référencer mon commerce ».',
          en: 'The platform lists more than 360 real neighborhood addresses, extracted from OpenStreetMap and then enriched; the exact figure is shown on the home page. Check your listing in the search bar (it handles accents, plurals and aliases such as ATM, cash or nursery). If it is missing, request a free listing via “List my business”.',
          es: 'La plataforma recoge más de 360 direcciones reales del barrio, extraídas de OpenStreetMap y después completadas; la cifra exacta aparece en la página de inicio. Compruebe su ficha en la barra de búsqueda (admite acentos, plurales y alias como cajero, efectivo o guardería). Si no figura, solicite una ficha gratuita con «Registrar mi comercio».',
        },
      },
      {
        id: 'free-vs-premium',
        q: {
          fr: 'Que comprend la fiche gratuite, et que réserve Premium Pro ?',
          en: 'What does the free listing include, and what is Premium Pro for?',
          es: '¿Qué incluye la ficha gratuita y para qué sirve Premium Pro?',
        },
        a: {
          fr: 'Gratuit pour tous : présence dans l’annuaire et sur la carte, téléphone cliquable, e-mail cliquable, liens Instagram / Facebook / WhatsApp. Premium Pro : lien vers votre site, priorité dans le Concierge IA et l’IA Chineur, modules d’action (Click & Collect, rendez-vous, ardoise), l’onglet Communication (créer et publier vos annonces, avec aide à la rédaction par IA) et, pour les brocanteurs, jusqu’à 10 pépites actives avec le badge Boutique Certifiée Notre-Dame. Aucune commission sur vos ventes.',
          en: 'Free for everyone: directory and map presence, clickable phone, clickable email, Instagram / Facebook / WhatsApp links. Premium Pro: a website link, priority in the AI Concierge and Hunter AI, action modules (Click & Collect, booking, daily specials), the Communication tab (create and publish posts, with AI writing help) and, for antique dealers, up to 10 active finds with the Notre-Dame Certified Shop badge. No commission on your sales.',
          es: 'Gratis para todos: presencia en el directorio y en el mapa, teléfono pulsable, e-mail pulsable, enlaces a Instagram / Facebook / WhatsApp. Premium Pro: enlace a su sitio web, prioridad en el Conserje IA y en la IA Chineur, módulos de acción (Click & Collect, citas, plato del día), la pestaña Comunicación (crear y publicar anuncios, con ayuda de redacción por IA) y, para los anticuarios, hasta 10 hallazgos activos con la insignia «Boutique Certifiée Notre-Dame». Sin comisión sobre sus ventas.',
        },
      },
      {
        id: 'communication-pro',
        q: {
          fr: 'À quoi sert l’onglet Communication dans l’espace Pro ?',
          en: 'What is the Communication tab in the Pro space for?',
          es: '¿Para qué sirve la pestaña Comunicación del espacio Pro?',
        },
        a: {
          fr: 'Réservé aux abonnés Premium Pro, cet onglet permet de rédiger une annonce, de la faire améliorer par l’IA, puis de la publier directement dans Idéa Chartrons et de la regrouper dans une campagne. Pour l’instant, la diffusion reste interne à la plateforme ; la connexion vers des réseaux externes (Google, Facebook, Instagram, WhatsApp, TikTok…) est à l’étude pour une prochaine évolution.',
          en: 'Reserved for Premium Pro subscribers, this tab lets you write a post, have it polished by AI, then publish it directly on Idéa Chartrons and group it into a campaign. For now, distribution stays within the platform; connecting to external networks (Google, Facebook, Instagram, WhatsApp, TikTok…) is being explored for a future update.',
          es: 'Reservada a los suscriptores Premium Pro, esta pestaña permite redactar un anuncio, mejorarlo con la IA, publicarlo directamente en Idéa Chartrons y agruparlo en una campaña. Por ahora la difusión se queda dentro de la plataforma; la conexión con redes externas (Google, Facebook, Instagram, WhatsApp, TikTok…) se está estudiando para una próxima evolución.',
        },
      },
      {
        id: 'commission',
        q: {
          fr: 'Y a-t-il une commission sur les ventes en Click & Collect ?',
          en: 'Is there a commission on Click & Collect sales?',
          es: '¿Hay comisión sobre las ventas de Click & Collect?',
        },
        a: {
          fr: 'Aucune sur le Click & Collect habituel : les échanges se font directement entre vous et vos clients. Seul l’abonnement Premium Pro rémunère l’association. Les conditions du paiement en ligne de la rubrique Anti-Gaspi seront précisées à son ouverture.',
          en: 'None on regular Click & Collect: exchanges happen directly between you and your customers. Only the Premium Pro subscription funds the association. The terms for online payment in the Anti-Waste section will be set out when it opens.',
          es: 'Ninguna en el Click & Collect habitual: los intercambios se hacen directamente entre usted y sus clientes. Solo la suscripción Premium Pro financia a la asociación. Las condiciones del pago en línea de la sección Antidesperdicio se precisarán cuando se abra.',
        },
      },
      {
        id: 'concierge-merchants',
        q: {
          fr: 'Le concierge IA peut-il recommander mon commerce ?',
          en: 'Can the AI concierge recommend my business?',
          es: '¿Puede el conserje IA recomendar mi comercio?',
        },
        a: {
          fr: 'Oui. Le concierge puise uniquement dans l’annuaire des Chartrons. Les fiches Premium Pro sont priorisées dans le Top 5. Une fiche complète (catégorie, adresse, horaires, téléphone, qualifications) reste visible pour tous ; le lien site web et le Click & Collect ne s’affichent que pour Premium Pro.',
          en: 'Yes. The concierge only draws on the Chartrons directory. Premium Pro listings are prioritized in the Top 5. A complete listing (category, address, hours, phone, qualifications) stays visible for everyone; the website link and Click & Collect only appear for Premium Pro.',
          es: 'Sí. El conserje solo se nutre del directorio de los Chartrons. Las fichas Premium Pro se priorizan en el Top 5. Una ficha completa (categoría, dirección, horarios, teléfono, cualificaciones) sigue siendo visible para todos; el enlace al sitio web y el Click & Collect solo aparecen en Premium Pro.',
        },
      },
      {
        id: 'anti-gaspi-merchant',
        q: {
          fr: 'Comment publier un invendu dans Anti-Gaspi ?',
          en: 'How do I post leftover stock in Anti-Waste?',
          es: '¿Cómo publico mis excedentes en Antidesperdicio?',
        },
        a: {
          fr: 'Ouvrez la rubrique Anti-Gaspi (bouton dédié, distinct des annonces habitants), indiquez le produit, le prix, un téléphone de retrait et une date/heure de fin obligatoires. L’offre disparaît toute seule à l’échéance. Le paiement CB bloque l’article pour le client ; l’appel téléphone reste possible pour un retrait local. Les conditions du paiement en ligne seront précisées à son ouverture.',
          en: 'Open the Anti-Waste section (a dedicated button, separate from resident listings), then add the product, price, a pickup phone number and a mandatory end date/time. The offer disappears on expiry. Card payment locks the item for the customer; a phone call remains available for local pickup. The terms for online payment will be set out when it opens.',
          es: 'Abra la sección Antidesperdicio (un botón específico, distinto de los anuncios de vecinos) e indique el producto, el precio, un teléfono de recogida y una fecha y hora de fin obligatorias. La oferta desaparece sola al vencer. El pago con tarjeta bloquea el artículo para el cliente; la llamada telefónica sigue disponible para una recogida local. Las condiciones del pago en línea se precisarán cuando se abra.',
        },
      },
    ],
  },
  {
    id: 'services',
    icon: '🛟',
    label: { fr: 'Services & Sécurité', en: 'Services & safety', es: 'Servicios y seguridad' },
    kicker: { fr: 'Concierge IA, patrimoine & urgences', en: 'AI concierge, heritage & emergencies', es: 'Conserje IA, patrimonio y urgencias' },
    intro: {
      fr: 'Le Concierge IA et l’IA Chineur, l’histoire des rues, les signalements Mairie / Police Municipale et les consignes d’urgence du quartier, réunis au même endroit.',
      en: 'The AI Concierge and Hunter AI, street history, City / Municipal Police reports and neighborhood emergency instructions, all in one place.',
      es: 'El Conserje IA y la IA Chineur, la historia de las calles, los avisos al Ayuntamiento / Policía Municipal y las instrucciones de emergencia del barrio, todo en un solo lugar.',
    },
    cta: {
      to: '/conciergerie',
      label: { fr: 'Ouvrir le concierge IA', en: 'Open the AI concierge', es: 'Abrir el conserje IA' },
    },
    items: [
      {
        id: 'concierge-ai',
        q: {
          fr: 'Comment fonctionne l’IA Concierge & IA Chineur ?',
          en: 'How do the AI Concierge and Hunter AI work?',
          es: '¿Cómo funcionan el Conserje IA y la IA Chineur?',
        },
        a: {
          fr: 'Une recherche unifiée par langage naturel capable de recommander des commerces, de dénicher des objets / antiquités ou d’orienter vers les événements locaux. Posez la question dans la barre du haut : le Concierge IA reste cantonné aux Chartrons. Sur l’onglet Brocanteurs, l’IA Chineur cherche dans les pépites actives (style, époque, meuble) et propose une balade entre les boutiques, en priorisant les partenaires Premium.',
          en: 'A unified natural-language search that can recommend shops, hunt down objects / antiques, or point you to local events. Ask from the top bar: the AI Concierge stays scoped to the Chartrons. On the Brocanteurs tab, Hunter AI searches active finds (style, era, furniture) and suggests a walk between shops, with Premium partners first.',
          es: 'Una búsqueda única en lenguaje natural que puede recomendar comercios, buscar objetos o antigüedades u orientarle hacia los eventos locales. Pregunte desde la barra superior: el Conserje IA se limita a los Chartrons. En la pestaña Brocanteurs, la IA Chineur busca hallazgos activos (estilo, época, mueble) y propone un paseo entre tiendas, con los socios Premium primero.',
        },
      },
      {
        id: 'concierge-scope',
        q: {
          fr: 'Pourquoi le concierge ne répond-il qu’à propos des Chartrons ?',
          en: 'Why does the concierge only answer about the Chartrons?',
          es: '¿Por qué el conserje solo responde sobre los Chartrons?',
        },
        a: {
          fr: 'C’est un assistant hyper-local : il est conçu pour ne jamais inventer d’adresse et ne travaille que sur les données du quartier. Une question hors sujet est donc redirigée vers une piste locale — un commerce, une note patrimoine, un service municipal ou une urgence. Si l’IA n’est pas joignable, une sélection de secours est calculée directement dans votre navigateur, sans connexion.',
          en: 'It is a hyper-local assistant: it is built never to invent an address and works only on neighborhood data. An off-topic question is therefore redirected to a local lead — a shop, a heritage note, a city service or an emergency. If the AI is unreachable, a fallback selection is computed right in your browser, with no connection.',
          es: 'Es un asistente hiperlocal: está concebido para no inventar nunca una dirección y trabaja solo con datos del barrio. Una pregunta fuera de tema se reorienta hacia una pista local: un comercio, una nota de patrimonio, un servicio municipal o una urgencia. Si la IA no está disponible, una selección de apoyo se calcula directamente en su navegador, sin conexión.',
        },
      },
      {
        id: 'street-history',
        q: {
          fr: 'Où trouver l’histoire des rues et les notes patrimoine ?',
          en: 'Where do I find street history and heritage notes?',
          es: '¿Dónde encuentro la historia de las calles y las notas de patrimonio?',
        },
        a: {
          fr: 'Demandez-le au concierge (« l’histoire de la rue Notre-Dame », « pourquoi les chais des Chartrons ? ») : une note patrimoine s’ajoute sous la réponse, avec l’époque, un résumé et une anecdote, plus un lien d’itinéraire vers la rue. Les rues documentées incluent la rue Notre-Dame, le cours Portal, la place du Marché des Chartrons, le quai des Chartrons, le cours Xavier Arnozan, la rue Borie, le cours de la Martinique et la rue Rode. La page Découvrir complète avec les parcours et les incontournables.',
          en: 'Ask the concierge (“the history of rue Notre-Dame”, “why the Chartrons wine cellars?”): a heritage note appears under the answer with the period, a summary, a piece of trivia and a walking link to the street. Documented streets include rue Notre-Dame, cours Portal, place du Marché des Chartrons, quai des Chartrons, cours Xavier Arnozan, rue Borie, cours de la Martinique and rue Rode. The Discover page adds walks and must-sees.',
          es: 'Pregunte al conserje («la historia de la rue Notre-Dame», «¿por qué las bodegas de los Chartrons?»): bajo la respuesta aparece una nota de patrimonio con la época, un resumen, una anécdota y un enlace para ir a pie hasta la calle. Las calles documentadas incluyen rue Notre-Dame, cours Portal, place du Marché des Chartrons, quai des Chartrons, cours Xavier Arnozan, rue Borie, cours de la Martinique y rue Rode. La página Descubrir añade paseos y lugares imprescindibles.',
        },
      },
      {
        id: 'civic-report',
        q: {
          fr: 'Comment signaler un problème à la Mairie ou à la Police Municipale ?',
          en: 'How do I report an issue to the City or the Municipal Police?',
          es: '¿Cómo aviso al Ayuntamiento o a la Policía Municipal de un problema?',
        },
        a: {
          fr: 'Dans le Guide Pratique, section « Signalements Mairie & Police Municipale ». Choisissez le motif (propreté, voirie, éclairage, déchets, bruit, stationnement gênant, incivilité) et indiquez le lieu exact : un texte de signalement se génère, prêt à copier dans le formulaire de la Ville ou à lire au téléphone. Allô Mairie centralise les demandes du quartier au 05 56 10 20 30. En cas de danger immédiat, appelez le 17 ou le 112, jamais la Police Municipale.',
          en: 'In the Practical Guide, section “City & Municipal Police reports”. Pick the reason (cleanliness, roads, lighting, waste, noise, obstructive parking, antisocial behaviour) and give the exact location: a report text is generated, ready to paste into the city form or read out on the phone. Allô Mairie centralises neighborhood requests on 05 56 10 20 30. In case of immediate danger, call 17 or 112, never the Municipal Police.',
          es: 'En la Guía práctica, sección «Avisos al Ayuntamiento y a la Policía Municipal». Elija el motivo (limpieza, calzada, alumbrado, residuos, ruido, aparcamiento molesto, comportamientos antisociales) e indique el lugar exacto: se genera un texto de aviso, listo para pegar en el formulario municipal o leer por teléfono. Allô Mairie centraliza las solicitudes del barrio en el 05 56 10 20 30. En caso de peligro inmediato, llame al 17 o al 112, nunca a la Policía Municipal.',
        },
      },
      {
        id: 'emergency',
        q: {
          fr: 'Où sont les numéros d’urgence et les consignes d’évacuation ?',
          en: 'Where are the emergency numbers and evacuation instructions?',
          es: '¿Dónde están los números de urgencia y las instrucciones de evacuación?',
        },
        a: {
          fr: 'Toujours dans le Guide Pratique, section « Urgences & évacuation » : une barre d’appel en un geste (15 SAMU, 17 Police, 18 Pompiers, 112, 114 par SMS, Police Municipale, 3237 pharmacie de garde), les risques locaux (crue et submersion de la Garonne, vigilance météo, FR-Alert, fuite de gaz), les six consignes d’évacuation dans l’ordre, les points de regroupement du quartier avec itinéraire, et une fiche téléchargeable à garder hors ligne. Le jour d’une alerte, la consigne officielle (sirène, FR-Alert, agents municipaux) prime toujours.',
          en: 'Also in the Practical Guide, section “Emergencies & evacuation”: a one-tap call bar (15 ambulance, 17 police, 18 fire, 112, 114 by SMS, Municipal Police, 3237 on-duty pharmacy), local risks (Garonne flooding, weather warnings, FR-Alert, gas leaks), the six evacuation steps in order, neighborhood assembly points with directions, and a downloadable sheet to keep offline. During a real alert, the official instruction (siren, FR-Alert, municipal staff) always takes precedence.',
          es: 'También en la Guía práctica, sección «Urgencias y evacuación»: una barra de llamada con un solo toque (15 ambulancia, 17 policía, 18 bomberos, 112, 114 por SMS, Policía Municipal, 3237 farmacia de guardia), los riesgos locales (crecida del Garona, alertas meteorológicas, FR-Alert, fugas de gas), los seis pasos de evacuación en orden, los puntos de reunión del barrio con indicaciones y una ficha descargable para guardar sin conexión. Durante una alerta real, la instrucción oficial (sirena, FR-Alert, personal municipal) prevalece siempre.',
        },
      },
    ],
  },
];

export interface FaqComparisonRow {
  id: string;
  feature: LocaleText;
  free: LocaleText;
  premium: LocaleText;
}

export const FAQ_COMPARISON = {
  title: { fr: 'Fiche gratuite vs Premium Pro', en: 'Free listing vs Premium Pro', es: 'Ficha gratuita vs Premium Pro' },
  subtitle: {
    fr: 'Tous les commerces locaux restent visibles. L’abonnement Premium Pro débloque le site web, la priorité IA, les modules d’action et les pépites des brocanteurs.',
    en: 'Every local business stays visible. Premium Pro unlocks the website, AI priority, action modules and antique dealers’ finds.',
    es: 'Todos los comercios locales siguen siendo visibles. Premium Pro desbloquea el sitio web, la prioridad IA, los módulos de acción y los hallazgos de los anticuarios.',
  },
  freeHeader: {
    fr: 'Fiche gratuite (contacts cliquables & réseaux)',
    en: 'Free listing (clickable contacts & free socials)',
    es: 'Ficha gratuita (contactos pulsables y redes gratuitas)',
  },
  premiumHeader: {
    fr: 'Abonné Premium Pro (site web, priorité IA & réservation)',
    en: 'Premium Pro subscriber (website, AI priority & direct booking)',
    es: 'Suscriptor Premium Pro (sitio web, prioridad IA y reserva directa)',
  },
  rows: [
    {
      id: 'price',
      feature: { fr: 'Tarif', en: 'Price', es: 'Precio' },
      free: { fr: 'Gratuit', en: 'Free', es: 'Gratis' },
      premium: { fr: 'À définir (offert actuellement)', en: 'To be announced (currently free)', es: 'Por definir (gratis actualmente)' },
    },
    {
      id: 'visibility',
      feature: { fr: 'Présence dans l’annuaire', en: 'Directory presence', es: 'Presencia en el directorio' },
      free: { fr: 'Oui', en: 'Yes', es: 'Sí' },
      premium: { fr: 'Oui, prioritaire', en: 'Yes, featured', es: 'Sí, destacada' },
    },
    {
      id: 'phone',
      feature: { fr: 'Téléphone cliquable', en: 'Clickable phone', es: 'Teléfono pulsable' },
      free: { fr: 'Oui', en: 'Yes', es: 'Sí' },
      premium: { fr: 'Oui', en: 'Yes', es: 'Sí' },
    },
    {
      id: 'email',
      feature: { fr: 'E-mail cliquable', en: 'Clickable email', es: 'E-mail pulsable' },
      free: { fr: 'Oui', en: 'Yes', es: 'Sí' },
      premium: { fr: 'Oui', en: 'Yes', es: 'Sí' },
    },
    {
      id: 'social',
      feature: { fr: 'Réseaux (Instagram, Facebook, WhatsApp)', en: 'Socials (Instagram, Facebook, WhatsApp)', es: 'Redes (Instagram, Facebook, WhatsApp)' },
      free: { fr: 'Oui, gratuits', en: 'Yes, free', es: 'Sí, gratis' },
      premium: { fr: 'Oui, gratuits', en: 'Yes, free', es: 'Sí, gratis' },
    },
    {
      id: 'website',
      feature: { fr: 'Lien site web officiel', en: 'Official website link', es: 'Enlace al sitio web oficial' },
      free: { fr: 'Non', en: 'No', es: 'No' },
      premium: { fr: 'Oui', en: 'Yes', es: 'Sí' },
    },
    {
      id: 'ai',
      feature: { fr: 'Priorité concierge IA', en: 'AI concierge priority', es: 'Prioridad en el conserje IA' },
      free: { fr: 'Non', en: 'No', es: 'No' },
      premium: { fr: 'Oui, Top 5', en: 'Yes, Top 5', es: 'Sí, Top 5' },
    },
    {
      id: 'actions',
      feature: { fr: 'Réservation / Click & Collect', en: 'Booking / Click & Collect', es: 'Reserva / Click & Collect' },
      free: { fr: 'Non', en: 'No', es: 'No' },
      premium: { fr: 'Selon l’activité', en: 'By activity', es: 'Según la actividad' },
    },
    {
      id: 'pepites',
      feature: { fr: 'Pépites & Arrivages (brocanteurs)', en: 'Finds & arrivals (antique dealers)', es: 'Hallazgos y novedades (anticuarios)' },
      free: { fr: 'Fiche carte & annuaire', en: 'Map & directory listing', es: 'Ficha en mapa y directorio' },
      premium: { fr: 'Jusqu’à 10 objets actifs + badge Notre-Dame', en: 'Up to 10 active items + Notre-Dame badge', es: 'Hasta 10 objetos activos + insignia Notre-Dame' },
    },
    {
      id: 'communication',
      feature: { fr: 'Onglet Communication (annonces + aide IA)', en: 'Communication tab (posts + AI help)', es: 'Pestaña Comunicación (anuncios + ayuda IA)' },
      free: { fr: 'Non', en: 'No', es: 'No' },
      premium: { fr: 'Oui, publication illimitée dans Idéa Chartrons', en: 'Yes, unlimited publishing on Idéa Chartrons', es: 'Sí, publicación ilimitada en Idéa Chartrons' },
    },
  ] satisfies FaqComparisonRow[],
};
