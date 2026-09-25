import { useState, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ProfileMenu from './ProfileMenu.jsx'
import { AuthContext } from '../context/AuthContext'
import { getProjects } from '../services/api'

const categoriasAplicaciones = [
  {
    id: 'comunicacion',
    titulo: 'Comunicación',
    icono: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.221-1.15-2.136-2.37-2.193-2.716-.126-5.45-.126-8.16 0-1.22.057-2.37.972-2.37 2.193v1.942m-1.98 1.951c-.696.37-1.156 1.114-1.156 1.951v4.286c0 1.136.847 2.1 1.98 2.193 1.326.108 2.666.163 4.02.163l3 3v-3.091c.34-.02.68-.045 1.02-.072" />
      </svg>
    ),
    apps: [
      { nombre: 'Registro Fotográfico', ruta: '/registro-fotografico' },
      { nombre: 'Directorio de Obra', ruta: '/directorio' }
    ]
  },
  {
    id: 'calidad',
    titulo: 'Calidad',
    icono: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    apps: [
      { nombre: 'Inspecciones', ruta: '/inspecciones' }
    ]
  }
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  
  const [proyectos, setProyectos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [proyectoActivoId, setProyectoActivoId] = useState(localStorage.getItem('proyectoActivo') || '');
  const [categoriaAbierta, setCategoriaAbierta] = useState(null);

  // Detectar si estamos dentro de una herramienta
  const isInsideTool = location.pathname !== '/proyectos' && location.pathname !== '/' && location.pathname !== '/apps';
  
  // Detectar específicamente si estamos en Registro Fotográfico para cambiar el color
  const isCameraApp = location.pathname.includes('registro-fotografico');

  // ESTILOS DINÁMICOS: Forma y aspecto estáticos, color de texto dinámico
  const roleColorStyle = isCameraApp ? 'text-[#1e293b]' : 'text-primary';
  const navLinkStyle = `bg-slate-50 border border-slate-200 font-medium hover:bg-slate-100 ${
    isCameraApp ? 'text-[#1e293b]' : 'text-primary'
  }`;

  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        try {
          const data = await getProjects(user.codigo);
          setProyectos(data);
          
          if (!localStorage.getItem('proyectoActivo') && data.length > 0) {
            const primerProyectoId = data[0].id || data[0].codigo;
            setProyectoActivoId(primerProyectoId);
            localStorage.setItem('proyectoActivo', primerProyectoId);
          }
        } catch (error) {
          console.error("Error al cargar proyectos en Sidebar:", error);
        }
      }
    };
    fetchProjects();
  }, [user]);

  const proyectosFiltrados = proyectos.filter(p =>
    (p.nombre || p.codigo || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const seleccionarProyecto = (id) => {
    setProyectoActivoId(id);
    localStorage.setItem('proyectoActivo', id);
    window.dispatchEvent(new Event('storage'));
    
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const toggleCategoria = (id) => {
    setCategoriaAbierta(categoriaAbierta === id ? null : id);
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-[#0F1615]/55 transition-opacity duration-200 lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[280px] max-w-[85vw] flex-col
          bg-surface shadow-drawer transition-transform duration-300 ease-out
          lg:translate-x-0 lg:border-r lg:border-border lg:shadow-none bg-white
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <ProfileMenu>
          <div className="flex items-center gap-3.5 p-5">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#D9DEE3] text-[15px] font-bold text-ink-secondary">
              {user?.nombre ? user.nombre.substring(0, 2).toUpperCase() : 'CS'}
            </div>
            <div className="text-left">
              <p className="mb-0.5 text-sm font-bold text-ink">{user?.nombre || 'Christian Suárez'}</p>
              <p className={`text-[11.5px] font-bold transition-colors duration-300 ${roleColorStyle}`}>
                Rol: {user?.rol || 'ADMIN'}
              </p>
            </div>
          </div>
        </ProfileMenu>

        <div className="h-px bg-border bg-slate-200" />

        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200">
          
          {/* NAVEGACIÓN PRINCIPAL */}
          <p className="px-6 pb-3 pt-5 text-[10.5px] font-bold tracking-wide text-ink-faint">
            NAVEGACIÓN
          </p>
          <nav className="flex flex-col gap-1 px-3">
            <Link
              to="/proyectos"
              onClick={onClose}
              className={`flex items-center gap-3 rounded-md px-3 py-3 text-[13px] transition-all duration-300 ${navLinkStyle}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Inicio
            </Link>
          </nav>

          {/* SECCIÓN: MIS PROYECTOS */}
          <div className="mt-4 flex flex-col gap-3 px-3 pb-4">
            <p className="px-3 pb-1 pt-4 text-[10.5px] font-bold tracking-wide text-slate-400 uppercase border-t border-slate-100">
              MIS PROYECTOS
            </p>

            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar proyecto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-[13px] border border-slate-200 rounded-lg outline-none focus:border-slate-400 text-slate-600 placeholder-slate-400 bg-white shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              {proyectosFiltrados.map((proyecto) => {
                const isActivo = (proyecto.id === proyectoActivoId) || (proyecto.codigo === proyectoActivoId);
                return (
                  <button
                    key={proyecto.id || proyecto.codigo}
                    onClick={() => seleccionarProyecto(proyecto.id || proyecto.codigo)}
                    className={`flex items-center justify-between w-full px-3 py-2.5 text-[13px] rounded-lg transition-colors ${
                      isActivo
                        ? 'bg-slate-50 text-slate-700 font-medium'
                        : 'text-slate-500 hover:bg-slate-50/50'
                    }`}
                  >
                    <span className="truncate">{proyecto.nombre}</span>
                    {isActivo && (
                      <span className="w-2 h-2 rounded-full bg-[#10b981] flex-shrink-0 shadow-sm" />
                    )}
                  </button>
                );
              })}
              
              {proyectosFiltrados.length === 0 && (
                <p className="text-xs text-center text-slate-400 py-4">No se encontraron proyectos</p>
              )}
            </div>
          </div>

          {/* SECCIÓN: APLICACIONES */}
          {isInsideTool && (
            <div className="mt-2 flex flex-col px-3 pb-8">
              <p className="px-3 pb-2 pt-4 text-[10.5px] font-bold tracking-wide text-slate-400 uppercase border-t border-slate-100">
                APLICACIONES (PMBOK)
              </p>
              
              <div className="flex flex-col gap-1">
                {categoriasAplicaciones.map((categoria) => {
                  const isAbierta = categoriaAbierta === categoria.id;
                  
                  return (
                    <div key={categoria.id} className="flex flex-col">
                      <button
                        onClick={() => toggleCategoria(categoria.id)}
                        className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3 text-slate-600 group-hover:text-slate-800 transition-colors">
                          {categoria.icono}
                          <span className="text-[13.5px] font-semibold">{categoria.titulo}</span>
                        </div>
                        
                        <div className={`flex items-center justify-center w-5 h-5 rounded-[3px] transition-all duration-200 ${
                          isAbierta ? 'bg-[#3b66df] text-white' : 'text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'
                        }`}>
                          <svg 
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${isAbierta ? '' : '-rotate-90'}`} 
                            fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>
                      </button>

                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isAbierta ? 'max-h-48 opacity-100 mt-1' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="flex flex-col gap-1 pl-11 pr-2 pb-2">
                          {categoria.apps.map((app, index) => (
                            <Link
                              key={index}
                              to={app.ruta}
                              onClick={() => window.innerWidth < 1024 && onClose()}
                              className={`block py-1.5 text-[12.5px] rounded-md transition-colors ${
                                location.pathname.includes(app.ruta)
                                  ? 'text-[#3b66df] font-semibold'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              {app.nombre}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </aside>
    </>
  )
}