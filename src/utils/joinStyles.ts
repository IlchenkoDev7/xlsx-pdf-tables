import { Style } from '@react-pdf/types';

export const joinStyles = (...styles: (Style | undefined)[]): Style | Style[] =>
    styles.filter(Boolean) as Style[];
