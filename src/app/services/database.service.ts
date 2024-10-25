import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private firestore: AngularFirestore) {}

  AgregarObjeto(objeto: any, coleccion: string) {
    const colObjeto = this.firestore.collection(coleccion);

    const documento = colObjeto.doc();
    objeto.id = documento.ref.id;

    documento.set({ ...objeto });

    // si no cambia el id utilizar:
    // colUsuarios.add({ ...usuario });
  }

  traerObjetos(coleccion: string) {
    const colObjeto = this.firestore.collection(coleccion);

    const observable = colObjeto.valueChanges();
    return observable;
  }

  // ModificarUsuario(usuario: Usuario) {
  //   const colUsuarios = this.firestore.collection('usuarios');
  //   const documento = colUsuarios.doc(usuario.id);

  //   documento.update({ ...usuario });
  // }
  // EliminarUsuario(usuario: Usuario) {
  //   const colUsuarios = this.firestore.collection('usuarios');
  //   const documento = colUsuarios.doc(usuario.id);

  //   documento.delete();
  // }
}
