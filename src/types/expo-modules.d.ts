declare module 'expo-location' {
  export const Accuracy: {
    Balanced: number;
  };

  export function requestForegroundPermissionsAsync(): Promise<{
    granted: boolean;
    status: string;
  }>;

  export function getCurrentPositionAsync(options?: {
    accuracy?: number;
  }): Promise<{
    coords: {
      latitude: number;
      longitude: number;
    };
  }>;
}

declare module 'expo-image-picker' {
  export function requestMediaLibraryPermissionsAsync(): Promise<{
    granted: boolean;
    status: string;
  }>;

  export function launchImageLibraryAsync(options?: {
    mediaTypes?: string[];
    allowsEditing?: boolean;
    aspect?: [number, number];
    quality?: number;
  }): Promise<{
    canceled: boolean;
    assets?: Array<{
      uri: string;
    }>;
  }>;
}