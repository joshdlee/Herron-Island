/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getDaySchedule = /* GraphQL */ `query GetDaySchedule($id: ID!) {
  getDaySchedule(id: $id) {
    id
    type
    day
    mainlandDepartures
    islandDepartures
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetDayScheduleQueryVariables,
  APITypes.GetDayScheduleQuery
>;
export const listDaySchedules = /* GraphQL */ `query ListDaySchedules(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDaySchedulesQueryVariables,
  APITypes.ListDaySchedulesQuery
>;
export const getLowTide = /* GraphQL */ `query GetLowTide($id: ID!) {
  getLowTide(id: $id) {
    id
    date
    cancelMainland
    cancelIsland
    rescheduleMainland
    rescheduleIsland
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetLowTideQueryVariables,
  APITypes.GetLowTideQuery
>;
export const listLowTides = /* GraphQL */ `query ListLowTides(
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLowTidesQueryVariables,
  APITypes.ListLowTidesQuery
>;
