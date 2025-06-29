// src/tests/ContinentSelect.test.tsx

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ContinentSelect from '../../components/ContinentSelect';

// Mock scrollIntoView for jsdom + Radix UI Select compatibility
window.HTMLElement.prototype.scrollIntoView = function () {};

vi.mock('../constants/circuitConstants', () => ({
    CONTINENTS: {
        Africa: {},
        Asia: {},
        Europe: {},
        NorthAmerica: {},
        Oceania: {},
        SouthAmerica: {},
    },
}));

vi.mock('../constants/constants', () => ({
    BUTTON_CLASSES: 'button-class',
    SELECT_CLASSES: 'select-class',
}));

function createMockMap() {
    return {} as any;
}

describe('ContinentSelect', () => {
    const setCircuit = vi.fn();
    const setContinent = vi.fn();
    const gotoContinent = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders nothing if map is null', () => {
        const { container } = render(
            <ContinentSelect
                continent={undefined}
                map={null}
                setCircuit={setCircuit}
                setContinent={setContinent}
                gotoContinent={gotoContinent}
            />,
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('renders select with continent options', async () => {
        render(
            <ContinentSelect
                continent={undefined}
                map={createMockMap()}
                setCircuit={setCircuit}
                setContinent={setContinent}
                gotoContinent={gotoContinent}
            />,
        );
        // Open the select dropdown
        const trigger = screen.getByRole('button');
        fireEvent.mouseDown(trigger);
        fireEvent.keyDown(trigger, { key: 'ArrowDown' });
        for (const continent of ['Africa', 'Asia', 'Europe', 'NorthAmerica', 'Oceania', 'SouthAmerica']) {
            expect(await screen.findByText(continent)).toBeInTheDocument();
        }
    });

    it('calls gotoContinent with correct arguments on selection', async () => {
        render(
            <ContinentSelect
                continent={undefined}
                map={createMockMap()}
                setCircuit={setCircuit}
                setContinent={setContinent}
                gotoContinent={gotoContinent}
            />,
        );
        const trigger = screen.getByRole('button');
        fireEvent.mouseDown(trigger);
        fireEvent.keyDown(trigger, { key: 'ArrowDown' });
        const continentOption = await screen.findByText('Europe');
        fireEvent.click(continentOption);
        expect(gotoContinent).toHaveBeenCalledWith(
            expect.objectContaining({
                c: 'Europe',
                map: expect.any(Object),
                setC: setCircuit,
                setCon: setContinent,
            }),
        );
    });
});
