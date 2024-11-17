import { Component } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
      this.filteredProducts = products;
      console.log('Products:', products);
      console.log('Filtered Products:', this.filteredProducts.length === 0);
      debugger
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

  // Logout functionality
  logout() {
    this.authService.logout().then(() => {
      console.log('Logged out successfully');
    }).catch((error) => {
      console.error('Error during logout:', error);
    });
  }
}
