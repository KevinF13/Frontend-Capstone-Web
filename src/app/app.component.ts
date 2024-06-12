import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontend-capstone';
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Reemplazar la entrada del historial para la ruta actual
    history.replaceState(null, '', window.location.href);
  }
}
