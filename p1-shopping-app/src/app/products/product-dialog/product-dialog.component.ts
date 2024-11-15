import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
})
export class ProductDialogComponent {
  productForm: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
    });
  }

  addProduct() {
    if (this.productForm.valid) {
      const product = this.productForm.value;
      this.productService.addProduct(product).then(() => {
        alert('Product added successfully!');
      }).catch((error) => {
        console.error('Error adding product:', error);
      });
    }
  }

  onClose() {
    // Close the dialog
  }
}
