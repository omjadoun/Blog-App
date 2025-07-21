import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // Automatically log in after account creation
                return await this.login({email, password});
            }
            return userAccount;
        } catch (error) {
            console.error("AuthService :: createAccount :: error", error);
            throw error;
        }
    }

    async login({email, password}) {
        try {
            const session = await this.account.createEmailPasswordSession(email, password);
            // Store session token if needed
            localStorage.setItem('sessionVerified', 'true');
            return session;
        } catch (error) {
            console.error("AuthService :: login :: error", error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            // First verify the current session
            await this.account.getSession('current');
            return await this.account.get();
        } catch (error) {
            console.log("AuthService :: getCurrentUser :: error", error);
            // Clear any invalid session data
            localStorage.removeItem('sessionVerified');
            return null;
        }
    }

    async logout() {
        try {
            // Delete all active sessions
            await this.account.deleteSessions();
            // Clear local session indicators
            localStorage.removeItem('sessionVerified');
            return true;
        } catch (error) {
            console.error("AuthService :: logout :: error", error);
            return false;
        }
    }

    // Additional method to check session status
    async checkSession() {
        try {
            const session = await this.account.getSession('current');
            return !!session;
        } catch (error) {
            return false;
        }
    }
}

const authService = new AuthService();

export default authService;