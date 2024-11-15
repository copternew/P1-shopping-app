import { Component } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})

export class ProductListComponent {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';

  constructor(private productService: ProductService) {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.filteredProducts = products;
    });
  }

  onSearch() {
    this.filteredProducts = this.products.filter(
      (product) =>
        product.code.includes(this.searchTerm) ||
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openAddProductDialog() {
    // เปิด dialog สำหรับเพิ่มสินค้า
  }
}