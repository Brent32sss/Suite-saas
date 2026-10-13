// src/pages/ReporteDiario.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  guardarActividadService, 
  guardarPersonalService, 
  guardarAnotacionesService,
  consultarReportePorFecha 
} from '../services/reporteDiarioService';

export default function ReporteDiario() {
  const { user } = useContext(AuthContext);
  
  // Asumimos un ID de proyecto activo (puedes adaptarlo a tu contexto)
  const projectId = user?.proyectoActivoId || 'PROY00001';

  // ESTADOS PRINCIPALES
  const [activeTab, setActiveTab] = useState('ingresar');
  const [fechaBase, setFechaBase] = useState(new Date().toISOString().split('T')[0]);
  const [loadingGuardar, setLoadingGuardar] = useState(false);

  // LISTAS DINÁMICAS (Pestaña 1)
  const [actividades, setActividades] = useState([{ id: Date.now(), texto: '', fotosNuevas: [] }]);
  const [personal, setPersonal] = useState([{ id: Date.now(), especialidad: '', rubro: '', sector: '', cant: 1 }]);
  const [anotaciones, setAnotaciones] = useState([{ id: Date.now(), hora: '08:00', texto: '' }]);

  // DATOS PARA CONSULTA (Pestaña 2)
  const [fechaConsulta, setFechaConsulta] = useState(new Date().toISOString().split('T')[0]);
  const [reporteConsultado, setReporteConsultado] = useState(null);
  const [buscando, setBuscando] = useState(false);

  // ==========================================
  // LOGICA: ACTIVIDADES
  // ==========================================
  const addActividad = () => setActividades([...actividades, { id: Date.now(), texto: '', fotosNuevas: [] }]);
  const removeActividad = (id) => setActividades(actividades.filter(a => a.id !== id));

  const handleTextoActividad = (id, txt) => {
    setActividades(actividades.map(a => a.id === id ? { ...a, texto: txt } : a));
  };

  const handleFotosSubidas = (id, files) => {
    const fileArray = Array.from(files);
    setActividades(actividades.map(a => a.id === id ? { ...a, fotosNuevas: [...a.fotosNuevas, ...fileArray] } : a));
  };

  const handleGuardarActividad = async (act) => {
    if (!act.texto.trim()) return alert("Describe la actividad antes de guardar.");
    setLoadingGuardar(true);
    try {
      await guardarActividadService({
        projectId,
        fecha: fechaBase,
        texto: act.texto,
        fotosNuevas: act.fotosNuevas,
        usuarioFirma: user?.nombre || user?.email || 'Usuario'
      });
      alert("✅ Actividad guardada en la base de datos de Reportes");
      
      removeActividad(act.id);
      if (actividades.length <= 1) addActividad();
    } catch (e) {
      console.error(e);
      alert("Error al guardar: " + e.message);
    } finally {
      setLoadingGuardar(false);
    }
  };

  // ==========================================
  // LOGICA: PERSONAL
  // ==========================================
  const addPersonal = () => setPersonal([...personal, { id: Date.now(), especialidad: '', rubro: '', sector: '', cant: 1 }]);
  const removePersonal = (id) => setPersonal(personal.filter(p => p.id !== id));

  const handleGuardarPersonal = async () => {
    setLoadingGuardar(true);
    try {
      await guardarPersonalService({
        projectId,
        fecha: fechaBase,
        listaPersonal: personal,
        usuarioFirma: user?.nombre || user?.email || 'Usuario'
      });
      alert("✅ Personal y Frentes guardados correctamente");
    } catch (e) {
      console.error(e);
      alert("Error al guardar personal: " + e.message);
    } finally {
      setLoadingGuardar(false);
    }
  };

  // ==========================================
  // LOGICA: ANOTACIONES
  // ==========================================
  const addAnotacion = () => setAnotaciones([...anotaciones, { id: Date.now(), hora: new Date().toTimeString().substring(0,5), texto: '' }]);
  const removeAnotacion = (id) => setAnotaciones(anotaciones.filter(a => a.id !== id));

  const handleGuardarAnotaciones = async () => {
    setLoadingGuardar(true);
    try {
      await guardarAnotacionesService({
        projectId,
        fecha: fechaBase,
        listaAnotaciones: anotaciones,
        usuarioFirma: user?.nombre || user?.email || 'Usuario'
      });
      alert("✅ Anotaciones guardadas correctamente");
    } catch (e) {
      console.error(e);
      alert("Error al guardar anotaciones: " + e.message);
    } finally {
      setLoadingGuardar(false);
    }
  };

  // ==========================================
  // LOGICA: BUSCAR REPORTE
  // ==========================================
  const handleBuscarReporte = async () => {
    setBuscando(true);
    try {
      const data = await consultarReportePorFecha(projectId, fechaConsulta);
      setReporteConsultado(data);
    } catch (e) {
      console.error(e);
      alert("Error al consultar el reporte.");
    } finally {
      setBuscando(false);
    }
  };

  // ==========================================
  // RENDER (INTERFAZ)
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20 lg:pb-8">
      <div className="max-w-4xl mx-auto mt-16 lg:mt-4 w-full">
        
        {/* ENCABEZADO MÓVIL (Con tu color exacto #1e293b) */}
        <div className="bg-[#1e293b] text-white p-4 rounded-xl shadow-md mb-6 flex justify-between items-center lg:hidden">
            <h1 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined">assignment</span> Reporte Diario
            </h1>
        </div>

        {/* TABS NAVEGACIÓN */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setActiveTab('ingresar')} className={`flex-1 py-2.5 px-4 font-bold text-sm rounded-lg whitespace-nowrap flex justify-center items-center gap-2 transition shadow-sm border ${activeTab === 'ingresar' ? 'bg-[#1e293b] text-white border-[#1e293b]' : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50'}`}>
            <span className="material-symbols-outlined text-lg">edit_document</span> Registro
          </button>
          <button onClick={() => setActiveTab('modificar')} className={`flex-1 py-2.5 px-4 font-bold text-sm rounded-lg whitespace-nowrap flex justify-center items-center gap-2 transition shadow-sm border ${activeTab === 'modificar' ? 'bg-[#1e293b] text-white border-[#1e293b]' : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50'}`}>
            <span className="material-symbols-outlined text-lg">manage_search</span> Modificar
          </button>
          <button onClick={() => setActiveTab('previsualizar')} className={`flex-1 py-2.5 px-4 font-bold text-sm rounded-lg whitespace-nowrap flex justify-center items-center gap-2 transition shadow-sm border ${activeTab === 'previsualizar' ? 'bg-[#1e293b] text-white border-[#1e293b]' : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50'}`}>
            <span className="material-symbols-outlined text-lg">picture_as_pdf</span> PDF
          </button>
          <button onClick={() => setActiveTab('enviar')} className={`flex-1 py-2.5 px-4 font-bold text-sm rounded-lg whitespace-nowrap flex justify-center items-center gap-2 transition shadow-sm border ${activeTab === 'enviar' ? 'bg-[#1e293b] text-white border-[#1e293b]' : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50'}`}>
            <span className="material-symbols-outlined text-lg">forward_to_inbox</span> Enviar
          </button>
        </div>

        {/* =========================================
            PESTAÑA 1: NUEVO REGISTRO
        ========================================= */}
        {activeTab === 'ingresar' && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <span className="material-symbols-outlined text-[#1e293b]">post_add</span> Nuevo Registro
            </h2>
            
            <div className="mb-6 w-full md:w-1/2">
              <label className="block text-sm font-semibold text-slate-600 mb-1">Fecha del Reporte</label>
              <input type="date" value={fechaBase} onChange={(e) => setFechaBase(e.target.value)} max={new Date().toISOString().split('T')[0]} className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-slate-50 outline-none focus:border-[#1e293b]" />
            </div>

            {/* SECCIÓN ACTIVIDADES */}
            <div className="mb-8">
              <h4 className="text-base font-bold text-[#1e293b] flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[20px]">list_alt</span> Actividades Realizadas
              </h4>
              
              <div className="space-y-4">
                {actividades.map((act) => (
                  <div key={act.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative mb-4">
                    <button onClick={() => removeActividad(act.id)} className="absolute top-2 right-2 bg-red-100 text-red-600 w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-200 transition">✕</button>
                    
                    <textarea value={act.texto} onChange={(e) => handleTextoActividad(act.id, e.target.value)} className="w-full p-2.5 text-sm border border-slate-300 rounded-lg outline-none mb-3 bg-white focus:border-[#1e293b]" rows="2" placeholder="Describe la actividad realizada..."></textarea>
                    
                    <div className="flex gap-3 mb-2">
                      <label className="flex-1 bg-[#1e293b] hover:bg-slate-700 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition">
                        <span className="material-symbols-outlined text-[18px]">photo_camera</span> Tomar
                        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFotosSubidas(act.id, e.target.files)} />
                      </label>

                      <label className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition">
                        <span className="material-symbols-outlined text-[18px]">upload_file</span> Subir
                        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFotosSubidas(act.id, e.target.files)} />
                      </label>
                    </div>

                    {/* Previsualización de Fotos Adjuntas */}
                    {act.fotosNuevas.length > 0 && (
                      <div className="flex flex-wrap gap-2 my-3">
                        {act.fotosNuevas.map((file, idx) => (
                          <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border border-slate-300 relative">
                            <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    <button disabled={loadingGuardar} onClick={() => handleGuardarActividad(act)} className="w-full bg-[#1e293b] hover:bg-slate-700 text-white font-bold py-2.5 rounded-lg text-sm transition shadow-sm mt-2 disabled:opacity-50">
                      {loadingGuardar ? 'Guardando...' : 'Guardar Actividad y Fotos'}
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={addActividad} className="w-full mt-2 bg-slate-200 hover:bg-slate-300 text-slate-800 border border-dashed border-slate-400 font-bold py-2.5 rounded-lg transition flex justify-center items-center gap-2">
                <span className="material-symbols-outlined text-lg">add</span> Añadir Actividad
              </button>
            </div>

            {/* SECCIÓN PERSONAL */}
            <div className="mb-8 border-t border-slate-100 pt-6">
              <h4 className="text-base font-bold text-indigo-700 flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[20px]">groups</span> Personal y Frentes
              </h4>

              <div className="space-y-4">
                {personal.map((pers) => (
                  <div key={pers.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative">
                    <button onClick={() => removePersonal(pers.id)} className="absolute top-2 right-2 bg-red-100 text-red-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">✕</button>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3 mt-4">
                      <input type="text" placeholder="Especialidad (Ej: Estructuras)" value={pers.especialidad} onChange={(e) => {
                        const val = e.target.value;
                        setPersonal(personal.map(p => p.id === pers.id ? { ...p, especialidad: val } : p));
                      }} className="p-2 text-sm border border-slate-300 rounded-lg outline-none bg-white focus:border-[#1e293b]" />
                      
                      <input type="text" placeholder="Rubro (Ej: Acero)" value={pers.rubro} onChange={(e) => {
                        const val = e.target.value;
                        setPersonal(personal.map(p => p.id === pers.id ? { ...p, rubro: val } : p));
                      }} className="p-2 text-sm border border-slate-300 rounded-lg outline-none bg-white focus:border-[#1e293b]" />
                      
                      <input type="text" placeholder="Frente (Ej: Torre A)" value={pers.sector} onChange={(e) => {
                        const val = e.target.value;
                        setPersonal(personal.map(p => p.id === pers.id ? { ...p, sector: val } : p));
                      }} className="p-2 text-sm border border-slate-300 rounded-lg outline-none bg-white focus:border-[#1e293b]" />
                    </div>

                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden w-32 bg-slate-50 shadow-sm mt-1">
                      <button onClick={() => setPersonal(personal.map(p => p.id === pers.id ? { ...p, cant: Math.max(1, p.cant - 1) } : p))} className="px-3 py-1.5 bg-slate-100 font-bold text-slate-600 border-r border-slate-300 hover:bg-slate-200">-</button>
                      <input type="number" className="w-full p-1.5 text-sm text-center outline-none bg-white font-semibold" value={pers.cant} readOnly />
                      <button onClick={() => setPersonal(personal.map(p => p.id === pers.id ? { ...p, cant: p.cant + 1 } : p))} className="px-3 py-1.5 bg-slate-100 font-bold text-slate-600 border-l border-slate-300 hover:bg-slate-200">+</button>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={addPersonal} className="w-full mt-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-dashed border-indigo-300 font-bold py-2.5 rounded-lg transition flex justify-center items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-lg">add</span> Añadir Personal
              </button>

              <button disabled={loadingGuardar} onClick={handleGuardarPersonal} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition disabled:opacity-50">
                Guardar Personal <span className="material-symbols-outlined text-lg">save</span>
              </button>
            </div>

            {/* SECCIÓN ANOTACIONES */}
            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-base font-bold text-amber-600 flex items-center gap-2 mb-4"><span className="material-symbols-outlined text-[20px]">comment</span> Anotaciones</h4>
              <div className="space-y-4">
                {anotaciones.map((anot) => (
                  <div key={anot.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative mb-4">
                    <button onClick={() => removeAnotacion(anot.id)} className="absolute top-2 right-2 bg-red-100 text-red-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">✕</button>
                    <input type="time" value={anot.hora} onChange={(e) => {
                      const val = e.target.value;
                      setAnotaciones(anotaciones.map(a => a.id === anot.id ? { ...a, hora: val } : a));
                    }} className="p-2 text-sm border rounded-lg mb-2 bg-white outline-none focus:border-amber-500" />
                    
                    <textarea value={anot.texto} onChange={(e) => {
                      const val = e.target.value;
                      setAnotaciones(anotaciones.map(a => a.id === anot.id ? { ...a, texto: val } : a));
                    }} className="w-full p-2.5 text-sm border rounded-lg bg-white outline-none focus:border-amber-500" rows="2" placeholder="Descripción..."></textarea>
                  </div>
                ))}
              </div>

              <button onClick={addAnotacion} className="w-full mt-4 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-dashed border-amber-300 font-bold py-2.5 rounded-lg transition flex justify-center items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-lg">add</span> Añadir Anotación
              </button>

              <button disabled={loadingGuardar} onClick={handleGuardarAnotaciones} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition disabled:opacity-50">
                Guardar Anotaciones <span className="material-symbols-outlined text-lg">save</span>
              </button>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: MODIFICAR */}
        {activeTab === 'modificar' && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4 flex items-center gap-2">
               <span className="material-symbols-outlined text-[#1e293b]">manage_search</span> Consultar y Modificar
            </h2>
            <div className="flex gap-3 mb-6">
              <input type="date" value={fechaConsulta} onChange={(e) => setFechaConsulta(e.target.value)} className="p-2.5 border rounded-lg bg-slate-50 outline-none text-sm focus:border-[#1e293b]" />
              <button onClick={handleBuscarReporte} disabled={buscando} className="bg-[#1e293b] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-700 transition">
                {buscando ? 'Buscando...' : 'Buscar Reporte'}
              </button>
            </div>

            {reporteConsultado ? (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-500 mb-2">Creado por: {reporteConsultado.creadopor_proyect}</p>
                <p className="text-sm font-semibold text-slate-700">Actividades registradas: {reporteConsultado.actividades?.length || 0}</p>
                <p className="text-sm font-semibold text-slate-700">Registros de personal: {reporteConsultado.personal?.length || 0}</p>
                <p className="text-sm font-semibold text-slate-700">Anotaciones: {reporteConsultado.anotaciones?.length || 0}</p>
                <p className="mt-4 text-xs italic text-slate-400">Nota: La edición completa la integraremos en el siguiente módulo.</p>
              </div>
            ) : (
              <p className="text-slate-400 text-sm text-center py-6">Selecciona una fecha y haz clic en buscar para ver si hay un reporte guardado.</p>
            )}
          </div>
        )}

        {/* PESTAÑA 3 & 4 */}
        {(activeTab === 'previsualizar' || activeTab === 'enviar') && (
          <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 text-center text-slate-500">
            <span className="material-symbols-outlined text-5xl mb-2 text-[#1e293b] opacity-50">construction</span>
            <p className="font-bold">Generador PDF y Envío de Correos</p>
            <p className="text-xs text-slate-400 mt-1">Se activará tras validar que el guardado de Firebase funciona perfectamente.</p>
          </div>
        )}

      </div>
    </div>
  );
}