import { AfterViewInit, Component, inject, OnInit  } from '@angular/core';
import { Chart, ChartModule  } from 'angular-highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import 'highcharts/highcharts-3d';
import { ReportsService } from '../../services/reports.service';



@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [ChartModule, HighchartsChartModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements  OnInit{
    public reportService: ReportsService = inject(ReportsService);
    counts: any[] = [];
    monthAndYear:string[] = [];
    lineChart: Highcharts.Chart;
    active:Number=0;
    clothing:Number=0;
    outfit:Number=0;
    inactive:Number=0;
    

    constructor() {   
    }
    ngOnInit(): void {
        this.getReportsByMonth();     
        this.getGeneralReports();
    }

    getReportsByMonth(): Promise<any>{   
      return new Promise((reject) => {
          this.reportService.getReportsByMonth().subscribe({
              next: (response) => {
                  if (Array.isArray(response)) {   
                                          
                      response.forEach(item => {                  
                          this.monthAndYear.push (`${item.month} <br>${item.year}`)
                          this.counts.push(item.cant);
                      });    
                    
                      this.createChart(this.monthAndYear, this.counts);
                  }

              },
              error: (err) => {
                  console.error("Error", err);
                  reject(err);
              }
          });
      });
    }

    getGeneralReports(): Promise<any>{   
      return new Promise((reject) => {
          this.reportService.getGeneralReports().subscribe({
              next: (response) => {                
                if (response && typeof response === 'object') {
                  this.active = response['Active'] || 0;
                  this.clothing = response['Clothing'] || 0;
                  this.outfit = response['Outfit'] || 0;
                  this.inactive = response['Inactive'] || 0;
                }
                this.pie3D();
                this.create3DColumnChart();
                this.createPieChart();

              },
              error: (err) => {
                  console.error("Error", err);
                  reject(err);
              }
          });
      });
    }

   




    //GRÁFICO DE PUNTOS DE LOS USUARIOS CREADORS EN LOS ULTIMOS DOCE MESES
    createChart(months: string[], counts: number[]): void {  
      this.lineChart = Highcharts.chart('lineChart', { 
        chart: {
          type: 'line'
        },
        title: {
          text: 'Nuevos usuarios'
        },
        credits: {
          enabled: false
        },
        xAxis: {
          categories: months,
          title: {
            text: null
          }
        },
        yAxis: {
          title: {
            text: 'Total de usuarios'
          },
          tickInterval: 1,
        },
        series: [
          {
            name: 'Nuevos registros',
            data: counts
          }as any
        ]
      });
    }


    //GRÁFICO DE PASTEL DE LOS USUARIOS ACTIVOS, INACTIVOS, TOTAL DE PRENDAS Y OUTFITS
    createPieChart(): void {    
      this.lineChart = Highcharts.chart('pie', { 
        chart: {
          type: 'pie',
          plotShadow: false,
        },
      
        credits: {
          enabled: false,
        },
      
        plotOptions: {
          pie: {
            innerSize: '99%',
            borderWidth: 10,
            borderColor: '',
            slicedOffset: 10,
            dataLabels: {
              connectorWidth: 0,
              style:{
                fontSize:'16px',
              }
            },

          },
        },
      
        title: {
          verticalAlign: 'middle',
          floating: true,
          text: 'Reportes generales',
        },
      
        legend: {
          enabled: false,
        },
      
        series: [
          {
            type: 'pie',
            data: [
              { name: 'Usuarios Inactivos', y: this.inactive, color: '#eeeeee' },
              { name: 'Total de prendas', y: this.clothing, color: '#393e46' },
              { name: 'Total de outfits', y: this.outfit, color: '#00adb5' },
              { name: ' UsuariosActivos', y: this.active, color: '#506ef9' },
            ],
          } as any,
        ]
      });
    }

    //GRÁFICO DE PASTEL 3D DE LOS USUARIOS ACTIVOS, INACTIVOS, TOTAL DE PRENDAS Y OUTFITS
    private pie3D() {
        Highcharts.chart('pie3D', {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45, // Rotación del gráfico en el eje X
                    beta: 15, // Rotación del gráfico en el eje Y
                    depth: 50 // Profundidad del gráfico
                },
            },
            title: {
                text: 'Cantidad por usuarios, prendas y outfits'
            },
            plotOptions: {
                pie: {
                    innerSize:'50%',
                    depth: 50, // Profundidad de las columnas 
                    dataLabels: {
                        enabled: true, // Mostrar etiquetas de datos
                        style: {
                            color: '#000000', // Color blanco para las etiquetas de datos
                            fontSize: '20px',   // Tamaño de fuente
                            fontWeight: 'bold'  // Estilo de fuente
                        },
                        format: '{point.name}: {point.y}' 
                    }
                }
            },
            series:  [{
                type: 'pie',
                name: 'Prendas',
                data: [
                  ['Usuarios Inactivos', this.inactive],
                  ['Total de prendas', this.clothing],
                  ['Total de outfits', this.outfit],
                  ['Usuarios Activos', this.active]
                ],  // Datos para la dona
                colors: ['#f39c12', '#8e44ad', '#3498db', '#2ecc71']  // Colores de las secciones
              }]
        });
    }

    //GRÁFICO DE COLUMNAS 3D DE LOS USUARIOS ACTIVOS, INACTIVOS, TOTAL DE PRENDAS Y OUTFITS
    create3DColumnChart() {
        Highcharts.chart('3DColumnChart', {
          chart: {
            type: 'column',  // Tipo de gráfico: columna (cilíndrico)
            options3d: {
              enabled: true,   // Activar 3D
              alpha: 10,       // Ángulo de rotación en el eje X
              beta: 25,        // Ángulo de rotación en el eje Y
              depth: 70        // Profundidad del gráfico
            }
          },
          title: {
            text: 'Cantidad por usuarios, prendas y outfits'
          },
          xAxis: {
            categories: ['Usuarios Inactivos', 'Total de prendas', 'Total de outfits', 'Usuarios Activos'],  // Descripción de cada barra
            title: {
              text: null  // No mostrar título del eje X
            }
          },
          yAxis: {
            title: {
              text: 'Cantidad'  // Título del eje Y en español
            }
          },

          plotOptions: {
            column: {
              depth: 25,  // Profundidad de las columnas
              dataLabels: {
                enabled: true,  // Habilitar etiquetas de datos
                format: '{point.y}',  // Mostrar solo la cantidad
                style: {
                  color: '#000000',  // Color de las etiquetas
                  fontSize: '14px',   // Tamaño de la fuente
                  fontWeight: 'bold'  // Estilo de la fuente
                }
              },
              borderRadius: 20,
            }
          },
          series: [{
            name: 'Datos',
            data: [this.inactive, this.clothing, this.outfit, this.active], 
            colors: ['#f39c12', '#8e44ad', '#3498db', '#2ecc71'] 
          } as any]
        });
      }
}