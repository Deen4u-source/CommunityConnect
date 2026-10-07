import { calculateDistance, Coordinates } from './geoUtils';

export interface SupabaseIssue {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
}

export class IssueLocator {
  private userLocation: Coordinates;

  constructor(userLocation: Coordinates) {
    this.userLocation = userLocation;
  }

  /**
   * Processes a single issue from Supabase and determines its proximity to the user.
   */
  public getIssueProximity(issue: SupabaseIssue) {
    const issueLocation: Coordinates = {
      latitude: issue.latitude,
      longitude: issue.longitude
    };

    const distanceKm = calculateDistance(this.userLocation, issueLocation);
    const isNearby = distanceKm <= 5.0; // Flags true if within a 5km local radius

    return {
      issueId: issue.id,
      title: issue.title,
      distanceText: `${distanceKm} km away`,
      isNearby
    };
  }
}
