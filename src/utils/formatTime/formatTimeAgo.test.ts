import {formatTimeAgo} from "./formatTimeAgo.ts";

describe('formatTimeAgo', () => {
    it('Несколько секунд назад', () => {
        const now = new Date(); //текущая дата и время
        const dateString = new Date(now.getTime() - 30 * 1000).toISOString(); // 30 секунд назад.
        expect(formatTimeAgo(dateString)).toBe('30s ago');
    });

    it('Несколько минут назад', () => {
        const now = new Date();
        const dateString = new Date(now.getTime() - 120 * 1000).toISOString(); // 2 минуты назад
        expect(formatTimeAgo(dateString)).toBe('2m ago');
    });

    it('Несколько часов назад', () => {
        const now = new Date();
        const dateString = new Date(now.getTime() - 7200 * 1000).toISOString(); // 2 часа назад
        expect(formatTimeAgo(dateString)).toBe('2h ago');
    });

    it('1 день назад', () => {
        const now = new Date();
        const dateString = new Date(now.getTime() - 86400 * 1000).toISOString(); // 1 день назад
        expect(formatTimeAgo(dateString)).toBe('1 day ago');
    });

    it('Несколько дней назад', () => {
        const now = new Date();
        const dateString = new Date(now.getTime() - 172800 * 1000).toISOString(); // 2 дня назад
        expect(formatTimeAgo(dateString)).toBe('2 days ago');
    });
});