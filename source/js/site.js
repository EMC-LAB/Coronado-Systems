(() => {
  'use strict';
  const q = (s, ctx=document) => ctx.querySelector(s);
  const qa = (s, ctx=document) => [...ctx.querySelectorAll(s)];
  const menuSwitch = q('#menuSwitch');
  const mobileNav = q('#mobileNav');
  const themeSwitch = q('#themeSwitch');
  const nodeTips = [
    'Atrae personas interesadas en tu negocio.',
    'Transforma visitas en pedidos y contactos.',
    'Da seguimiento sin perder oportunidades.',
    'Organiza tu operación en un solo lugar.'
  ];
  qa('[data-node]').forEach(node => {
    node.addEventListener('click', () => {
      const i = Number(node.dataset.node);
      q('#networkTip').textContent = nodeTips[i] || nodeTips[0];
      qa('[data-node]').forEach(n => n.classList.remove('is-selected'));
      node.classList.add('is-selected');
    });
  });

  function setMenu(open) {
    mobileNav.hidden = !open;
    menuSwitch.setAttribute('aria-expanded', String(open));
    menuSwitch.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    q('use', menuSwitch).setAttribute('href', open ? '#i-x' : '#i-menu');
  }
  menuSwitch.addEventListener('click', () => setMenu(mobileNav.hidden));
  qa('.mobile-nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('resize', () => { if (innerWidth > 900) setMenu(false); });

  let savedTheme = 'dark';
  try { savedTheme = localStorage.getItem('coronado-theme') || 'dark'; } catch (_) {}
  function applyTheme(theme) {
    document.body.classList.toggle('light', theme === 'light');
    q('use', themeSwitch).setAttribute('href', theme === 'light' ? '#i-moon' : '#i-sun');
    themeSwitch.setAttribute('aria-label', theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', theme === 'light' ? '#f9f8fd' : '#090b18');
  }
  applyTheme(savedTheme);
  themeSwitch.addEventListener('click', () => {
    const t = document.body.classList.contains('light') ? 'dark' : 'light';
    applyTheme(t);
    try { localStorage.setItem('coronado-theme', t); } catch (_) {}
  });

  const businessSolutions = {
    restaurante: {
      emoji:'🍔', title:'Tu menú deja de ser una foto. Empieza a vender.',
      text:'El cliente escanea, explora el menú, personaliza su pedido y lo envía desde su celular. Tu equipo administra las órdenes en un panel.',
      features:['Menú interactivo','Pedidos sin complicaciones','Panel de control'], domain:'tu-restaurante.com',brand:'TU RESTAURANTE',initial:'B',tagline:'Un gran sabor, un gran sistema.',eyebrow:'MENÚ DIGITAL',headline:'Elige, personaliza y ordena.',cta:'ORDENAR AHORA',steps:['Selecciona productos','Envía tu pedido','Recibe confirmación'],notice:'Nuevo pedido recibido',color:'#e9c866',photo:true,theme:'#101526'
    },
    eventos: {
      emoji:'✨',title:'De “¿está disponible?” a una visita confirmada.',
      text:'Una web que presenta tu espacio, muestra galerías, permite solicitar fechas y organiza las consultas para que no se pierdan oportunidades.',
      features:['Galería y recorrido','Solicitud de fechas','Seguimiento de prospectos'],domain:'tu-finca.com',brand:'TU SALÓN DE EVENTOS',initial:'E',tagline:'Momentos inolvidables.',eyebrow:'TU PRÓXIMA CELEBRACIÓN',headline:'Una fecha especial empieza aquí.',cta:'CONSULTAR FECHA',steps:['Explora el lugar','Consulta tu fecha','Recibe seguimiento'],notice:'Nueva solicitud de visita',color:'#e8addf',photo:false,theme:'#231629'
    },
    farmacia: {
      emoji:'💊',title:'Todo el movimiento de tu tienda, bajo control.',
      text:'Un punto de venta que conecta caja, productos, inventario y permisos de usuario, con reportes que ayudan a tomar decisiones.',
      features:['Punto de venta','Inventario y productos','Usuarios y reportes'],domain:'tu-comercio.local',brand:'TU FARMACIA O TIENDA',initial:'+',tagline:'Atención y control en un solo lugar.',eyebrow:'PUNTO DE VENTA',headline:'Vende rápido. Controla mejor.',cta:'VER PRODUCTOS',steps:['Registra ventas','Actualiza existencias','Consulta reportes'],notice:'Venta registrada',color:'#7be5db',photo:false,theme:'#0a3133'
    },
    servicios: {
      emoji:'📈',title:'Un sistema para que ningún prospecto se pierda.',
      text:'Captamos interesados, centralizamos contactos, asignamos seguimientos y ayudamos a convertir conversaciones en oportunidades comerciales.',
      features:['Campañas y formularios','WhatsApp + CRM','Seguimientos automatizados'],domain:'tu-servicio.com',brand:'TU EMPRESA',initial:'S',tagline:'Más orden para vender mejor.',eyebrow:'SISTEMA COMERCIAL',headline:'De prospecto a cliente, con método.',cta:'SOLICITAR ASESORÍA',steps:['Recibe prospectos','Da seguimiento','Mide oportunidades'],notice:'Nuevo prospecto registrado',color:'#aaa1ff',photo:false,theme:'#1b2144'
    },
    industria: {
      emoji:'🏭',title:'Datos y procesos complejos, convertidos en claridad.',
      text:'Paneles de monitoreo, administración de proyectos, documentos, reportes e integraciones para equipos que necesitan visibilidad de su operación.',
      features:['Monitoreo e indicadores','Control de proyectos','Software a medida'],domain:'tu-industria.com',brand:'TU OPERACIÓN',initial:'I',tagline:'Datos que ayudan a decidir.',eyebrow:'PLATAFORMA OPERATIVA',headline:'Control visible. Decisiones oportunas.',cta:'VER INDICADORES',steps:['Captura datos','Visualiza operación','Da seguimiento'],notice:'Panel sincronizado (ejemplo)',color:'#79d5f7',photo:false,theme:'#132a42'
    }
  };
  function updateIndustry(key) {
    const d=businessSolutions[key]; if(!d) return;
    qa('[data-industry]').forEach(tab => {
      const active=tab.dataset.industry===key;
      tab.classList.toggle('is-active',active);
      tab.setAttribute('aria-selected',String(active));
      tab.tabIndex=active?0:-1;
    });
    const idMap={industryIcon:'emoji',industryTitle:'title',industryText:'text',browserDomain:'domain',mockBrand:'brand',mockTagline:'tagline',mockEyebrow:'eyebrow',mockHeadline:'headline',mockCTA:'cta',mockNotif:'notice',mockLogo:'initial'};
    Object.entries(idMap).forEach(([id,keyName]) => {
      const el=q('#'+id); if(!el) return;
      if(id==='mockCTA'){
        const icon=el.querySelector('svg');el.replaceChildren(document.createTextNode(d[keyName]+' '));if(icon) el.append(icon);
      }else el.textContent=d[keyName];
    });
    q('#mockLogo').style.background=d.color;
    q('.mock-hero').style.background=`linear-gradient(105deg,${d.theme},#141526)`;
    q('#mockPhoto').style.display=d.photo?'block':'none';
    d.steps.forEach((v,i) => { q('#mockStep'+(i+1)).textContent=v; });
    q('#industryFeatures').replaceChildren(...d.features.map(feature => {
      const span=document.createElement('span');
      const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('ico');
      const use=document.createElementNS('http://www.w3.org/2000/svg','use'); use.setAttribute('href','#i-check');svg.append(use);
      span.append(svg,document.createTextNode(' '+feature));return span;
    }));
  }
  qa('[data-industry]').forEach((tab,index,tabs) => {
    tab.addEventListener('click', () => updateIndustry(tab.dataset.industry));
    tab.addEventListener('keydown', e => {
      const shift=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;
      if(shift){e.preventDefault();const next=tabs[(index+shift+tabs.length)%tabs.length];updateIndustry(next.dataset.industry);next.focus();}
    });
  });

  qa('[data-filter]').forEach(b => b.addEventListener('click', () => {
    const filter=b.dataset.filter;
    qa('[data-filter]').forEach(f => {const active=f===b;f.classList.toggle('is-active',active);f.setAttribute('aria-pressed',String(active));});
    qa('.project-card').forEach(card => {card.hidden=filter!=='todos'&&!card.dataset.category.split(' ').includes(filter);});
  }));
  const form=q('#contactForm');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    if (!form.reportValidity()) return;
    const name=q('#clientName').value.trim();
    const business=q('#clientBusiness').value;
    const service=q('#clientService').value;
    const details=q('#clientDetails').value.trim();
    const text=`Hola, soy ${name}. Vi el sitio de Coronado Systems.\n\nMi negocio: ${business}\nMe interesa: ${service}${details?`\nMi idea: ${details}`:''}\n\n¿Podemos conversar sobre una propuesta?`;
    const url='https://wa.me/525579449790?text='+encodeURIComponent(text);
    const win=window.open(url,'_blank','noopener,noreferrer');
    if(!win) window.location.href=url;
  });
  q('#year').textContent=String(new Date().getFullYear());
  // Páginas jerárquicas SILO; todas las secciones originales siguen disponibles.
  const pageMap = {inicio:'inicio',silo:'inicio',soluciones:'soluciones',demo:'soluciones',experiencia:'experiencia',impacto:'experiencia','banco-emc':'experiencia',metodo:'metodo',nosotros:'nosotros',contacto:'contacto'};
  const pageTitles = {soluciones:'SOLUCIONES',experiencia:'EXPERIENCIA',metodo:'NUESTRO MÉTODO',nosotros:'NOSOTROS',contacto:'CONTACTO'};
  let activePage = '';
  const applyRoute = () => {
    const target = (location.hash || '#inicio').slice(1);
    const page = pageMap[target] || 'inicio';
    if (page !== activePage) {
      document.querySelectorAll('[data-page]').forEach(section => { section.hidden = section.dataset.page !== page; });
      activePage = page;
      window.scrollTo({top:0,left:0,behavior:'instant'});
    }
    const bar = document.getElementById('routeBar');
    bar.hidden = page==='inicio';
    document.getElementById('routeName').textContent = pageTitles[page] || '';
    document.querySelectorAll('.desktop-nav a,.mobile-nav a,.footer-links a').forEach(link => {
      const linkPage = pageMap[link.getAttribute('href')?.slice(1)] || '';
      const chosen = linkPage === page;
      link.classList.toggle('nav-active',chosen);
      if (chosen) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
    });
    if (page !== 'inicio' && target!==page && document.getElementById(target)) {
      requestAnimationFrame(()=>document.getElementById(target).scrollIntoView({block:'start',behavior:'instant'}));
    }
    if (typeof setMenu === 'function' && !mobileNav.hidden) setMenu(false);
  };
  window.addEventListener('hashchange',applyRoute);
  applyRoute();

})();