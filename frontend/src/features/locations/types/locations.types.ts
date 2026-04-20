export interface Location {
  locationId: string;
  userId: string;
  locationName: string;
  locationType: string;
  address: string;
  lat: string | number;
  lng: string | number;
  meterNumber: string;
  connectedSince: string;
  sanctionedLoad: number;
  tariffSlab: string;
}

export interface GetLocationsResponse {
  status: string;
  data: {
    locations: Location[];
  };
}
