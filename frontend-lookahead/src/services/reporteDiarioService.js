// src/services/reporteDiarioService.js
import { db, storage } from './firebase';
import { doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * 1. GUARDAR ACTIVIDAD Y FOTOS
 * Usamos { merge: true } para que si el reporte del día no existe, lo cree, 
 * y si ya existe, solo agregue esta nueva actividad sin borrar lo demás.
 */
export async function guardarActividadService({ projectId, fecha, texto, fotosNuevas, usuarioFirma }) {
  const docId = `${fecha}_${projectId}`;
  const reporteRef = doc(db, 'reportes_diarios', docId);
  const idActividad = `ACT_${Date.now()}`;

  const fotosSubidas = [];

  // Si el usuario adjuntó fotos, las subimos a Firebase Storage primero
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

  // Guardamos o actualizamos el documento en Firestore
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
 * 2. GUARDAR PERSONAL
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
 * 3. GUARDAR ANOTACIONES
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
 * 4. CONSULTAR REPORTE (Para la pestaña Modificar o generar PDF)
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