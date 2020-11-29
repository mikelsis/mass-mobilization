/* --- STATE --- */
export interface ActivityMapState {
  loading: boolean;
  error: null;
  activityData: any[];
  year: number;
}

export type ContainerState = ActivityMapState;
