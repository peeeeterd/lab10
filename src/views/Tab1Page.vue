<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Dodaj miejsce</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="main">
        <h1>Dodaj miejsce</h1>

        <ion-item>
          <label>Miejsce:</label>
          <input type="text" v-model="placeName" class="input-field" />
        </ion-item>

        <ion-item>
          <label>Opis:</label>
          <input type="text" v-model="placeDesc" class="input-field" />
        </ion-item>

        <ion-item>
          <button @click="takePhoto" class="button">
            Zrób zdjęcie
          </button>
        </ion-item>

        <div v-if="photo" class="photo-container">
          <h3>Zrobione zdjęcie:</h3>
          <img :src="photo" alt="Zrobione zdjęcie" />
        </div>

        <ion-item>
          <button @click="savePlace" class="button">
            Zapisz
          </button>
        </ion-item>
      </div>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">
import { Filesystem, Directory, Encoding  } from '@capacitor/filesystem';
import { ref } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonItem, IonLabel, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton } from '@ionic/vue';
import { Place } from '@/types/place';
import { Geolocation } from '@capacitor/geolocation';
import { LocationIRL } from '@/types/locationirl';

const placeName = ref<string | null>(null);
const placeDesc = ref<string | null>(null);
const photo = ref<string | null>(null);
const photoDate = ref<string>("");
const coordinates = ref<LocationIRL>({latitude: 0, longitude: 0});

async function takePhoto() {
  try {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl, // Pobierz zdjęcie jako URL danych
      source: CameraSource.Camera,         // Użyj kamery
      quality: 90                          // Ustaw jakość zdjęcia
    });
    photo.value = image.dataUrl || null;           // Przypisz dane zdjęcia do zmiennej
    photoDate.value = new Date().toLocaleDateString();
    getCurrentLocation();
  } catch (error) {
    console.error('Błąd przy robieniu zdjęcia:', error);
  }
}

const savePlace = () => {
  if(placeName.value == null) return;
  if(placeDesc.value == null) return;
  if(photo.value == null) return;

  const newPlace: Place = {
    name: placeName.value,
    description: placeDesc.value,
    imageBase64: photo.value,
    date: photoDate.value,
    localization: coordinates.value,
  }

  //console.log(newPlace);

  saveEntry(newPlace);
  placeName.value = "";
  placeDesc.value = "";
  photo.value = null;
}

//place.imageBase64 = place.imageBase64?.split(',')[1];
async function saveEntry(place: Place) {
  try {
    const fileName = `${place.name}.json`; // Nazwa pliku
    const data = JSON.stringify(place); // Serializacja danych

    await Filesystem.writeFile({
      path: `entries/${fileName}`, // Ścieżka w folderze 'entries'
      data: data,
      directory: Directory.Data, // Zmieniono na Directory.Data dla urządzeń mobilnych
      encoding: Encoding.UTF8,
    });

    alert(`Zapisano dane w pliku ${fileName}`);
  } catch (error) {
    console.error('Błąd podczas zapisywania danych:', error);
  }
}


async function getCurrentLocation() {
  try {
    const position = await Geolocation.getCurrentPosition();
    coordinates.value.latitude = position.coords.latitude;
    coordinates.value.longitude = position.coords.longitude;
  } catch (error) {
    console.error('Błąd podczas pobierania lokalizacji:', error);
  }
}

</script>

<style scoped>
/* Główny kontener */
#main {
  display: flex;           /* Flexbox */
  flex-direction: column;  /* Układ pionowy */
  align-items: center;     /* Wyśrodkowanie poziome */
  gap: 20px;               /* Odstępy między elementami */
  padding: 2%;           /* Wewnętrzne odstępy */
  background-color: #1e1e1e; /* Ciemne tło */
  color: #e4e4f0;         /* Jasny kolor tekstu */
  border-radius: 10px;    /* Zaokrąglone rogi */
  width: 92%;
  max-width: 600px;
  margin: 20px auto;      /* Wycentrowanie na stronie */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
}

/* Nagłówek */
h1 {
  font-size: 1.8rem;
  color: #e4e4f0;
  margin: 10px 0 10px 0;
  text-align: center;
}

/* Element IonItem */
ion-item {
  display: flex;
  flex-direction: column; /* Ustawienie elementów w kolumnie */
  align-items: baseline;
  width: 100%;
  padding: 15px;
  background-color: #1e1e1e;
  border-radius: 10px;
  gap: 10px;
}

ion-item label {
  font-size: 1rem;
  color: #e4e4f0;
  margin-bottom: 5px;
}

/* Pole tekstowe */
.input-field {
  width: 100%;
  padding: 10px;
  margin-left: 2%;
  font-size: 1rem;
  border: 1px solid #1e1e1e;
  border-radius: 5px;
  background-color: #1e1e1e;
  color: #e4e4f0;
}

.input-field:focus {
  outline: none;
  border-color: #7481ff;
}

/* Kontener na zdjęcie */
.photo-container {
  text-align: center;
  margin-top: 20px;
}

.photo-container h3 {
  font-size: 1rem;
  color: #e4e4f0;
  margin-bottom: 10px;
  margin-top: -30px;
}

.photo-container img {
  max-width: 300px;
  max-height: 300px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid #3a3a4a;
}

/* Styl przycisku */
button.button {
  display: block;
  width: 100%;
  padding: 10px 20px;
  font-size: 1rem;
  color: #ffffff; /* Kolor tekstu */
  background-color: #7481ff; /* Kolor przycisku */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-align: center;
}

button.button:hover {
  background-color: #5a6adc;
}

button.button:active {
  background-color: #4048b2;
}
</style>
