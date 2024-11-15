import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface Product {
    id?: string; // ID จะไม่ถูกบังคับในตอนเพิ่มสินค้า
    code: string; // รหัสสินค้า (ต้องไม่ซ้ำ)
    name: string; // ชื่อสินค้า
    price: number; // ราคา
  }

  
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private firestore: AngularFirestore) {}

 // ดึงรายการสินค้า
 getProducts(): Observable<Product[]> {
    return this.firestore.collection<Product>('products').valueChanges();
  }

  // เพิ่มสินค้าใหม่
  addProduct(product: Product): Promise<void> {
    const id = this.firestore.createId(); // สร้าง ID สำหรับเอกสารใหม่
    return this.firestore
      .collection('products')
      .doc(id)
      .set({ ...product, id }); // รวม ID เข้าไปในเอกสาร
  }
}
