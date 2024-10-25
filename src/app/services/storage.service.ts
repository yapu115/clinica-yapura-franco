import { Injectable } from '@angular/core';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: Storage, protected fs: Firestore) {}

  async ObtenerImagenURL(imagen: Blob, path: string) {
    const storageRef = ref(
      this.storage,
      `${path}/${new Date().getTime()}_photo.jpg`
    );
    await uploadBytes(storageRef, imagen);

    // Guardar la URL en el documento de firestore
    return await getDownloadURL(storageRef);
  }
}
