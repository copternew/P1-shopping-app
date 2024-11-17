import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface Product {
    productId: string; // รหัสสินค้า (ต้องไม่ซ้ำ)
    productName: string; // ชื่อสินค้า
    productPrice: number; // ราคา
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
