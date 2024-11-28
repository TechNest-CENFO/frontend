export class CustomValidators{
    //La contraseña no es nula, o en blanco 
    static passwordIsNull(value:string |null|undefined):boolean{
        let isValid = true;
        if (value === null || value === undefined || value === "") {
            isValid = false;
        }

        return isValid
    }

    //Valida que contenga el patrón adecuado
    static passwordPatternValid(value:string):boolean{
        let isValid = true;
        const passwordPattern = /^(?=.*[a-zñ])(?=.*[A-ZÑ])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&ñÑ]{8,16}$/

        if (!passwordPattern.test(value)) {
            isValid = false;
        }

        return isValid
    }

    //Valida si contiene al menos una minuscula
    static containsLowercase(value:string):boolean{
        let isValid = true;
        
        if (!/[a-zñ]/.test(value)) {
            isValid = false;
        }

        return isValid
    }

    //Valida si contiene al menos una mayuscula
    static containsUppercase(value:string):boolean{
        let isValid = true;
        
        if (!/[A-ZÑ]/.test(value)) {
            isValid = false;
        }

        return isValid
    }
    
    //Valida si contiene al menos un numero
    static containsNumbers(value:string):boolean{
        let isValid = true;
        
        if (!/(?=.*\d)/.test(value)) {
            isValid = false;
        }

        return isValid
    }

    //Valida si contiene al menos un caracter especial
    static containsSpecialCharacter(value:string):boolean{
        let isValid = true;
        
        if (!/(?=.*[@$!%*?&])/.test(value)) {
            isValid = false;
        }

        return isValid
    }

    //Valida si contiene al ocho caracteres
    static minimunRequired(value:string):boolean{
        let isValid = true;
        
        if (value.length < 8) {
            isValid = false;
        }

        return isValid
    }

    //Valida si contiene al diececiseis caracteres
    static maximunRequired(value:string):boolean{
        let isValid = true;
        
        if (value.length > 16) {
            isValid = false;
        }

        return isValid
    }

        //Valida si contiene al diececiseis caracteres
    static isPasswordEqualsConfirm(pass:string, confirm:string):boolean{
        let isValid = true;
        
        if (pass !== confirm) {
            isValid = false;
        }

        return isValid
    }

    //Dar formato a la fecha
    static formatDate( date:Date): string {
        date.toISOString();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son base 0
        const day = String(date.getDate()).padStart(2, '0');
      
        return `${year}/${month}/${day}`; // Concatenar las partes en el formato dd/mm/yyyy
      
    }

    //Dar formato a la fecha
    static validateDate(selectedDay:string, today:string): boolean {
        let isValid = true;
    // Convertir ambas fechas a objetos Date
    const selectedDate = new Date(selectedDay);
    const currentDate = new Date(today);

    // Para asegurarnos de comparar solo las fechas (sin horas), establecemos la hora a medianoche en ambas fechas
    selectedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    // Comparar las fechas
    if (selectedDate >= currentDate) {
        isValid = false;
    }
        
        return isValid; // Concatenar las partes en el formato dd/mm/yyyy
        
    }
}