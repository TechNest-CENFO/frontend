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
  is_favorite: boolean;
  is_public: boolean;
  image_url: string;
  name: string;
<<<<<<< HEAD
  season?: string;
  color?: string;
  clothingType?: IClothingType;

  

=======
  type:string;
  subType:string;
  material:string;
  season:string;
  color:string;
  /* GET */
  isFavorite?: boolean;
  clothingType?:IClothingType;
  imageUrl?:string;
>>>>>>> 990c122b7b6d60f2179ff4cfc4845332750fb7c2
}

export interface IClothingType {
  id?: number;
  name?: string;
  subType?: string;
  type?: string;
  clothing_type_id:number;
}