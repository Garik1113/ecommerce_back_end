import isEqual from 'lodash/isEqual';
import { Attribute } from '../types/product';

export const isArraysEqual = function(first: any[], second: any[]):boolean {
    const isEqaul = JSON.stringify(first) === JSON.stringify(second);
    return isEqaul;
};