export interface ILoginResponse {
  accessToken: string;
  expiresIn: number
}

export interface IResponse<T> {
  data: T;
}

export interface IUser {
  id?: number;
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  dateOfBirth?: string;
  picture?: string;
  direction?:string;
  isUserActive?: boolean;
  isProfileBlocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  authorities?: IAuthority[];
  role?: IRole
}

export interface IAuthority {
  authority: string;
}

export interface IFeedBackMessage {
  type?: IFeedbackStatus;
  message?: string;
}

export enum IFeedbackStatus {
  success = "SUCCESS",
  error = "ERROR",
  default = ''
}

export enum IRoleType {
  admin = "ROLE_ADMIN",
  user = "ROLE_USER",
  superAdmin = 'ROLE_SUPER_ADMIN'
}

export interface IRole {
  createdAt: string;
  description: string;
  id: number;
  name : string;
  updatedAt: string;
}

export interface IOrder {
  id?: number;
  description?: string;
  total?: number;
}

export interface ISearch {
  page?: number;
  size?: number;
  pageNumber?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?:number;
}

export interface IProduct{
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface IToAddress{
  id?: number;
  toAddress: string;
}

export interface IPasswordResetEntity{
  id?: number;
  token: string;
  expirationDate?: Date;
  newPassword: string;
}

export interface IClothing {
  id?:number;
  name: string;
  season:string;
  color:string;
  isFavorite?: boolean;
  isPublic?: boolean;
  clothingType?:IClothingType;
  imageUrl?:string;
  //Para cambiar el estado en el modal mas facil. No viaja hacia el endpoint
  isSelectedInSubModal?: boolean;
  isClothingItemActive?: boolean
}

export interface IClothingType {
  id?: number;
  name?: string;
  subType?: string;
  type?: string;
}

export interface IOutfit{
  id?: number;
  name?: string;
  clothing:IClothing[];
  isPublic?: boolean;
  isFavorite?: boolean;
  category?:ICategory;
  user?:IUser;
  imageUrl?:string;
  isDeleted?: boolean;
}

export interface ICategory{
  id?: number;
  name: string;
}

export interface ICollection{
  id?: number;
  name?: string;
  outfit:IOutfit[];
  isPublic?: boolean;
  isFavorite?: boolean;
  user:IUser;
  imageUrl?:string;
  isDeleted?: boolean;
}
