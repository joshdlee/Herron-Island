/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createDaySchedule = /* GraphQL */ `
  mutation CreateDaySchedule(
    $input: CreateDayScheduleInput!
    $condition: ModelDayScheduleConditionInput
  ) {
    createDaySchedule(input: $input, condition: $condition) {
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
export const updateDaySchedule = /* GraphQL */ `
  mutation UpdateDaySchedule(
    $input: UpdateDayScheduleInput!
    $condition: ModelDayScheduleConditionInput
  ) {
    updateDaySchedule(input: $input, condition: $condition) {
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
export const deleteDaySchedule = /* GraphQL */ `
  mutation DeleteDaySchedule(
    $input: DeleteDayScheduleInput!
    $condition: ModelDayScheduleConditionInput
  ) {
    deleteDaySchedule(input: $input, condition: $condition) {
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
export const createLowTide = /* GraphQL */ `
  mutation CreateLowTide(
    $input: CreateLowTideInput!
    $condition: ModelLowTideConditionInput
  ) {
    createLowTide(input: $input, condition: $condition) {
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
export const updateLowTide = /* GraphQL */ `
  mutation UpdateLowTide(
    $input: UpdateLowTideInput!
    $condition: ModelLowTideConditionInput
  ) {
    updateLowTide(input: $input, condition: $condition) {
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
export const deleteLowTide = /* GraphQL */ `
  mutation DeleteLowTide(
    $input: DeleteLowTideInput!
    $condition: ModelLowTideConditionInput
  ) {
    deleteLowTide(input: $input, condition: $condition) {
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
