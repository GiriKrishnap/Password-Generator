// passwordUtils.js
export const lowerCaseList = 'abcdefghijklmnopqrstuvwxyz';
export const upperCaseList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const numbersList = '0123456789';
export const symbolsList = '!@#$%^&*()';

export const preference = [
    { id: 0, value: "Too weak", minDiversity: 0, minLength: 0 },
    { id: 1, value: "Weak", minDiversity: 2, minLength: 3 },
    { id: 2, value: "Medium", minDiversity: 3, minLength: 4 },
    { id: 3, value: "Strong", minDiversity: 4, minLength: 8 }
];