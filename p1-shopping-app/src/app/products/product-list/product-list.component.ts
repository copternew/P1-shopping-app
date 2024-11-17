import { Component } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import Swal from 'sweetalert2';

declare var bootstrap: any; // Declare bootstrap for modal usage

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'], // Fix incorrect property name `styleUrl` to `styleUrls`
})
export class ProductListComponent {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  addProductForm: FormGroup;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private fb: FormBuilder,
    private firestore: AngularFirestore
  ) {
    // Fetch products on component initialization
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.filteredProducts = products.sort((a, b) => a.productId.localeCompare(b.productId));
    });

    // Initialize the add product form
    // เพิ่ม productId ใน form
    this.addProductForm = this.fb.group({
      productId: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9_-]{5,}$/)]], // เพิ่มกฎการ validate
      productName: ['', [Validators.required, Validators.minLength(3)]],
      productPrice: ['', [Validators.required, Validators.min(1)]],
    });
  }

  // Filter products based on search term
  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(
      (product) =>
        product.productId.toLowerCase().includes(term) ||
        product.productName.toLowerCase().includes(term)
    );
  }

  // Open Bootstrap modal for adding a new product
  openAddProductDialog() {
    const modalElement = document.getElementById('addProductModal');
    if (modalElement) {
      // Use Bootstrap Modal API
      import('bootstrap').then((bootstrap) => {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }).catch((error) => {
        console.error('Bootstrap Modal loading error:', error);
      });
    } else {
      console.error('Modal element not found!');
    }
  }

  // Add a new product and close the modal
  onAddProduct() {
    if (this.addProductForm.valid) {
      const { productId, productName, productPrice } = this.addProductForm.value;

      // ตรวจสอบว่า productId ซ้ำหรือไม่
      this.firestore
        .collection('products', (ref) => ref.where('productId', '==', productId))
        .get()
        .subscribe((snapshot) => {
          if (snapshot.empty) {
            // ถ้า productId ไม่ซ้ำ ให้เพิ่มสินค้า
            this.firestore.collection('products').add({
              productId,
              productName,
              productPrice,
              createdAt: new Date(),
            });

            console.log('New Product Added:', { productId, productName, productPrice });
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'เพื่มสินค้าสําเร็จ',
            })

            // รีเซ็ตฟอร์มและปิด Modal
            this.addProductForm.reset();
            const modalElement = document.getElementById('addProductModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
          } else {
            console.error('Product ID already exists!');
            alert('Product ID already exists. Please use a different ID.');
          }
        });
    } else {
      console.error('Form is invalid!');
    }
  }

  onDeleteProduct(product: any): void {
    if (confirm(`คุณต้องการลบสินค้า ${product.productName} หรือไม่?`)) {
      this.firestore
        .collection('products', ref => ref.where('productId', '==', product.productId))
        .get()
        .toPromise()
        .then(querySnapshot => {
          // ตรวจสอบว่า querySnapshot ไม่ใช่ undefined และไม่ว่างเปล่า
          if (querySnapshot && !querySnapshot.empty) {
            const docId = querySnapshot.docs[0].id; // ดึง docId ของเอกสาร
            return this.firestore.collection('products').doc(docId).delete();
          } else {
            throw new Error('ไม่พบสินค้าที่ต้องการลบ');
          }
        })
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'ลบสินค้าสําเร็จ',
          })
          // อัปเดต filteredProducts หลังจากลบ
          this.filteredProducts = this.filteredProducts.filter(p => p.productId !== product.productId);
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'ไม่สามารถลบสินค้าได้: ' + error.message,
          })
          console.error('เกิดข้อผิดพลาดในการลบสินค้า:', error);
          alert('ไม่สามารถลบสินค้าได้: ' + error.message);
        });
    }
  }

  // Logout functionality
  logout() {
    this.authService.logout().then(() => {
      console.log('Logged out successfully');
    }).catch((error) => {
      console.error('Error during logout:', error);
    });
  }
}
