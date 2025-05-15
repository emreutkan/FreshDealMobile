import {THEME} from '@/src/styles/Theme';

describe('Theme Constants', () => {
    it('should have correct color values', () => {
        expect(THEME.colors.primary).toBe('rgba(76,175,80,0.75)');
        expect(THEME.colors.error).toBe('#FF5A5F');
        expect(THEME.colors.text.primary).toBe('#1e293b');
    });

    it('should have correct spacing values', () => {
        expect(THEME.spacing.xs).toBe(4);
        expect(THEME.spacing.sm).toBe(8);
        expect(THEME.spacing.md).toBe(16);
        expect(THEME.spacing.lg).toBe(24);
        expect(THEME.spacing.xl).toBe(32);
    });

    it('should have correct radius values', () => {
        expect(THEME.radius.sm).toBe(8);
        expect(THEME.radius.md).toBe(12);
        expect(THEME.radius.lg).toBe(16);
        expect(THEME.radius.xl).toBe(24);
    });
});