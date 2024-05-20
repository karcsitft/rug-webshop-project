import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  collectionName = 'Users';

  constructor(private afs: AngularFirestore) { }

  // CRUD (Create, Read, Update, Delete)

  // Create
  createUser(user: User) {
    return this.afs.collection<User>(this.collectionName).doc(user.id).set(user);
  }

  // Read
  getUsers() {
    return this.afs.collection('Users').valueChanges();
  }

  updateUser(user: User) {
    return this.afs.collection<User>(this.collectionName).doc(user.id).update(user);
  }

  deleteUser(user: User) {
    return this.afs.collection<User>(this.collectionName).doc(user.id).delete();
  }
  
}
