export class User {
    private username: string;
    private firstname: string;
    private lastname: string;
    private email: string;
    private password: string;
    private lastlogin: string;
    private role: Number;

    constructor(username: string, firstname: string, lastname: string, email: string, password: string, lastlogin: string, role: Number) {
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.lastlogin = lastlogin;
        this.role = role;
    }

}
