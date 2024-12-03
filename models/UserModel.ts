export class UserModel {
    private phoneNumber: string;
    private selectedCode: string;
    private email: string;
    private name: string;
    private surname: string;
    private password: string; // Added password property
    private cart: { id: string; name: string; quantity: number; price: number }[] = []; // Cart items
    private addresses: string[] = []; // User's addresses
    private currentAddress: string | null = null; // Selected current address

    private static instance: UserModel;

    private constructor(
        phoneNumber: string = '',
        selectedCode: string = '+90',
        email: string = '',
        name: string = '',
        surname: string = '',
        password: string = '' // Initialize password
    ) {
        this.phoneNumber = phoneNumber;
        this.selectedCode = selectedCode;
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.password = password;
    }

    // Singleton pattern to ensure only one instance exists
    public static getInstance(): UserModel {
        if (!UserModel.instance) {
            UserModel.instance = new UserModel();
        }
        return UserModel.instance;
    }

    // Getter and Setter for phoneNumber
    public getPhoneNumber(): string {
        return this.phoneNumber;
    }

    public setPhoneNumber(phoneNumber: string): void {
        // Remove any non-digit characters and limit to 15 digits
        this.phoneNumber = phoneNumber.replace(/[^0-9]/g, '').slice(0, 15);
    }

    // Getter and Setter for selectedCode
    public getSelectedCode(): string {
        return this.selectedCode;
    }

    public setSelectedCode(selectedCode: string): void {
        this.selectedCode = selectedCode;
    }

    // Getter and Setter for email
    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    // Getter and Setter for name
    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    // Getter and Setter for surname
    public getSurname(): string {
        return this.surname;
    }

    public setSurname(surname: string): void {
        this.surname = surname;
    }

    // Getter and Setter for password
    public getPassword(): string {
        return this.password;
    }

    public setPassword(password: string): void {
        this.password = password;
    }

    // Getter for full name
    public getFullName(): string {
        return `${this.name} ${this.surname}`.trim();
    }

    // Cart Management Methods
    public addToCart(item: { id: string; name: string; quantity: number; price: number }): void {
        const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.cart.push(item);
        }
    }

    public removeFromCart(itemId: string): void {
        this.cart = this.cart.filter(cartItem => cartItem.id !== itemId);
    }

    public clearCart(): void {
        this.cart = [];
    }

    public getCart(): { id: string; name: string; quantity: number; price: number }[] {
        return this.cart;
    }

    // Address Management Methods
    public addAddress(address: string): void {
        if (!this.addresses.includes(address)) {
            this.addresses.push(address);
        }
    }

    public removeAddress(address: string): void {
        this.addresses = this.addresses.filter(addr => addr !== address);
        // If the removed address is the current address, reset currentAddress
        if (this.currentAddress === address) {
            this.currentAddress = null;
        }
    }

    public getAddresses(): string[] {
        return this.addresses;
    }

    public setCurrentAddress(address: string): void {
        if (this.addresses.includes(address)) {
            this.currentAddress = address;
        } else {
            console.warn('Address not found in user addresses.');
        }
    }

    public getCurrentAddress(): string | null {
        return this.currentAddress;
    }

    // Validation method for phone number
    public isValidPhone(): boolean {
        // Validates that the phone number consists of 10 to 15 digits
        const phoneRegex = /^[0-9]{10,15}$/;
        return phoneRegex.test(this.phoneNumber);
    }

    // Validation method for email
    public isValidEmail(): boolean {
        // Simple email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }
}
