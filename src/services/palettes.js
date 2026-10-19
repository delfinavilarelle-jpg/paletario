import { signInAnonymously } from 'firebase/auth'
import {
  addDoc, collection, deleteDoc, doc, onSnapshot,
  orderBy, query, serverTimestamp, updateDoc,
} from 'firebase/firestore'
import { auth, db } from '../firebase'

const coleccion = (uid) => collection(db, 'users', uid, 'palettes')
const documento = (uid, id) => doc(db, 'users', uid, 'palettes', id)

export const iniciarSesion = () => signInAnonymously(auth)

export function escucharPaletas(uid, onData, onError) {
  const q = query(coleccion(uid), orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  )
}

export const agregarPaleta = (uid, datos) =>
  addDoc(coleccion(uid), {
    ...datos,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

export const actualizarPaleta = (uid, id, cambios) =>
  updateDoc(documento(uid, id), { ...cambios, updatedAt: serverTimestamp() })

export const eliminarPaleta = (uid, id) => deleteDoc(documento(uid, id))
