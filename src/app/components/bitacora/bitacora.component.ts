import { Component } from '@angular/core';
import { Bitacora } from './Model/bitacora';
import { BitacoraService } from './Service/bitacora.service';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.css']
})
export class BitacoraComponent {
  bitacoras!: Bitacora[];

  constructor(private bitacoraService: BitacoraService) { }

  ngOnInit(): void {
    this.getAllPersonas();
  }

  getAllPersonas(): void {
    this.bitacoraService.getAllBitacoras({}).subscribe(bitacoras => {
      this.bitacoras = bitacoras;
    });
  }

  getBitacoraId(id: string): void {
    this.bitacoraService.getBitacoraById(id).subscribe(bitacora => {
      // Aquí puedes manejar la respuesta del endpoint de getBitacora
    });
  }
}
