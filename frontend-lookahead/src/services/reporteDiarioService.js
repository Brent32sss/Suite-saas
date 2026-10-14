// src/services/reporteDiarioService.js
import { db, storage } from './firebase';
import { doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * 1. GUARDAR ACTIVIDAD Y FOTOS (Nuevo Registro)
 */
export async function guardarActividadService({ projectId, fecha, texto, fotosNuevas, usuarioFirma }) {
  const docId = `${fecha}_${projectId}`;
  const reporteRef = doc(db, 'reportes_diarios', docId);
  const idActividad = `ACT_${Date.now()}`;

  const fotosSubidas = [];

  if (fotosNuevas && fotosNuevas.length > 0) {
    for (let i = 0; i < fotosNuevas.length; i++) {
      const file = fotosNuevas[i];
      const storagePath = `reportes_diarios/${projectId}/${fecha}/${idActividad}_${Date.now()}_${i}.jpg`;
      const storageRef = ref(storage, storagePath);
      
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      
      fotosSubidas.push({
        url_visor: downloadUrl,
        url_pdf: downloadUrl
      });
    }
  }

  await setDoc(reporteRef, {
    id_proyect: projectId,
    fecha_proyect: fecha,
    creadopor_proyect: usuarioFirma,
    actividades: arrayUnion({
      id_act: idActividad,
      texto_act: texto,
      evidencias_fotograficas: fotosSubidas
    })
  }, { merge: true });

  return idActividad;
}

/**
 * 2. GUARDAR PERSONAL (Nuevo Registro)
 */
export async function guardarPersonalService({ projectId, fecha, listaPersonal, usuarioFirma }) {
  const docId = `${fecha}_${projectId}`;
  const reporteRef = doc(db, 'reportes_diarios', docId);

  await setDoc(reporteRef, {
    id_proyect: projectId,
    fecha_proyect: fecha,
    creadopor_proyect: usuarioFirma,
    personal: arrayUnion(...listaPersonal)
  }, { merge: true });
}

/**
 * 3. GUARDAR ANOTACIONES (Nuevo Registro)
 */
export async function guardarAnotacionesService({ projectId, fecha, listaAnotaciones, usuarioFirma }) {
  const docId = `${fecha}_${projectId}`;
  const reporteRef = doc(db, 'reportes_diarios', docId);

  await setDoc(reporteRef, {
    id_proyect: projectId,
    fecha_proyect: fecha,
    creadopor_proyect: usuarioFirma,
    anotaciones: arrayUnion(...listaAnotaciones)
  }, { merge: true });
}

/**
 * 4. CONSULTAR REPORTE POR FECHA
 */
export async function consultarReportePorFecha(projectId, fecha) {
  const docId = `${fecha}_${projectId}`;
  const docRef = doc(db, 'reportes_diarios', docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
}

/**
 * 5. ACTUALIZAR REPORTE COMPLETO (Pestaña Modificar)
 * Sobrescribe las listas editadas manteniendo integridad del documento
 */
export async function actualizarReporteCompletoService({ projectId, fecha, actividades, personal, anotaciones, usuarioFirma }) {
  const docId = `${fecha}_${projectId}`;
  const reporteRef = doc(db, 'reportes_diarios', docId);

  await setDoc(reporteRef, {
    id_proyect: projectId,
    fecha_proyect: fecha,
    modificado_por: usuarioFirma,
    ultima_modificacion: new Date().toISOString(),
    actividades: actividades || [],
    personal: personal || [],
    anotaciones: anotaciones || []
  }, { merge: true });

  return true;
}