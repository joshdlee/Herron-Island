/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateDayScheduleInput = {
  id?: string | null,
  type: string,
  day: string,
  mainlandDepartures: Array< string | null >,
  islandDepartures: Array< string | null >,
};

export type ModelDayScheduleConditionInput = {
  type?: ModelStringInput | null,
  day?: ModelStringInput | null,
  mainlandDepartures?: ModelStringInput | null,
  islandDepartures?: ModelStringInput | null,
  and?: Array< ModelDayScheduleConditionInput | null > | null,
  or?: Array< ModelDayScheduleConditionInput | null > | null,
  not?: ModelDayScheduleConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type DaySchedule = {
  __typename: "DaySchedule",
  id: string,
  type: string,
  day: string,
  mainlandDepartures: Array< string | null >,
  islandDepartures: Array< string | null >,
  createdAt: string,
  updatedAt: string,
};

export type UpdateDayScheduleInput = {
  id: string,
  type?: string | null,
  day?: string | null,
  mainlandDepartures?: Array< string | null > | null,
  islandDepartures?: Array< string | null > | null,
};

export type DeleteDayScheduleInput = {
  id: string,
};

export type CreateLowTideInput = {
  id?: string | null,
  date: string,
  cancelMainland?: Array< string | null > | null,
  cancelIsland?: Array< string | null > | null,
  rescheduleMainland?: Array< string | null > | null,
  rescheduleIsland?: Array< string | null > | null,
};

export type ModelLowTideConditionInput = {
  date?: ModelStringInput | null,
  cancelMainland?: ModelStringInput | null,
  cancelIsland?: ModelStringInput | null,
  rescheduleMainland?: ModelStringInput | null,
  rescheduleIsland?: ModelStringInput | null,
  and?: Array< ModelLowTideConditionInput | null > | null,
  or?: Array< ModelLowTideConditionInput | null > | null,
  not?: ModelLowTideConditionInput | null,
};

export type LowTide = {
  __typename: "LowTide",
  id: string,
  date: string,
  cancelMainland?: Array< string | null > | null,
  cancelIsland?: Array< string | null > | null,
  rescheduleMainland?: Array< string | null > | null,
  rescheduleIsland?: Array< string | null > | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateLowTideInput = {
  id: string,
  date?: string | null,
  cancelMainland?: Array< string | null > | null,
  cancelIsland?: Array< string | null > | null,
  rescheduleMainland?: Array< string | null > | null,
  rescheduleIsland?: Array< string | null > | null,
};

export type DeleteLowTideInput = {
  id: string,
};

export type ModelDayScheduleFilterInput = {
  id?: ModelIDInput | null,
  type?: ModelStringInput | null,
  day?: ModelStringInput | null,
  mainlandDepartures?: ModelStringInput | null,
  islandDepartures?: ModelStringInput | null,
  and?: Array< ModelDayScheduleFilterInput | null > | null,
  or?: Array< ModelDayScheduleFilterInput | null > | null,
  not?: ModelDayScheduleFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelDayScheduleConnection = {
  __typename: "ModelDayScheduleConnection",
  items:  Array<DaySchedule | null >,
  nextToken?: string | null,
};

export type ModelLowTideFilterInput = {
  id?: ModelIDInput | null,
  date?: ModelStringInput | null,
  cancelMainland?: ModelStringInput | null,
  cancelIsland?: ModelStringInput | null,
  rescheduleMainland?: ModelStringInput | null,
  rescheduleIsland?: ModelStringInput | null,
  and?: Array< ModelLowTideFilterInput | null > | null,
  or?: Array< ModelLowTideFilterInput | null > | null,
  not?: ModelLowTideFilterInput | null,
};

export type ModelLowTideConnection = {
  __typename: "ModelLowTideConnection",
  items:  Array<LowTide | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionDayScheduleFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  type?: ModelSubscriptionStringInput | null,
  day?: ModelSubscriptionStringInput | null,
  mainlandDepartures?: ModelSubscriptionStringInput | null,
  islandDepartures?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionDayScheduleFilterInput | null > | null,
  or?: Array< ModelSubscriptionDayScheduleFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionLowTideFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  date?: ModelSubscriptionStringInput | null,
  cancelMainland?: ModelSubscriptionStringInput | null,
  cancelIsland?: ModelSubscriptionStringInput | null,
  rescheduleMainland?: ModelSubscriptionStringInput | null,
  rescheduleIsland?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionLowTideFilterInput | null > | null,
  or?: Array< ModelSubscriptionLowTideFilterInput | null > | null,
};

export type CreateDayScheduleMutationVariables = {
  input: CreateDayScheduleInput,
  condition?: ModelDayScheduleConditionInput | null,
};

export type CreateDayScheduleMutation = {
  createDaySchedule?:  {
    __typename: "DaySchedule",
    id: string,
    type: string,
    day: string,
    mainlandDepartures: Array< string | null >,
    islandDepartures: Array< string | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateDayScheduleMutationVariables = {
  input: UpdateDayScheduleInput,
  condition?: ModelDayScheduleConditionInput | null,
};

export type UpdateDayScheduleMutation = {
  updateDaySchedule?:  {
    __typename: "DaySchedule",
    id: string,
    type: string,
    day: string,
    mainlandDepartures: Array< string | null >,
    islandDepartures: Array< string | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteDayScheduleMutationVariables = {
  input: DeleteDayScheduleInput,
  condition?: ModelDayScheduleConditionInput | null,
};

export type DeleteDayScheduleMutation = {
  deleteDaySchedule?:  {
    __typename: "DaySchedule",
    id: string,
    type: string,
    day: string,
    mainlandDepartures: Array< string | null >,
    islandDepartures: Array< string | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateLowTideMutationVariables = {
  input: CreateLowTideInput,
  condition?: ModelLowTideConditionInput | null,
};

export type CreateLowTideMutation = {
  createLowTide?:  {
    __typename: "LowTide",
    id: string,
    date: string,
    cancelMainland?: Array< string | null > | null,
    cancelIsland?: Array< string | null > | null,
    rescheduleMainland?: Array< string | null > | null,
    rescheduleIsland?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateLowTideMutationVariables = {
  input: UpdateLowTideInput,
  condition?: ModelLowTideConditionInput | null,
};

export type UpdateLowTideMutation = {
  updateLowTide?:  {
    __typename: "LowTide",
    id: string,
    date: string,
    cancelMainland?: Array< string | null > | null,
    cancelIsland?: Array< string | null > | null,
    rescheduleMainland?: Array< string | null > | null,
    rescheduleIsland?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteLowTideMutationVariables = {
  input: DeleteLowTideInput,
  condition?: ModelLowTideConditionInput | null,
};

export type DeleteLowTideMutation = {
  deleteLowTide?:  {
    __typename: "LowTide",
    id: string,
    date: string,
    cancelMainland?: Array< string | null > | null,
    cancelIsland?: Array< string | null > | null,
    rescheduleMainland?: Array< string | null > | null,
    rescheduleIsland?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetDayScheduleQueryVariables = {
  id: string,
};

export type GetDayScheduleQuery = {
  getDaySchedule?:  {
    __typename: "DaySchedule",
    id: string,
    type: string,
    day: string,
    mainlandDepartures: Array< string | null >,
    islandDepartures: Array< string | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListDaySchedulesQueryVariables = {
  filter?: ModelDayScheduleFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDaySchedulesQuery = {
  listDaySchedules?:  {
    __typename: "ModelDayScheduleConnection",
    items:  Array< {
      __typename: "DaySchedule",
      id: string,
      type: string,
      day: string,
      mainlandDepartures: Array< string | null >,
      islandDepartures: Array< string | null >,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetLowTideQueryVariables = {
  id: string,
};

export type GetLowTideQuery = {
  getLowTide?:  {
    __typename: "LowTide",
    id: string,
    date: string,
    cancelMainland?: Array< string | null > | null,
    cancelIsland?: Array< string | null > | null,
    rescheduleMainland?: Array< string | null > | null,
    rescheduleIsland?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListLowTidesQueryVariables = {
  filter?: ModelLowTideFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListLowTidesQuery = {
  listLowTides?:  {
    __typename: "ModelLowTideConnection",
    items:  Array< {
      __typename: "LowTide",
      id: string,
      date: string,
      cancelMainland?: Array< string | null > | null,
      cancelIsland?: Array< string | null > | null,
      rescheduleMainland?: Array< string | null > | null,
      rescheduleIsland?: Array< string | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateDayScheduleSubscriptionVariables = {
  filter?: ModelSubscriptionDayScheduleFilterInput | null,
};

export type OnCreateDayScheduleSubscription = {
  onCreateDaySchedule?:  {
    __typename: "DaySchedule",
    id: string,
    type: string,
    day: string,
    mainlandDepartures: Array< string | null >,
    islandDepartures: Array< string | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateDayScheduleSubscriptionVariables = {
  filter?: ModelSubscriptionDayScheduleFilterInput | null,
};

export type OnUpdateDayScheduleSubscription = {
  onUpdateDaySchedule?:  {
    __typename: "DaySchedule",
    id: string,
    type: string,
    day: string,
    mainlandDepartures: Array< string | null >,
    islandDepartures: Array< string | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteDayScheduleSubscriptionVariables = {
  filter?: ModelSubscriptionDayScheduleFilterInput | null,
};

export type OnDeleteDayScheduleSubscription = {
  onDeleteDaySchedule?:  {
    __typename: "DaySchedule",
    id: string,
    type: string,
    day: string,
    mainlandDepartures: Array< string | null >,
    islandDepartures: Array< string | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateLowTideSubscriptionVariables = {
  filter?: ModelSubscriptionLowTideFilterInput | null,
};

export type OnCreateLowTideSubscription = {
  onCreateLowTide?:  {
    __typename: "LowTide",
    id: string,
    date: string,
    cancelMainland?: Array< string | null > | null,
    cancelIsland?: Array< string | null > | null,
    rescheduleMainland?: Array< string | null > | null,
    rescheduleIsland?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateLowTideSubscriptionVariables = {
  filter?: ModelSubscriptionLowTideFilterInput | null,
};

export type OnUpdateLowTideSubscription = {
  onUpdateLowTide?:  {
    __typename: "LowTide",
    id: string,
    date: string,
    cancelMainland?: Array< string | null > | null,
    cancelIsland?: Array< string | null > | null,
    rescheduleMainland?: Array< string | null > | null,
    rescheduleIsland?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteLowTideSubscriptionVariables = {
  filter?: ModelSubscriptionLowTideFilterInput | null,
};

export type OnDeleteLowTideSubscription = {
  onDeleteLowTide?:  {
    __typename: "LowTide",
    id: string,
    date: string,
    cancelMainland?: Array< string | null > | null,
    cancelIsland?: Array< string | null > | null,
    rescheduleMainland?: Array< string | null > | null,
    rescheduleIsland?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

// custom queries
export const customListDaySchedules = /* GraphQL */ `
  query CustomListDaySchedules($filter: ModelDayScheduleFilterInput, $limit: Int, $nextToken: String) {
    listDaySchedules(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        day
        mainlandDepartures
        islandDepartures
      }
      nextToken
    }
  }
`;

export const customListLowTides = /* GraphQL */ `
  query CustomListLowTides($filter: ModelLowTideFilterInput, $limit: Int, $nextToken: String) {
    listLowTides(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        date
        cancelMainland
        cancelIsland
        rescheduleMainland
        rescheduleIsland
      }
      nextToken
    }
  }
`;