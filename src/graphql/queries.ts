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
export const getProduct = /* GraphQL */ `query GetProduct($id: ID!) {
  getProduct(id: $id) {
    id
    name
    type
    price
    stock
    description
    imageUrl
    sizes {
      size
      stock
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetProductQueryVariables,
  APITypes.GetProductQuery
>;
export const listProducts = /* GraphQL */ `query ListProducts(
  $filter: ModelProductFilterInput
  $limit: Int
  $nextToken: String
) {
  listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      type
      price
      stock
      description
      imageUrl
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListProductsQueryVariables,
  APITypes.ListProductsQuery
>;
export const getTransaction = /* GraphQL */ `query GetTransaction($id: ID!) {
  getTransaction(id: $id) {
    id
    userEmail
    amount
    items {
      productId
      productName
      quantity
      price
      __typename
    }
    paymentStatus
    paymentId
    last4
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetTransactionQueryVariables,
  APITypes.GetTransactionQuery
>;
export const listTransactions = /* GraphQL */ `query ListTransactions(
  $filter: ModelTransactionFilterInput
  $limit: Int
  $nextToken: String
) {
  listTransactions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userEmail
      amount
      paymentStatus
      paymentId
      last4
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTransactionsQueryVariables,
  APITypes.ListTransactionsQuery
>;
export const getBanner = /* GraphQL */ `query GetBanner($id: ID!) {
  getBanner(id: $id) {
    id
    message
    severity
    backgroundColor
    textColor
    isActive
    startDate
    endDate
    priority
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetBannerQueryVariables, APITypes.GetBannerQuery>;
export const listBanners = /* GraphQL */ `query ListBanners(
  $filter: ModelBannerFilterInput
  $limit: Int
  $nextToken: String
) {
  listBanners(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      message
      severity
      backgroundColor
      textColor
      isActive
      startDate
      endDate
      priority
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBannersQueryVariables,
  APITypes.ListBannersQuery
>;
