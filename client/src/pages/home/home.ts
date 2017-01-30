import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GoogleMaps } from '../../providers/google-maps';
 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 
    @ViewChild('map') mapElement;
    map: any;
 
    constructor(public navCtrl: NavController, public maps: GoogleMaps) {
 
    }
 
    ionViewDidLoad(){
        this.maps.initMap(this.mapElement.nativeElement);
    }
 
}