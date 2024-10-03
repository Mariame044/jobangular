// user.model.ts
export interface User {
    id: number;
    fullName: string;
    email: string;
    role: string;
}

// register-user.dto.ts
export interface LoginUserDto {
    
    email: string;
    password: string;
   
}
