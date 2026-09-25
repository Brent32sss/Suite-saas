import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from './firebase';

export async function guardarRegistroFotografico(param1, param2) {
  try {
    let imagenFinal = null;
    let metadatos = {};

    // 1. Detección inteligente de la imagen
    // Si enviaste la imagen directo como primer parámetro:
    if (typeof param1 === 'string' && param1.startsWith('data:image')) {
      imagenFinal = param1;
      metadatos = param2 || {};
    } 
    // Si enviaste un objeto { processedBase64, proyectoId, etc. }:
    else if (typeof param1 === 'object' && param1 !== null) {
      // Buscamos dinámicamente cualquier propiedad que sea la imagen Base64
      for (const key in param1) {
        if (typeof param1[key] === 'string' && param1[key].startsWith('data:image')) {
          imagenFinal = param1[key];
          break;
        }
      }
      metadatos = param1; // Usamos el mismo objeto para sacar el resto de datos
    }

    if (!imagenFinal) {
      throw new Error("No se pudo extraer la imagen Base64 de los datos enviados.");
    }

    // 2. Extraer el resto de la información
    const proyectoId = metadatos.proyectoId || 'general';
    const usuario = metadatos.usuario || metadatos.usuarioId || 'Usuario Obra';
    const gps = metadatos.gps || metadatos.ubicacion || null;
    const comentario = metadatos.comentario || '';

    // 3. Definir la ruta en Storage
    const fileName = `sefirot_registros/${proyectoId}/${Date.now()}.jpg`;
    const storageRef = ref(storage, fileName);

    // 4. Subir la imagen
    await uploadString(storageRef, imagenFinal, 'data_url');

    // 5. Obtener URL pública
    const downloadURL = await getDownloadURL(storageRef);

    // 6. Guardar en Firestore
    const docRef = await addDoc(collection(db, 'registros_fotograficos'), {
      proyectoId,
      usuario,
      imagenUrl: downloadURL,
      comentario,
      gps,
      createdAt: serverTimestamp(),
    });

    return { id: docRef.id, imagenUrl: downloadURL };
    
  } catch (error) {
    console.error('Error al guardar el registro en Firebase:', error);
    throw error;
  }
}