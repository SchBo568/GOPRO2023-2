export class UpdateUserDto {

    constructor(
        public firstname:string, 
        public lastname: string, 
        public email: string, 
        public birthdate: string, 
        public phone_number: string
        ) {}

}