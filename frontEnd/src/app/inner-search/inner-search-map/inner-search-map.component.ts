import { Component,ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {GoogleApiService } from './../../google-api.service';
import 'rxjs/add/operator/toPromise';



@Component({
  selector: 'app-inner-search-map',
  templateUrl: './inner-search-map.component.html',
  styleUrls: ['./inner-search-map.component.css']})

export class InnerSearchMapComponent implements OnInit {

  private googlePlaceId: any;
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  public bounds = new google.maps.LatLngBounds();
  public restaurants = [];
  public todo = [];
  public activity;
  public dangerousUrl;
  public trustedUrl;
  public radius;
  public promise;
  public apikey;
  public photolink;
  

  

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private sanitizer: DomSanitizer,
    private _googleapiService : GoogleApiService
  ) {}

  ngOnInit() {
    //set google maps defaults
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: [ "(cities)" ]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          
          
          // let service = google.maps.places.
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          // console.log(place.photos[0].html_attributions[0].substr(9, 25));

          console.log(place);
          
          //set latitude, longitude and zoom
          
          
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
          this.radius = 2000;
          this.googlePlaceId = place.place_id;
          this.activity = 'restaurant';
          this.apikey = 'AIzaSyDCVcnQjMNJVY5DI_nQXsRsYJMGYs0VqYA';
          
          
          // console.log(this.googlePlaceId);
          // console.log(place.address_components[1].types[0]);
          // console.log(place.photos);
          this._googleapiService.getLocationids(this.latitude,this.longitude,this.radius,this.activity)
          .subscribe((location) => {
              for(let alocation in location.results){
                  // this.restaurants.push((location.results[aplace]))
                  // console.log(location.results[aplace]);
                  this._googleapiService.getLocationdetails(location.results[alocation].place_id)
                  .subscribe((place) => {
                    this.restaurants.push(place.result);
                    // this.photolink = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+place.result.photos[0].photo_reference+'&key'+this.apikey;
                    // this.photolink = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+place.result.photos[0].photo_reference+'&key'+this.apikey;
                    // this.photolink = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+place.result.photos[0].photo_reference+'&key='+this.apikey;
                    
                    this.photolink = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+place.result.photos[0].photo_reference+'&key='+this.apikey;
                    this.restaurants[this.restaurants.length-1].photos[0].photo_reference = this.photolink;
                    console.log(this.restaurants[this.restaurants.length-1].photos[0].photo_reference)
                    console.log(this.photolink)
                    // console.log(this.restaurants[place.result].photos[0].photo_reference);
                    // this.restaurants[place.result].photos[0].photo_reference = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+this.restaurants[place.result].photos[0].photo_reference+'&key'+this.apikey;
                    
                    console.log(place.result);
                  })
                  // console.log(this.restaurants[aplace].photos[0].photo_reference);                  
                  // this.restaurants[aplace].photos[0].photo_reference = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+this.restaurants[aplace].photos[0].photo_reference+'&key'+this.apikey;
              }
              // console.log(location.results);

          // this._googleapiService.getLocationids(this.latitude,this.longitude,this.radius,this.activity)
          // .subscribe((locationid) => {
          //     for(let aplaceid in locationid.results){
                
          //       this._googleapiService.getLocationdetails(locationid.results[aplaceid].place_id)
          //       .subscribe((locationdetail) => {
          //         for(let aplacedetail in locationdetail)
          //       }
                  
          //         // console.log(this.restaurants[aplace].photos[0].photo_reference);                  
          //         // this.restaurants[aplace].photos[0].photo_reference = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+this.restaurants[aplace].photos[0].photo_reference+'&key'+this.apikey;
          //     }
            })
          
              // console.log(this.restaurants);
              
            
        
          
          // for(var i = 0; i<place.photos.length;i++){
          //   this.dangerousUrl = place.photos[i].html_attributions[0];
          //   this.trustedUrl = this.sanitizer.bypassSecurityTrustUrl(this.dangerousUrl);
          //   this.photos.push(this.trustedUrl);
          // }
          
          
          //fire display function here
          
        });
      });
    });
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 15;
        
        // console.log('New Event');
      });
    }
  }
}
