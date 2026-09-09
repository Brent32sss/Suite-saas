import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getProjects } from '../services/api';
import { processImageWithWatermark } from '../utils/imageProcessor';
import Layout from '../components/Layout'; 

export default function RegistroFotografico() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [proyecto, setProyecto] = useState(null);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [descargaLocal, setDescargaLocal] = useState(false);
  const [ubicacion, setUbicacion] = useState('Obteniendo ubicación GPS...');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const proyectos = await getProjects(user?.codigo);
        const proyectoActivoId = localStorage.getItem('proyectoActivo') || ''; 
        const p = proyectos.find((item) => item.codigo === proyectoActivoId || item.id === proyectoActivoId);
        if (p) setProyecto(p);
      } catch (error) {
        console.error("Error al obtener el proyecto:", error);
      }
    };
    if (user) fetchProject();

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUbicacion(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`),
        () => setUbicacion('Ubicación no disponible')
      );
    }
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const metadata = {
        fecha,
        ubicacion,
        usuario: user?.nombre || user?.codigo || 'Usuario'
      };

      const processedBase64 = await processImageWithWatermark(file, metadata);

      if (descargaLocal) {
        const link = document.createElement('a');
        link.href = processedBase64;
        const nombreProyecto = proyecto ? proyecto.codigo : 'Obra';
        link.download = `Foto_${nombreProyecto}_${fecha}.jpg`;
        link.click();
      }

      const endpoint = proyecto?.sheets_id || proyecto?.gas_endpoint;
      
      if (endpoint) {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            imagen: processedBase64,
            fecha,
            ubicacion,
            usuario: metadata.usuario
          })
        });
        alert('Foto procesada y subida exitosamente.');
      } else {
        alert('Foto procesada localmente (Este proyecto no tiene un Webhook configurado aún).');
      }
    } catch (err) {
      console.error(err);
      alert('Error al procesar o enviar la imagen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 bg-slate-50 min-h-[calc(100vh-4rem)]">
        
        {/* Banner de la herramienta */}
        <div className="mb-6 flex items-center justify-between rounded-2xl bg-[#1e293b] px-6 py-4 text-white shadow-md">
          <div className="flex items-center gap-3">
            {/* Icono de Cámara SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            <h1 className="text-lg font-bold">Cámara de Obra</h1>
          </div>
          <button
            onClick={() => navigate('/apps')}
            className="rounded-lg bg-slate-700/60 px-4 py-2 text-xs font-semibold hover:bg-slate-600 transition-colors"
          >
            ← Portal
          </button>
        </div>

        {/* Tarjeta Central */}
        <div className="mx-auto max-w-lg rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="text-center text-xl font-bold text-slate-800">Registro Fotográfico</h2>
          <p className="mb-6 text-center text-xs text-slate-500">
            Toma fotos o súbelas desde tu galería para procesarlas.
          </p>

          <div className="mb-4 rounded-xl bg-slate-50 p-4 border border-slate-100">
            <label className="mb-1 block text-xs font-semibold text-slate-700">Fecha del Registro</label>
            <input 
              type="date" 
              value={fecha} 
              onChange={(e) => setFecha(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm outline-none text-slate-700 focus:border-[#1e293b]"
            />
          </div>

          <div className="mb-4 rounded-xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-xs font-semibold text-slate-700">Opciones de Guardado</span>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-800">Descarga Local</p>
                <p className="text-[10px] text-slate-400">Guardar copia en el dispositivo</p>
              </div>
              <button 
                type="button"
                onClick={() => setDescargaLocal(!descargaLocal)}
                className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors ${descargaLocal ? 'bg-[#1e293b]' : 'bg-slate-300'}`}
              >
                <div className={`h-4 w-4 rounded-full bg-white transition-transform ${descargaLocal ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Estado del GPS con icono SVG */}
          <div className="mb-6 flex items-center justify-center gap-1 text-center text-xs font-medium text-amber-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span>{ubicacion}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl bg-[#1e293b] py-4 text-white hover:bg-slate-700 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
              <span className="text-sm font-semibold">{loading ? "Procesando..." : "Tomar Foto"}</span>
              <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} disabled={loading} className="hidden" />
            </label>

            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl bg-slate-100 py-4 text-slate-700 hover:bg-slate-200 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="text-sm font-semibold">{loading ? "Procesando..." : "Subir Galería"}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={loading} className="hidden" />
            </label>
          </div>
        </div>
      </div>
    </Layout>
  );
}