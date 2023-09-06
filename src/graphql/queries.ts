/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getDaySchedule = /* GraphQL */ `
  query GetDaySchedule($id: ID!) {
    getDaySchedule(id: $id) {
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
export const listDaySchedules = /* GraphQL */ `
  query ListDaySchedules(
    $filter: ModelDayScheduleFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDaySchedules(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        day
        mainlandDepartures
        islandDepartures
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getLowTide = /* GraphQL */ `
  query GetLowTide($id: ID!) {
    getLowTide(id: $id) {
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
export const listLowTides = /* GraphQL */ `
  query ListLowTides(
    $filter: ModelLowTideFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLowTides(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        date
        cancelMainland
        cancelIsland
        rescheduleMainland
        rescheduleIsland
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
