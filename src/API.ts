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

export type CreateProductInput = {
  id?: string | null,
  name: string,
  type: string,
  price: number,
  stock: number,
  description?: string | null,
  imageUrl?: string | null,
  sizes: Array< SizeInventoryInput >,
};

export type SizeInventoryInput = {
  size: string,
  stock: number,
};

export type ModelProductConditionInput = {
  name?: ModelStringInput | null,
  type?: ModelStringInput | null,
  price?: ModelFloatInput | null,
  stock?: ModelIntInput | null,
  description?: ModelStringInput | null,
  imageUrl?: ModelStringInput | null,
  and?: Array< ModelProductConditionInput | null > | null,
  or?: Array< ModelProductConditionInput | null > | null,
  not?: ModelProductConditionInput | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Product = {
  __typename: "Product",
  id: string,
  name: string,
  type: string,
  price: number,
  stock: number,
  description?: string | null,
  imageUrl?: string | null,
  sizes:  Array<SizeInventory >,
  createdAt: string,
  updatedAt: string,
};

export type SizeInventory = {
  __typename: "SizeInventory",
  size: string,
  stock: number,
};

export type UpdateProductInput = {
  id: string,
  name?: string | null,
  type?: string | null,
  price?: number | null,
  stock?: number | null,
  description?: string | null,
  imageUrl?: string | null,
  sizes?: Array< SizeInventoryInput > | null,
};

export type DeleteProductInput = {
  id: string,
};

export type CreateTransactionInput = {
  id?: string | null,
  userEmail: string,
  amount: number,
  items: Array< TransactionItemInput >,
  paymentStatus: string,
  paymentId?: string | null,
  last4: string,
  createdAt?: string | null,
};

export type TransactionItemInput = {
  productId: string,
  productName: string,
  quantity: number,
  price: number,
};

export type ModelTransactionConditionInput = {
  userEmail?: ModelStringInput | null,
  amount?: ModelFloatInput | null,
  paymentStatus?: ModelStringInput | null,
  paymentId?: ModelStringInput | null,
  last4?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelTransactionConditionInput | null > | null,
  or?: Array< ModelTransactionConditionInput | null > | null,
  not?: ModelTransactionConditionInput | null,
};

export type Transaction = {
  __typename: "Transaction",
  id: string,
  userEmail: string,
  amount: number,
  items:  Array<TransactionItem >,
  paymentStatus: string,
  paymentId?: string | null,
  last4: string,
  createdAt: string,
  updatedAt: string,
};

export type TransactionItem = {
  __typename: "TransactionItem",
  productId: string,
  productName: string,
  quantity: number,
  price: number,
};

export type UpdateTransactionInput = {
  id: string,
  userEmail?: string | null,
  amount?: number | null,
  items?: Array< TransactionItemInput > | null,
  paymentStatus?: string | null,
  paymentId?: string | null,
  last4?: string | null,
  createdAt?: string | null,
};

export type DeleteTransactionInput = {
  id: string,
};

export type CreateBannerInput = {
  id?: string | null,
  message: string,
  severity: string,
  backgroundColor?: string | null,
  textColor?: string | null,
  isActive: boolean,
  startDate: string,
  endDate: string,
  priority?: number | null,
};

export type ModelBannerConditionInput = {
  message?: ModelStringInput | null,
  severity?: ModelStringInput | null,
  backgroundColor?: ModelStringInput | null,
  textColor?: ModelStringInput | null,
  isActive?: ModelBooleanInput | null,
  startDate?: ModelStringInput | null,
  endDate?: ModelStringInput | null,
  priority?: ModelIntInput | null,
  and?: Array< ModelBannerConditionInput | null > | null,
  or?: Array< ModelBannerConditionInput | null > | null,
  not?: ModelBannerConditionInput | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Banner = {
  __typename: "Banner",
  id: string,
  message: string,
  severity: string,
  backgroundColor?: string | null,
  textColor?: string | null,
  isActive: boolean,
  startDate: string,
  endDate: string,
  priority?: number | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateBannerInput = {
  id: string,
  message?: string | null,
  severity?: string | null,
  backgroundColor?: string | null,
  textColor?: string | null,
  isActive?: boolean | null,
  startDate?: string | null,
  endDate?: string | null,
  priority?: number | null,
};

export type DeleteBannerInput = {
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

export type ModelProductFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  type?: ModelStringInput | null,
  price?: ModelFloatInput | null,
  stock?: ModelIntInput | null,
  description?: ModelStringInput | null,
  imageUrl?: ModelStringInput | null,
  and?: Array< ModelProductFilterInput | null > | null,
  or?: Array< ModelProductFilterInput | null > | null,
  not?: ModelProductFilterInput | null,
};

export type ModelProductConnection = {
  __typename: "ModelProductConnection",
  items:  Array<Product | null >,
  nextToken?: string | null,
};

export type ModelTransactionFilterInput = {
  id?: ModelIDInput | null,
  userEmail?: ModelStringInput | null,
  amount?: ModelFloatInput | null,
  paymentStatus?: ModelStringInput | null,
  paymentId?: ModelStringInput | null,
  last4?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelTransactionFilterInput | null > | null,
  or?: Array< ModelTransactionFilterInput | null > | null,
  not?: ModelTransactionFilterInput | null,
};

export type ModelTransactionConnection = {
  __typename: "ModelTransactionConnection",
  items:  Array<Transaction | null >,
  nextToken?: string | null,
};

export type ModelBannerFilterInput = {
  id?: ModelIDInput | null,
  message?: ModelStringInput | null,
  severity?: ModelStringInput | null,
  backgroundColor?: ModelStringInput | null,
  textColor?: ModelStringInput | null,
  isActive?: ModelBooleanInput | null,
  startDate?: ModelStringInput | null,
  endDate?: ModelStringInput | null,
  priority?: ModelIntInput | null,
  and?: Array< ModelBannerFilterInput | null > | null,
  or?: Array< ModelBannerFilterInput | null > | null,
  not?: ModelBannerFilterInput | null,
};

export type ModelBannerConnection = {
  __typename: "ModelBannerConnection",
  items:  Array<Banner | null >,
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

export type ModelSubscriptionProductFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  price?: ModelSubscriptionFloatInput | null,
  stock?: ModelSubscriptionIntInput | null,
  description?: ModelSubscriptionStringInput | null,
  imageUrl?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionProductFilterInput | null > | null,
  or?: Array< ModelSubscriptionProductFilterInput | null > | null,
};

export type ModelSubscriptionFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionTransactionFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userEmail?: ModelSubscriptionStringInput | null,
  amount?: ModelSubscriptionFloatInput | null,
  paymentStatus?: ModelSubscriptionStringInput | null,
  paymentId?: ModelSubscriptionStringInput | null,
  last4?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionTransactionFilterInput | null > | null,
  or?: Array< ModelSubscriptionTransactionFilterInput | null > | null,
};

export type ModelSubscriptionBannerFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  message?: ModelSubscriptionStringInput | null,
  severity?: ModelSubscriptionStringInput | null,
  backgroundColor?: ModelSubscriptionStringInput | null,
  textColor?: ModelSubscriptionStringInput | null,
  isActive?: ModelSubscriptionBooleanInput | null,
  startDate?: ModelSubscriptionStringInput | null,
  endDate?: ModelSubscriptionStringInput | null,
  priority?: ModelSubscriptionIntInput | null,
  and?: Array< ModelSubscriptionBannerFilterInput | null > | null,
  or?: Array< ModelSubscriptionBannerFilterInput | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
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

export type CreateProductMutationVariables = {
  input: CreateProductInput,
  condition?: ModelProductConditionInput | null,
};

export type CreateProductMutation = {
  createProduct?:  {
    __typename: "Product",
    id: string,
    name: string,
    type: string,
    price: number,
    stock: number,
    description?: string | null,
    imageUrl?: string | null,
    sizes:  Array< {
      __typename: "SizeInventory",
      size: string,
      stock: number,
    } >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateProductMutationVariables = {
  input: UpdateProductInput,
  condition?: ModelProductConditionInput | null,
};

export type UpdateProductMutation = {
  updateProduct?:  {
    __typename: "Product",
    id: string,
    name: string,
    type: string,
    price: number,
    stock: number,
    description?: string | null,
    imageUrl?: string | null,
    sizes:  Array< {
      __typename: "SizeInventory",
      size: string,
      stock: number,
    } >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteProductMutationVariables = {
  input: DeleteProductInput,
  condition?: ModelProductConditionInput | null,
};

export type DeleteProductMutation = {
  deleteProduct?:  {
    __typename: "Product",
    id: string,
    name: string,
    type: string,
    price: number,
    stock: number,
    description?: string | null,
    imageUrl?: string | null,
    sizes:  Array< {
      __typename: "SizeInventory",
      size: string,
      stock: number,
    } >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateTransactionMutationVariables = {
  input: CreateTransactionInput,
  condition?: ModelTransactionConditionInput | null,
};

export type CreateTransactionMutation = {
  createTransaction?:  {
    __typename: "Transaction",
    id: string,
    userEmail: string,
    amount: number,
    items:  Array< {
      __typename: "TransactionItem",
      productId: string,
      productName: string,
      quantity: number,
      price: number,
    } >,
    paymentStatus: string,
    paymentId?: string | null,
    last4: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateTransactionMutationVariables = {
  input: UpdateTransactionInput,
  condition?: ModelTransactionConditionInput | null,
};

export type UpdateTransactionMutation = {
  updateTransaction?:  {
    __typename: "Transaction",
    id: string,
    userEmail: string,
    amount: number,
    items:  Array< {
      __typename: "TransactionItem",
      productId: string,
      productName: string,
      quantity: number,
      price: number,
    } >,
    paymentStatus: string,
    paymentId?: string | null,
    last4: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteTransactionMutationVariables = {
  input: DeleteTransactionInput,
  condition?: ModelTransactionConditionInput | null,
};

export type DeleteTransactionMutation = {
  deleteTransaction?:  {
    __typename: "Transaction",
    id: string,
    userEmail: string,
    amount: number,
    items:  Array< {
      __typename: "TransactionItem",
      productId: string,
      productName: string,
      quantity: number,
      price: number,
    } >,
    paymentStatus: string,
    paymentId?: string | null,
    last4: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateBannerMutationVariables = {
  input: CreateBannerInput,
  condition?: ModelBannerConditionInput | null,
};

export type CreateBannerMutation = {
  createBanner?:  {
    __typename: "Banner",
    id: string,
    message: string,
    severity: string,
    backgroundColor?: string | null,
    textColor?: string | null,
    isActive: boolean,
    startDate: string,
    endDate: string,
    priority?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateBannerMutationVariables = {
  input: UpdateBannerInput,
  condition?: ModelBannerConditionInput | null,
};

export type UpdateBannerMutation = {
  updateBanner?:  {
    __typename: "Banner",
    id: string,
    message: string,
    severity: string,
    backgroundColor?: string | null,
    textColor?: string | null,
    isActive: boolean,
    startDate: string,
    endDate: string,
    priority?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteBannerMutationVariables = {
  input: DeleteBannerInput,
  condition?: ModelBannerConditionInput | null,
};

export type DeleteBannerMutation = {
  deleteBanner?:  {
    __typename: "Banner",
    id: string,
    message: string,
    severity: string,
    backgroundColor?: string | null,
    textColor?: string | null,
    isActive: boolean,
    startDate: string,
    endDate: string,
    priority?: number | null,
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

export type GetProductQueryVariables = {
  id: string,
};

export type GetProductQuery = {
  getProduct?:  {
    __typename: "Product",
    id: string,
    name: string,
    type: string,
    price: number,
    stock: number,
    description?: string | null,
    imageUrl?: string | null,
    sizes:  Array< {
      __typename: "SizeInventory",
      size: string,
      stock: number,
    } >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListProductsQueryVariables = {
  filter?: ModelProductFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProductsQuery = {
  listProducts?:  {
    __typename: "ModelProductConnection",
    items:  Array< {
      __typename: "Product",
      id: string,
      name: string,
      type: string,
      price: number,
      stock: number,
      description?: string | null,
      imageUrl?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetTransactionQueryVariables = {
  id: string,
};

export type GetTransactionQuery = {
  getTransaction?:  {
    __typename: "Transaction",
    id: string,
    userEmail: string,
    amount: number,
    items:  Array< {
      __typename: "TransactionItem",
      productId: string,
      productName: string,
      quantity: number,
      price: number,
    } >,
    paymentStatus: string,
    paymentId?: string | null,
    last4: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListTransactionsQueryVariables = {
  filter?: ModelTransactionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTransactionsQuery = {
  listTransactions?:  {
    __typename: "ModelTransactionConnection",
    items:  Array< {
      __typename: "Transaction",
      id: string,
      userEmail: string,
      amount: number,
      paymentStatus: string,
      paymentId?: string | null,
      last4: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetBannerQueryVariables = {
  id: string,
};

export type GetBannerQuery = {
  getBanner?:  {
    __typename: "Banner",
    id: string,
    message: string,
    severity: string,
    backgroundColor?: string | null,
    textColor?: string | null,
    isActive: boolean,
    startDate: string,
    endDate: string,
    priority?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListBannersQueryVariables = {
  filter?: ModelBannerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListBannersQuery = {
  listBanners?:  {
    __typename: "ModelBannerConnection",
    items:  Array< {
      __typename: "Banner",
      id: string,
      message: string,
      severity: string,
      backgroundColor?: string | null,
      textColor?: string | null,
      isActive: boolean,
      startDate: string,
      endDate: string,
      priority?: number | null,
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

export type OnCreateProductSubscriptionVariables = {
  filter?: ModelSubscriptionProductFilterInput | null,
};

export type OnCreateProductSubscription = {
  onCreateProduct?:  {
    __typename: "Product",
    id: string,
    name: string,
    type: string,
    price: number,
    stock: number,
    description?: string | null,
    imageUrl?: string | null,
    sizes:  Array< {
      __typename: "SizeInventory",
      size: string,
      stock: number,
    } >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateProductSubscriptionVariables = {
  filter?: ModelSubscriptionProductFilterInput | null,
};

export type OnUpdateProductSubscription = {
  onUpdateProduct?:  {
    __typename: "Product",
    id: string,
    name: string,
    type: string,
    price: number,
    stock: number,
    description?: string | null,
    imageUrl?: string | null,
    sizes:  Array< {
      __typename: "SizeInventory",
      size: string,
      stock: number,
    } >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteProductSubscriptionVariables = {
  filter?: ModelSubscriptionProductFilterInput | null,
};

export type OnDeleteProductSubscription = {
  onDeleteProduct?:  {
    __typename: "Product",
    id: string,
    name: string,
    type: string,
    price: number,
    stock: number,
    description?: string | null,
    imageUrl?: string | null,
    sizes:  Array< {
      __typename: "SizeInventory",
      size: string,
      stock: number,
    } >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateTransactionSubscriptionVariables = {
  filter?: ModelSubscriptionTransactionFilterInput | null,
};

export type OnCreateTransactionSubscription = {
  onCreateTransaction?:  {
    __typename: "Transaction",
    id: string,
    userEmail: string,
    amount: number,
    items:  Array< {
      __typename: "TransactionItem",
      productId: string,
      productName: string,
      quantity: number,
      price: number,
    } >,
    paymentStatus: string,
    paymentId?: string | null,
    last4: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateTransactionSubscriptionVariables = {
  filter?: ModelSubscriptionTransactionFilterInput | null,
};

export type OnUpdateTransactionSubscription = {
  onUpdateTransaction?:  {
    __typename: "Transaction",
    id: string,
    userEmail: string,
    amount: number,
    items:  Array< {
      __typename: "TransactionItem",
      productId: string,
      productName: string,
      quantity: number,
      price: number,
    } >,
    paymentStatus: string,
    paymentId?: string | null,
    last4: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteTransactionSubscriptionVariables = {
  filter?: ModelSubscriptionTransactionFilterInput | null,
};

export type OnDeleteTransactionSubscription = {
  onDeleteTransaction?:  {
    __typename: "Transaction",
    id: string,
    userEmail: string,
    amount: number,
    items:  Array< {
      __typename: "TransactionItem",
      productId: string,
      productName: string,
      quantity: number,
      price: number,
    } >,
    paymentStatus: string,
    paymentId?: string | null,
    last4: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateBannerSubscriptionVariables = {
  filter?: ModelSubscriptionBannerFilterInput | null,
};

export type OnCreateBannerSubscription = {
  onCreateBanner?:  {
    __typename: "Banner",
    id: string,
    message: string,
    severity: string,
    backgroundColor?: string | null,
    textColor?: string | null,
    isActive: boolean,
    startDate: string,
    endDate: string,
    priority?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateBannerSubscriptionVariables = {
  filter?: ModelSubscriptionBannerFilterInput | null,
};

export type OnUpdateBannerSubscription = {
  onUpdateBanner?:  {
    __typename: "Banner",
    id: string,
    message: string,
    severity: string,
    backgroundColor?: string | null,
    textColor?: string | null,
    isActive: boolean,
    startDate: string,
    endDate: string,
    priority?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteBannerSubscriptionVariables = {
  filter?: ModelSubscriptionBannerFilterInput | null,
};

export type OnDeleteBannerSubscription = {
  onDeleteBanner?:  {
    __typename: "Banner",
    id: string,
    message: string,
    severity: string,
    backgroundColor?: string | null,
    textColor?: string | null,
    isActive: boolean,
    startDate: string,
    endDate: string,
    priority?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

// Custom queries for the app
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
