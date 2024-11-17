import { Component } from '@angular/core';

@Component({
  selector: 'app-under-progress',
  standalone: true,
  imports: [],
  template: `
    <div class="page-under-progress">
      <img
        src="assets/images/work-in-progress.png"
        alt="Page Under Progress"
        class="construction-image"
      />
      <h1>Page Under Progress</h1>
      <p>We are working hard to bring this page to you soon. Stay tuned!</p>
    </div>
  `,
  styles: `
  .page-under-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 2em;
  text-align: center;
  color: #555;

  .construction-image {
    max-width: 170px;
    width: 100%;
    margin-bottom: 20px;
  }

  h1 {
    font-size: 2rem;
    color: #333;
  }

  p {
    font-size: 1.2rem;
    color: #666;
  }
}
  `,
})
export class UnderProgressComponent {}
