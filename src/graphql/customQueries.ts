// src/graphql/customQueries.ts
export const listProductsWithSizes = /* GraphQL */ `query ListProductsWithSizes(
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
        sizes {
          size
          stock
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }`;
  