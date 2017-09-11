export const classNames = (...classNames: string[]) => classNames.filter(className => className.length > 0).join(' ');
