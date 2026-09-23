import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from './firebase';

/**
 * Suba la foto procesada a Firebase Storage y guarda el registro en Firestore
 */
export async function guardarRegistroFotografico({ base64Image, proyectoId = 'general', usuario = 'Usuario', gps = null }) {
  try {
    // 1. Definir la ruta del archivo en Storage
    const fileName = `sefirot_registros/${proyectoId}/${Date.now()}.jpg`;
    const storageRef = ref(storage, fileName);

    // 2. Subir la imagen Base64 procesada con la marca de agua
    await uploadString(storageRef, base64Image, 'data_url');

    // 3. Obtener la URL pública generada por Firebase
    const downloadURL = await getDownloadURL(storageRef);

    // 4. Guardar metadatos en la colección 'registros_fotograficos' de Firestore
    const docRef = await addDoc(collection(db, 'registros_fotograficos'), {
      proyectoId,
      usuario,
      imagenUrl: downloadURL,
      gps: gps ? { latitud: gps.latitude, longitud: gps.longitude } : null,
      createdAt: serverTimestamp(),
    });

    return { id: docRef.id, imagenUrl: downloadURL };
  } catch (error) {
    console.error('Error al guardar el registro en Firebase:', error);
    throw error;
  }
}