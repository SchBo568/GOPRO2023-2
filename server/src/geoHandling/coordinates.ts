import axios, { AxiosResponse } from 'axios';

interface Coordinates {
    lat: number;
    lon: number;
}

export class CoordinatesHandler {
    private url1: string = "https://nominatim.openstreetmap.org/";
    private url2: string = "https://geocodeapi.p.rapidapi.com/GetDistance";
    //https://rapidapi.com/Noggle/api/reverse-geocoding-and-geolocation-service

    async getCoordinates(address: string): Promise<Coordinates> {
        const response: AxiosResponse = await axios.get(`${this.url1}search?q=${address}&format=json`);

        let coordinates: any = {
            lat: response.data[0].lat,
            lon: response.data[0].lon
        }
        return coordinates;
    }

    async getDistance(lat1: number, lon1: number, lat2: number, lon2: number): Promise<number> {
        const response: AxiosResponse = await axios.get(`${this.url2}?lat1=${lat1}&lon1=${lon1}&lat2=${lat2}&lon2=${lon2}`, {
            headers: {
                "x-rapidapi-key": "91abec8a88mshc2816008d8bc3a5p156c5cjsne359071c8316",
                "x-rapidapi-host": "geocodeapi.p.rapidapi.com"
            }
        });
        return response.data.DistanceInKm;
    }
}