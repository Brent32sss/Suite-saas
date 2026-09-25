import { auth, db } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { apps } from '../data/apps.js';
import { days, lookAheadRows } from '../data/lookahead.js';

export async function login(userIngresado, password) {
  try {
    let emailToUse = userIngresado;

    // 1. Si el usuario ingresa su código (ej. "csuarez") en vez de correo, buscamos el correo en Firestore
    if (!userIngresado.includes('@')) {
      const q = query(collection(db, 'usuarios'), where('codigo', '==', userIngresado));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Usuario no encontrado en la base de datos');
      }

      // Tomamos el email del documento encontrado
      emailToUse = querySnapshot.docs[0].data().email;
    }

    // 2. Iniciar sesión nativamente con Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, emailToUse, password);
    const firebaseUser = userCredential.user;

    // 3. Obtener los datos completos del usuario desde Firestore (rol, empresaId, nombre, etc.)
    const userQuery = query(collection(db, 'usuarios'), where('email', '==', emailToUse));
    const userSnapshot = await getDocs(userQuery);
    
    if (userSnapshot.empty) {
      throw new Error('Datos de perfil no encontrados');
    }

    const userDoc = userSnapshot.docs[0];
    const userData = {
      id: userDoc.id,
      ...userDoc.data()
    };

    // 4. Retornamos el token real de Firebase y los datos para tu AuthContext
    return {
      token: await firebaseUser.getIdToken(), 
      user: userData
    };

  } catch (error) {
    console.error('Error al iniciar sesión con Firebase Auth:', error);
    // Personalizamos un poco el mensaje para el usuario
    if (error.code === 'auth/invalid-credential') {
      throw new Error('Contraseña incorrecta');
    }
    throw new Error(error.message || 'Error al iniciar sesión');
  }
}

export async function getProjects(codigoUsuario) {
  try {
    const querySnapshot = await getDocs(collection(db, 'proyectos'));
    const proyectos = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (proyectos.length === 0) {
      return [{ id: 'proyecto_demo_01', codigo: 'OBRA-01', nombre: 'Obra Mar Abierto', empresaId: 'empresa_demo_01' }];
    }
    return proyectos;
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    return [{ id: 'proyecto_demo_01', codigo: 'OBRA-01', nombre: 'Obra Mar Abierto', empresaId: 'empresa_demo_01' }];
  }
}

export async function getProjectApps(projectId) {
  return apps;
}

export async function getLookAhead(projectId) {
  return { days, rows: lookAheadRows };
}
