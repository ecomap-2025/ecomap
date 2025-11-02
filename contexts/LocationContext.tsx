import * as Location from 'expo-location';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface LocationContextData {
  location: Location.LocationObject | null;
  permissionStatus: Location.PermissionStatus | null;
  loading: boolean;
  requestPermission: () => Promise<void>;
}

const LocationContext = createContext<LocationContextData>({} as LocationContextData);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const requestPermission = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } else {
        console.log('Permissão de localização negada.');
      }
    } catch (error) {
      console.error("Erro ao solicitar permissão de localização", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestPermission();
  }, []); // Executa uma vez quando o app abre

  return (
    <LocationContext.Provider value={{ location, permissionStatus, loading, requestPermission }}>
      {children}
    </LocationContext.Provider>
  );
};

// 4. Cria um Hook customizado para facilitar o uso do contexto em outras telas
export const useLocation = () => {
  return useContext(LocationContext);
};