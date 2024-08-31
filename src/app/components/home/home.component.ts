import { AfterViewInit, Component } from '@angular/core';
import { ProductsComponent } from '../products/products.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductsComponent,RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']   

})
export class HomeComponent implements AfterViewInit {
  private texts: string[] = [
    ' Welcome To ZapZy',
    'Shop Laptops',
    'Shop Mobiles',
    'Shop Electronics'
  ];
  private currentIndex = 0;
  private typingDelay = 100; // Faster typing speed
  private deletingDelay = 50; // Faster deleting speed
  private newTextDelay = 1500; // Shorter delay before starting new text
  private textElement!: HTMLElement;

  ngAfterViewInit() {
    this.textElement = document.querySelector('.typing-text')!;
    this.startTyping();
  }

  private startTyping() {
    const currentText = this.texts[this.currentIndex];
    let index = 0;
    this.textElement.innerHTML = '';

    const type = () => {
      if (index < currentText.length) {
        this.textElement.innerHTML += currentText.charAt(index);
        index++;
        setTimeout(type, this.typingDelay);
      } else {
        setTimeout(() => this.startDeleting(), this.newTextDelay);
      }
    };

    type();
  }

  private startDeleting() {
    const currentText = this.texts[this.currentIndex];
    let index = currentText.length - 1;

    const deleteText = () => {
      if (index >= 0) {
        this.textElement.innerHTML = currentText.substring(0, index);
        index--;
        setTimeout(deleteText, this.deletingDelay);
      } else {
        this.currentIndex = (this.currentIndex + 1) % this.texts.length;
        setTimeout(() => this.startTyping(), this.typingDelay);
      }
    };

    deleteText();
  }
}