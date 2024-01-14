/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createDaySchedule = /* GraphQL */ `mutation CreateDaySchedule(
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateDayScheduleMutationVariables,
  APITypes.CreateDayScheduleMutation
>;
export const updateDaySchedule = /* GraphQL */ `mutation UpdateDaySchedule(
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateDayScheduleMutationVariables,
  APITypes.UpdateDayScheduleMutation
>;
export const deleteDaySchedule = /* GraphQL */ `mutation DeleteDaySchedule(
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteDayScheduleMutationVariables,
  APITypes.DeleteDayScheduleMutation
>;
export const createLowTide = /* GraphQL */ `mutation CreateLowTide(
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateLowTideMutationVariables,
  APITypes.CreateLowTideMutation
>;
export const updateLowTide = /* GraphQL */ `mutation UpdateLowTide(
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateLowTideMutationVariables,
  APITypes.UpdateLowTideMutation
>;
export const deleteLowTide = /* GraphQL */ `mutation DeleteLowTide(
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteLowTideMutationVariables,
  APITypes.DeleteLowTideMutation
>;
