/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateDaySchedule = /* GraphQL */ `subscription OnCreateDaySchedule(
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
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateDayScheduleSubscriptionVariables,
  APITypes.OnCreateDayScheduleSubscription
>;
export const onUpdateDaySchedule = /* GraphQL */ `subscription OnUpdateDaySchedule(
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
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateDayScheduleSubscriptionVariables,
  APITypes.OnUpdateDayScheduleSubscription
>;
export const onDeleteDaySchedule = /* GraphQL */ `subscription OnDeleteDaySchedule(
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
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteDayScheduleSubscriptionVariables,
  APITypes.OnDeleteDayScheduleSubscription
>;
export const onCreateLowTide = /* GraphQL */ `subscription OnCreateLowTide($filter: ModelSubscriptionLowTideFilterInput) {
  onCreateLowTide(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateLowTideSubscriptionVariables,
  APITypes.OnCreateLowTideSubscription
>;
export const onUpdateLowTide = /* GraphQL */ `subscription OnUpdateLowTide($filter: ModelSubscriptionLowTideFilterInput) {
  onUpdateLowTide(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateLowTideSubscriptionVariables,
  APITypes.OnUpdateLowTideSubscription
>;
export const onDeleteLowTide = /* GraphQL */ `subscription OnDeleteLowTide($filter: ModelSubscriptionLowTideFilterInput) {
  onDeleteLowTide(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteLowTideSubscriptionVariables,
  APITypes.OnDeleteLowTideSubscription
>;
