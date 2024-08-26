export const USER_ROLE = {
  superAdmin: 'superAdmin',
  student: 'student',
  faculty: 'faculty',
  admin: 'admin',
} as const; // This object is set as const so it can not modify. Type for this object is set in the user.interface.ts file. for your easy understanding is is again given below

// export type TUserRole = keyof typeof USER_ROLE;

export const UserStatus = ['in-progress', 'blocked'];