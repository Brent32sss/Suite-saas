// src/pages/ReporteDiario.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout.jsx';
import { 
  guardarActividadService, 
  guardarPersonalService, 
  guardarAnotacionesService,
  consultarReportePorFecha,
  actualizarReporteCompletoService 
} from '../services/reporteDiarioService';

export default function ReporteDiario() {
  const { user } = useContext(AuthContext);
  
  const projectId = user?.proyectoActivoId || localStorage.getItem('proyectoActivo') || 'PROY00001';

  // ESTADOS PRINCIPALES
  const [activeTab, setActiveTab] = useState('ingresar');
  const [fechaBase, setFechaBase] = useState(new Date().toISOString().split('T')[0]);
  const [loadingGuardar, setLoadingGuardar] = useState(false);

  // LISTAS DINÁMICAS (Pestaña 1: Nuevo Registro)
  const [actividades, setActividades] = useState([{ id: Date.now(), texto: '', fotosNuevas: [] }]);
  const [personal, setPersonal] = useState([{ id: Date.now(), especialidad: '', rubro: '', sector: '', cant: 1 }]);
  const [anotaciones, setAnotaciones] = useState([{ id: Date.now(), hora: '08:00', texto: '' }]);

  // DATOS PARA CONSULTA Y EDICIÓN (Pestaña 2: Modificar)
  const [fechaConsulta, setFechaConsulta] = useState(new Date().toISOString().split('T')[0]);
  const [reporteEditando, setReporteEditando] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);

  // ==========================================
  // LOGICA: ACTIVIDADES (PESTAÑA 1)
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
  // LOGICA: PERSONAL (PESTAÑA 1)
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
  // LOGICA: ANOTACIONES (PESTAÑA 1)
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
  // LOGICA: CONSULTAR Y MODIFICAR (PESTAÑA 2)
  // ==========================================
  const handleBuscarReporte = async () => {
    setBuscando(true);
    setReporteEditando(null);
    try {
      const data = await consultarReportePorFecha(projectId, fechaConsulta);
      if (data) {
        setReporteEditando({
          fecha: fechaConsulta,
          creadopor_proyect: data.creadopor_proyect || 'Usuario',
          actividades: (data.actividades || []).map(act => ({
            id_act: act.id_act || `ACT_${Date.now()}`,
            texto_act: act.texto_act || '',
            evidencias_fotograficas: act.evidencias_fotograficas || []
          })),
          personal: (data.personal || []).map(p => ({
            id: p.id || Date.now(),
            especialidad: p.especialidad || '',
            rubro: p.rubro || '',
            sector: p.sector || '',
            cant: p.cant || 1
          })),
          anotaciones: (data.anotaciones || []).map(a => ({
            id: a.id || Date.now(),
            hora: a.hora || '08:00',
            texto: a.texto || ''
          }))
        });
      } else {
        alert(`No se encontró reporte registrado para el día ${fechaConsulta}.`);
      }
    } catch (e) {
      console.error(e);
      alert("Error al consultar el reporte.");
    } finally {
      setBuscando(false);
    }
  };

  const handleEditActividadTexto = (index, nuevoTexto) => {
    const list = [...reporteEditando.actividades];
    list[index].texto_act = nuevoTexto;
    setReporteEditando({ ...reporteEditando, actividades: list });
  };

  const removeEditActividad = (index) => {
    const list = reporteEditando.actividades.filter((_, i) => i !== index);
    setReporteEditando({ ...reporteEditando, actividades: list });
  };

  const addEditActividad = () => {
    setReporteEditando({
      ...reporteEditando,
      actividades: [...reporteEditando.actividades, { id_act: `ACT_${Date.now()}`, texto_act: '', evidencias_fotograficas: [] }]
    });
  };

  const handleEditPersonal = (index, campo, valor) => {
    const list = [...reporteEditando.personal];
    list[index][campo] = valor;
    setReporteEditando({ ...reporteEditando, personal: list });
  };

  const removeEditPersonal = (index) => {
    const list = reporteEditando.personal.filter((_, i) => i !== index);
    setReporteEditando({ ...reporteEditando, personal: list });
  };

  const addEditPersonal = () => {
    setReporteEditando({
      ...reporteEditando,
      personal: [...reporteEditando.personal, { id: Date.now(), especialidad: '', rubro: '', sector: '', cant: 1 }]
    });
  };

  const handleEditAnotacion = (index, campo, valor) => {
    const list = [...reporteEditando.anotaciones];
    list[index][campo] = valor;
    setReporteEditando({ ...reporteEditando, anotaciones: list });
  };

  const removeEditAnotacion = (index) => {
    const list = reporteEditando.anotaciones.filter((_, i) => i !== index);
    setReporteEditando({ ...reporteEditando, anotaciones: list });
  };

  const addEditAnotacion = () => {
    setReporteEditando({
      ...reporteEditando,
      anotaciones: [...reporteEditando.anotaciones, { id: Date.now(), hora: '08:00', texto: '' }]
    });
  };

  const handleGuardarCambiosReporte = async () => {
    if (!reporteEditando) return;
    setGuardandoEdicion(true);
    try {
      await actualizarReporteCompletoService({
        projectId,
        fecha: reporteEditando.fecha,
        actividades: reporteEditando.actividades,
        personal: reporteEditando.personal,
        anotaciones: reporteEditando.anotaciones,
        usuarioFirma: user?.nombre || user?.email || 'Usuario'
      });
      alert("✅ Reporte actualizado exitosamente en Firestore.");
    } catch (e) {
      console.error(e);
      alert("Error al actualizar: " + e.message);
    } finally {
      setGuardandoEdicion(false);
    }
  };

  // ==========================================
  // RENDER (INTERFAZ)
  // ==========================================
  return (
    <Layout title="Reporte Diario">
      <div className="bg-slate-50 min-h-[calc(100vh-4rem)] rounded-xl">
        <div className="max-w-4xl mx-auto w-full p-2">
          
          {/* TABS NAVEGACIÓN */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => setActiveTab('ingresar')} className={`flex-1 py-2.5 px-4 font-bold text-sm rounded-lg whitespace-nowrap flex justify-center items-center gap-2 transition shadow-sm border ${activeTab === 'ingresar' ? 'bg-[#1e293b] text-white border-[#1e293b]' : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50'}`}>
              Registro
            </button>
            <button onClick={() => setActiveTab('modificar')} className={`flex-1 py-2.5 px-4 font-bold text-sm rounded-lg whitespace-nowrap flex justify-center items-center gap-2 transition shadow-sm border ${activeTab === 'modificar' ? 'bg-[#1e293b] text-white border-[#1e293b]' : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50'}`}>
              Modificar
            </button>
            <button onClick={() => setActiveTab('previsualizar')} className={`flex-1 py-2.5 px-4 font-bold text-sm rounded-lg whitespace-nowrap flex justify-center items-center gap-2 transition shadow-sm border ${activeTab === 'previsualizar' ? 'bg-[#1e293b] text-white border-[#1e293b]' : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50'}`}>
              PDF
            </button>
            <button onClick={() => setActiveTab('enviar')} className={`flex-1 py-2.5 px-4 font-bold text-sm rounded-lg whitespace-nowrap flex justify-center items-center gap-2 transition shadow-sm border ${activeTab === 'enviar' ? 'bg-[#1e293b] text-white border-[#1e293b]' : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50'}`}>
              Enviar
            </button>
          </div>

          {/* =========================================
              PESTAÑA 1: NUEVO REGISTRO
          ========================================= */}
          {activeTab === 'ingresar' && (
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
                Nuevo Registro
              </h2>
              
              <div className="mb-6 w-full md:w-1/2">
                <label className="block text-sm font-semibold text-slate-600 mb-1">Fecha del Reporte</label>
                <input type="date" value={fechaBase} onChange={(e) => setFechaBase(e.target.value)} max={new Date().toISOString().split('T')[0]} className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-slate-50 outline-none focus:border-[#1e293b]" />
              </div>

              {/* SECCIÓN ACTIVIDADES */}
              <div className="mb-8">
                <h4 className="text-base font-bold text-[#1e293b] mb-3">
                  Actividades Realizadas
                </h4>
                
                <div className="space-y-4">
                  {actividades.map((act) => (
                    <div key={act.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative mb-4">
                      <button onClick={() => removeActividad(act.id)} className="absolute top-2 right-2 bg-red-100 text-red-600 w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-200 transition">✕</button>
                      
                      <textarea value={act.texto} onChange={(e) => handleTextoActividad(act.id, e.target.value)} className="w-full p-2.5 text-sm border border-slate-300 rounded-lg outline-none mb-3 bg-white focus:border-[#1e293b]" rows="2" placeholder="Describe la actividad realizada..."></textarea>
                      
                      <div className="flex gap-3 mb-2">
                        <label className="flex-1 bg-[#1e293b] hover:bg-slate-700 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center cursor-pointer transition">
                          Tomar Foto
                          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFotosSubidas(act.id, e.target.files)} />
                        </label>

                        <label className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold py-2 rounded-lg flex items-center justify-center cursor-pointer transition">
                          Subir Fotos
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
                        {loadingGuardar ? 'Guardando...' : 'Guardar Actividad'}
                      </button>
                    </div>
                  ))}
                </div>

                <button onClick={addActividad} className="w-full mt-2 bg-slate-200 hover:bg-slate-300 text-slate-800 border border-dashed border-slate-400 font-bold py-2.5 rounded-lg transition flex justify-center items-center">
                  + Añadir Actividad
                </button>
              </div>

              {/* SECCIÓN PERSONAL */}
              <div className="mb-8 border-t border-slate-100 pt-6">
                <h4 className="text-base font-bold text-[#1e293b] mb-4">
                  Personal y Frentes
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

                <button onClick={addPersonal} className="w-full mt-4 bg-slate-200 hover:bg-slate-300 text-slate-800 border border-dashed border-slate-400 font-bold py-2.5 rounded-lg transition flex justify-center items-center">
                  + Añadir Personal
                </button>

                <button disabled={loadingGuardar} onClick={handleGuardarPersonal} className="w-full bg-[#1e293b] hover:bg-slate-700 text-white font-bold py-3 rounded-lg flex justify-center items-center transition disabled:opacity-50 mt-4">
                  Guardar Personal
                </button>
              </div>

              {/* SECCIÓN ANOTACIONES */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-base font-bold text-[#1e293b] mb-4">
                  Anotaciones
                </h4>
                <div className="space-y-4">
                  {anotaciones.map((anot) => (
                    <div key={anot.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative mb-4">
                      <button onClick={() => removeAnotacion(anot.id)} className="absolute top-2 right-2 bg-red-100 text-red-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">✕</button>
                      <input type="time" value={anot.hora} onChange={(e) => {
                        const val = e.target.value;
                        setAnotaciones(anotaciones.map(a => a.id === anot.id ? { ...a, hora: val } : a));
                      }} className="p-2 text-sm border border-slate-300 rounded-lg mb-2 bg-white outline-none focus:border-[#1e293b]" />
                      
                      <textarea value={anot.texto} onChange={(e) => {
                        const val = e.target.value;
                        setAnotaciones(anotaciones.map(a => a.id === anot.id ? { ...a, texto: val } : a));
                      }} className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-white outline-none focus:border-[#1e293b]" rows="2" placeholder="Descripción..."></textarea>
                    </div>
                  ))}
                </div>

                <button onClick={addAnotacion} className="w-full mt-4 bg-slate-200 hover:bg-slate-300 text-slate-800 border border-dashed border-slate-400 font-bold py-2.5 rounded-lg transition flex justify-center items-center">
                  + Añadir Anotación
                </button>

                <button disabled={loadingGuardar} onClick={handleGuardarAnotaciones} className="w-full bg-[#1e293b] hover:bg-slate-700 text-white font-bold py-3 rounded-lg flex justify-center items-center transition disabled:opacity-50 mt-4">
                  Guardar Anotaciones
                </button>
              </div>
            </div>
          )}

          {/* =========================================
              PESTAÑA 2: MODIFICAR / CONSULTAR
          ========================================= */}
          {activeTab === 'modificar' && (
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">
                 Consultar y Modificar
              </h2>
              
              <div className="flex gap-3 mb-6">
                <input type="date" value={fechaConsulta} onChange={(e) => setFechaConsulta(e.target.value)} className="p-2.5 border border-slate-300 rounded-lg bg-slate-50 outline-none text-sm focus:border-[#1e293b]" />
                <button onClick={handleBuscarReporte} disabled={buscando} className="bg-[#1e293b] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-700 transition">
                  {buscando ? 'Buscando...' : 'Buscar Reporte'}
                </button>
              </div>

              {reporteEditando ? (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Editando reporte del: {reporteEditando.fecha}</p>
                      <p className="text-[11px] text-slate-500">Registrado por: {reporteEditando.creadopor_proyect}</p>
                    </div>
                    <button onClick={handleGuardarCambiosReporte} disabled={guardandoEdicion} className="bg-[#1e293b] hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition">
                      {guardandoEdicion ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </div>

                  {/* EDICIÓN DE ACTIVIDADES */}
                  <div className="border border-slate-200 p-4 rounded-xl bg-slate-50">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-[#1e293b] text-sm">
                        Actividades ({reporteEditando.actividades.length})
                      </h3>
                      <button onClick={addEditActividad} className="text-xs font-bold text-[#1e293b] bg-slate-200 hover:bg-slate-300 px-2.5 py-1 rounded-md transition">+ Añadir</button>
                    </div>
                    <div className="space-y-3">
                      {reporteEditando.actividades.map((act, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 relative">
                          <button onClick={() => removeEditActividad(idx)} className="absolute top-2 right-2 text-red-500 font-bold text-xs hover:bg-red-50 p-1 rounded transition">✕</button>
                          <textarea value={act.texto_act || ''} onChange={(e) => handleEditActividadTexto(idx, e.target.value)} rows="2" className="w-full text-xs p-2 border border-slate-200 rounded outline-none focus:border-[#1e293b]" placeholder="Texto de la actividad..." />
                          {act.evidencias_fotograficas && act.evidencias_fotograficas.length > 0 && (
                            <div className="flex gap-2 mt-2 pt-2 border-t border-slate-100 overflow-x-auto">
                              {act.evidencias_fotograficas.map((fotoObj, fIdx) => (
                                <a key={fIdx} href={fotoObj.url_visor || fotoObj.url_pdf} target="_blank" rel="noreferrer">
                                  <img src={fotoObj.url_visor || fotoObj.url_pdf} alt="evidencia" className="w-12 h-12 object-cover rounded border border-slate-300 hover:opacity-80 transition" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* EDICIÓN DE PERSONAL */}
                  <div className="border border-slate-200 p-4 rounded-xl bg-slate-50">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-[#1e293b] text-sm">
                        Personal y Frentes ({reporteEditando.personal.length})
                      </h3>
                      <button onClick={addEditPersonal} className="text-xs font-bold text-[#1e293b] bg-slate-200 hover:bg-slate-300 px-2.5 py-1 rounded-md transition">+ Añadir</button>
                    </div>
                    <div className="space-y-2">
                      {reporteEditando.personal.map((p, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center relative">
                          <input type="text" value={p.especialidad || ''} onChange={(e) => handleEditPersonal(idx, 'especialidad', e.target.value)} placeholder="Especialidad" className="text-xs p-2 border border-slate-200 rounded focus:border-[#1e293b] outline-none" />
                          <input type="text" value={p.rubro || ''} onChange={(e) => handleEditPersonal(idx, 'rubro', e.target.value)} placeholder="Rubro" className="text-xs p-2 border border-slate-200 rounded focus:border-[#1e293b] outline-none" />
                          <input type="text" value={p.sector || ''} onChange={(e) => handleEditPersonal(idx, 'sector', e.target.value)} placeholder="Sector" className="text-xs p-2 border border-slate-200 rounded focus:border-[#1e293b] outline-none" />
                          <div className="flex items-center gap-2">
                            <input type="number" value={p.cant || 1} onChange={(e) => handleEditPersonal(idx, 'cant', parseInt(e.target.value) || 1)} className="text-xs p-2 border border-slate-200 rounded w-16 text-center font-bold" />
                            <button onClick={() => removeEditPersonal(idx)} className="text-red-500 font-bold text-xs p-1 hover:bg-red-50 rounded">✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* EDICIÓN DE ANOTACIONES */}
                  <div className="border border-slate-200 p-4 rounded-xl bg-slate-50">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-[#1e293b] text-sm">
                        Anotaciones ({reporteEditando.anotaciones.length})
                      </h3>
                      <button onClick={addEditAnotacion} className="text-xs font-bold text-[#1e293b] bg-slate-200 hover:bg-slate-300 px-2.5 py-1 rounded-md transition">+ Añadir</button>
                    </div>
                    <div className="space-y-2">
                      {reporteEditando.anotaciones.map((anot, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 relative">
                          <button onClick={() => removeEditAnotacion(idx)} className="absolute top-2 right-2 text-red-500 font-bold text-xs p-1 hover:bg-red-50 rounded">✕</button>
                          <input type="time" value={anot.hora || '08:00'} onChange={(e) => handleEditAnotacion(idx, 'hora', e.target.value)} className="text-xs p-1.5 border border-slate-200 rounded bg-slate-50 focus:border-[#1e293b] outline-none" />
                          <textarea value={anot.texto || ''} onChange={(e) => handleEditAnotacion(idx, 'texto', e.target.value)} rows="2" className="w-full text-xs p-2 border border-slate-200 rounded outline-none focus:border-[#1e293b]" placeholder="Anotación..." />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button onClick={handleGuardarCambiosReporte} disabled={guardandoEdicion} className="w-full bg-[#1e293b] hover:bg-slate-700 text-white font-bold py-3 rounded-lg shadow-md transition">
                    {guardandoEdicion ? 'Guardando Cambios en Firestore...' : 'Guardar Todos los Cambios'}
                  </button>
                </div>
              ) : (
                <p className="text-slate-400 text-sm text-center py-6">Selecciona una fecha y haz clic en buscar para cargar y editar un reporte guardado.</p>
              )}
            </div>
          )}

          {/* =========================================
              PESTAÑA 3 & 4: PDF Y ENVIAR
          ========================================= */}
          {(activeTab === 'previsualizar' || activeTab === 'enviar') && (
            <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 text-center text-slate-500">
              <p className="font-bold">Generador PDF y Envío de Correos</p>
              <p className="text-xs text-slate-400 mt-1">Se activará tras validar que la modificación de Firebase funciona perfectamente.</p>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}