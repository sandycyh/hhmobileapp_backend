import { hashPassword, verifyPassword } from '/password/passwordHashing';

describe('Pasword hashing', () => {
    const plainPassword = 'thisismyPW123'; 

    test('hashPassword returns a hash', async () => {
        const hash = await hashPassword(plainPassword);

        expect(hash).toBeDefined();
        expect(hash).not.toBe(plainPassword);
        expect(typeof hash).toBe('string');
        console.log(hash);
    }); 

    test('verifyPassword returns true for correct password', async () => {
        const hash = await hashPassword(plainPassword); 
        const isValid = await verifyPassword(plainPassword, hash);

        expect(isValid).toBe(true);
    });

    test('verifyPassword returns false for incorrect password', async () => {
        const hash = await hashPassword(plainPassword);
        const isValid = await verifyPassword('wrongPassword', hash); 

        expect(isValid).toBe(false);
    })
});