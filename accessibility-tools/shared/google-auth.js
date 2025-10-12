/**
 * Google Authentication Helper
 * Handles OAuth2 authentication for Google APIs
 */

class GoogleAuth {
    constructor(clientId) {
        this.clientId = clientId;
        this.authInstance = null;
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;

        return new Promise((resolve, reject) => {
            gapi.load('auth2', () => {
                gapi.auth2.init({
                    client_id: this.clientId,
                    scope: 'https://www.googleapis.com/auth/documents.readonly https://www.googleapis.com/auth/presentations.readonly https://www.googleapis.com/auth/drive.readonly'
                }).then(() => {
                    this.authInstance = gapi.auth2.getAuthInstance();
                    this.isInitialized = true;
                    resolve();
                }).catch(reject);
            });
        });
    }

    async signIn() {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            await this.authInstance.signIn();
            return this.getCurrentUser();
        } catch (error) {
            console.error('Sign-in failed:', error);
            throw error;
        }
    }

    async signOut() {
        if (!this.isInitialized) return;
        
        try {
            await this.authInstance.signOut();
        } catch (error) {
            console.error('Sign-out failed:', error);
            throw error;
        }
    }

    isSignedIn() {
        if (!this.isInitialized) return false;
        return this.authInstance.isSignedIn.get();
    }

    getCurrentUser() {
        if (!this.isInitialized || !this.isSignedIn()) return null;
        return this.authInstance.currentUser.get();
    }

    getAccessToken() {
        const user = this.getCurrentUser();
        if (!user) return null;
        return user.getAuthResponse().access_token;
    }

    async refreshToken() {
        if (!this.isInitialized) return false;
        
        try {
            const user = this.getCurrentUser();
            if (user) {
                await user.reloadAuthResponse();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }

    onSignInChanged(callback) {
        if (!this.isInitialized) return;
        this.authInstance.isSignedIn.listen(callback);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleAuth;
}