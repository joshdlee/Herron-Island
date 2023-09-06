/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateDaySchedule = /* GraphQL */ `
  subscription OnCreateDaySchedule(
    $filter: ModelSubscriptionDayScheduleFilterInput
  ) {
    onCreateDaySchedule(filter: $filter) {
      id
      type
      day
      mainlandDepartures
      islandDepartures
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateDaySchedule = /* GraphQL */ `
  subscription OnUpdateDaySchedule(
    $filter: ModelSubscriptionDayScheduleFilterInput
  ) {
    onUpdateDaySchedule(filter: $filter) {
      id
      type
      day
      mainlandDepartures
      islandDepartures
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteDaySchedule = /* GraphQL */ `
  subscription OnDeleteDaySchedule(
    $filter: ModelSubscriptionDayScheduleFilterInput
  ) {
    onDeleteDaySchedule(filter: $filter) {
      id
      type
      day
      mainlandDepartures
      islandDepartures
      createdAt
      updatedAt
    }
  }
`;
export const onCreateLowTide = /* GraphQL */ `
  subscription OnCreateLowTide($filter: ModelSubscriptionLowTideFilterInput) {
    onCreateLowTide(filter: $filter) {
      id
      date
      cancelMainland
      cancelIsland
      rescheduleMainland
      rescheduleIsland
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateLowTide = /* GraphQL */ `
  subscription OnUpdateLowTide($filter: ModelSubscriptionLowTideFilterInput) {
    onUpdateLowTide(filter: $filter) {
      id
      date
      cancelMainland
      cancelIsland
      rescheduleMainland
      rescheduleIsland
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteLowTide = /* GraphQL */ `
  subscription OnDeleteLowTide($filter: ModelSubscriptionLowTideFilterInput) {
    onDeleteLowTide(filter: $filter) {
      id
      date
      cancelMainland
      cancelIsland
      rescheduleMainland
      rescheduleIsland
      createdAt
      updatedAt
    }
  }
`;
