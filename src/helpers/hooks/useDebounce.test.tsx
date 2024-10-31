import {useDebounce} from './useDebounce';
import React, {useState} from 'react';
import {render, fireEvent, act} from "@testing-library/react";

describe('useDebounce', () => {
    const setup = () => {
        jest.useFakeTimers(); // Используем fake timers для управления временем

        const TestComponent = () => {
            const [value, setValue] = useState('initial');
            const debouncedValue = useDebounce(value, 500);

            return (
                <div>
                    <input type="text" value={value} onChange={(e) => setValue(e.target.value)}/>
                    <span data-testid="debounced-value">{debouncedValue}</span>
                </div>
            );
        };

        const {container} = render(<TestComponent/>);
        const input = container.querySelector('input') as HTMLInputElement;
        const debouncedValueSpan = container.querySelector('[data-testid="debounced-value"]') as HTMLSpanElement;

        return {input, debouncedValueSpan};
    };
    it('Обновить значение с задержкой', async () => {
        const {input, debouncedValueSpan} = setup();

        expect(debouncedValueSpan.textContent).toBe('initial');

        act(() => {
            fireEvent.change(input, {target: {value: 'updated'}}); // Изменяем значение input
        })

        expect(debouncedValueSpan.textContent).toBe('initial'); // Значение еще не изменилось

        act(() => {
            jest.advanceTimersByTime(500); // Перематываем время на 500 мс
        })

        expect(debouncedValueSpan.textContent).toBe('updated'); // Значение обновилось

        jest.useRealTimers(); // Возвращаем реальные timers
    });

    it('Отменить предыдущую задержку, если значение изменится до задержки', async () => {
        const {input, debouncedValueSpan} = setup();

        expect(debouncedValueSpan.textContent).toBe('initial');

        act(() => {
            fireEvent.change(input, {target: {value: 'first update'}});// Изменяем значение input
        })

        act(() => {
            fireEvent.change(input, {target: {value: 'second update'}});// Изменяем значение input второй раз, пока задержка не истекла
        })
        act(() => {
            jest.advanceTimersByTime(500); // Перематываем время на 500 мс
        })

        expect(debouncedValueSpan.textContent).toBe('second update'); // Значение обновилось на второй вариант обновления

        jest.useRealTimers();
    });
});

