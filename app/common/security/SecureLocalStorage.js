import SecureLS from 'secure-ls';

const secureLocalStorage = new SecureLS({
    encodingType: 'aes',
    encryptionSecret: process.env.WWW_STORAGE_KEY,
    isCompression: true,
});

export const clearAllExceptDefault = () => {
    secureLocalStorage
        .getAllKeys()
        .filter(key => !['shift', 'extendedStaffDetails'].includes(key))
        .forEach(key => secureLocalStorage.remove(key));
};

export default secureLocalStorage;
