import { DndContext, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';

import { Scrollbar } from '@radix-ui/react-scroll-area';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';

import { ScrollArea } from 'components/ui/scroll-area';
import { YEAR } from 'constants/constants';
import { useGetDriversByYearQuery } from 'features/driversApi';
import { setDriversByYear } from 'slices/driversSlice';
import { setError } from 'slices/siteWideSlice';
import { Label } from 'components/ui/label';
import SortableItem from 'components/dnd-kit/SortableItem';
import { useForm } from 'react-hook-form';
import { Form } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import { cn } from '@/lib/utils';
import LoadingToast from 'components/LoadingToast';
import Switch from 'components/Switch';

import { type Driver } from 'types/drivers';
import { type VoteValueProps } from 'types/vote';
import DriverCheckbox from '@/components/Driver/DriverCheckbox';

// const DriverCheckbox = lazy(() => import('components/Driver/DriverCheckbox'));

/**
 * The `Vote` component is responsible for rendering the voting interface for a race event.
 * It fetches and displays the list of drivers and the next race details, and allows users to vote
 * on the order of drivers and specific race events.
 *
 * @returns {JSX.Element} The rendered voting interface.
 *
 * @component
 *
 * @example
 * // Usage example:
 * <Vote />
 *
 * @remarks
 * This component uses several hooks to manage state and side effects:
 * - `useAppSelector` to select state from the Redux store.
 * - `useAppDispatch` to dispatch actions to the Redux store.
 * - `useForm` to manage form state.
 * - `useGetDriversByYearQuery` and `useGetRaceNextQuery` to fetch data from the API.
 *
 * The component also handles drag-and-drop functionality for reordering drivers using the `DndContext` and `SortableContext` components.
 *
 * @hook
 * - `useEffect` to handle side effects when `raceNextData` and `driversByYearData` change.
 *
 * @param {Object} event - The drag end event.
 * @param {Object} event.active - The active draggable item.
 * @param {Object} event.over - The droppable area where the item was dropped.
 *
 * @function handleDragEnd
 * Handles the drag end event to update the order of drivers.
 *
 * @function onSubmit
 * Handles the form submission event.
 *
 * @returns {JSX.Element} The rendered voting interface.
 */
const Vote = (): JSX.Element => {
    const driversByYear = useAppSelector((state: RootState) => state.drivers.driversByYear);
    const raceNext = useAppSelector((state: RootState) => state.races.raceNext);
    const dispatch = useAppDispatch();
    const form = useForm();

    const [, setOriginalOrderDrivers] = useState<Driver[]>([]);

    const [voteOrderedDrivers, setVoteOrderedDrivers] = useState<Driver[]>(driversByYear ?? []);
    const [driversInCrashDisabled, setDriversInCrashDisabled] = useState(true);

    const { data: driversByYearData, isLoading, isError } = useGetDriversByYearQuery(YEAR);

    useEffect(() => {
        if (!driversByYearData) return;

        const driversArray = driversByYearData as Driver[];
        dispatch(setDriversByYear(driversArray));
        setOriginalOrderDrivers(driversArray);
        setVoteOrderedDrivers(driversArray.slice());
    }, [dispatch, driversByYearData]);

    const [voteValues, setVoteValues] = useState<VoteValueProps>({
        blueTires: false,
        driversInCrash: {},
        fastestLap: '',
        finishOrder: voteOrderedDrivers,
        firstLapCrash: false,
        greenTires: false,
        rain: false,
        reds: 0,
        yellows: 0,
    });

    const [toggleRain, setToggleRain] = useState(false);
    const [toggleCrash, setToggleCrash] = useState(false);
    const updateVoteValues = (value = {}) => {
        const newValues = { ...voteValues, ...value };
        setVoteValues(newValues);
    };

    const handleDragEnd = (event: { active: { id: UniqueIdentifier }; over: { id: UniqueIdentifier } | null }) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setVoteOrderedDrivers((drivers) => {
                const oldIndex = drivers.findIndex((driver) => driver.id === active.id);
                const newIndex = over ? drivers.findIndex((driver) => driver.id === over.id) : -1;
                // update the voteValues with the new order
                updateVoteValues({ finishOrder: arrayMove(drivers, oldIndex, newIndex) });

                const updatedDrivers = arrayMove(drivers, oldIndex, newIndex);
                return updatedDrivers;
            });
        }
    };

    if (isLoading) return <LoadingToast isLoading={isLoading} />;

    if (isError) {
        dispatch(setError(true));
        return <></>;
    }

    const onSubmit = () => {
        console.log('submitting vote...', voteValues);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div id="voteContainer" className="w-full lg:h-[80vh] pb-20">
                    {/* TITLE */}
                    <div className="col-span-3 dark:text-stone-300 flex items-center justify-center p-4 racingFont text-2xl">
                        Voting for: {raceNext?.date} - {raceNext?.short_name}
                    </div>

                    {/* MIDDLE */}
                    <div className="row-span-3 col-start-2 row-start-2 border border-red-700 rounded-lg p-4 flex flex-col overflow-hidden">
                        <div className="racingFont text-2xl mb-2">Finish Order:</div>
                        <ScrollArea className="h-full w-full">
                            <Scrollbar />
                            <DndContext onDragEnd={handleDragEnd}>
                                <SortableContext items={voteOrderedDrivers} strategy={rectSortingStrategy}>
                                    {voteOrderedDrivers?.map((driver, index) => (
                                        <SortableItem
                                            key={`${driver.id}-${index}`}
                                            id={driver.id}
                                            label={driver.name}
                                            value={driver.id}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </ScrollArea>
                    </div>

                    {/* UPPER LEFT */}
                    <div className="border border-red-700 p-4 rounded-lg rounded-tl-none rounded-bl-none row-span-3 col-start-1 row-start-2">
                        <div className="racingFont text-2xl">Race Specific:</div>

                        <div className="flex flex-col">
                            <div className="h-fit overflow-hidden rounded-lg p-4 flex flex-col gap-3">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        className="border-gray-500"
                                        id="firstLapCrash"
                                        onClick={() => {
                                            setToggleCrash(!toggleCrash);
                                            setDriversInCrashDisabled(!driversInCrashDisabled);
                                        }}
                                    />
                                    <Label htmlFor="firstLapCrash" className="text-lg">
                                        Crash on First Lap
                                    </Label>
                                </div>
                                <div
                                    className={cn(
                                        toggleCrash ? 'block' : 'hidden',
                                        'border',
                                        'border-gray-400 p-4 rounded-lg',
                                    )}
                                >
                                    <Label
                                        htmlFor="driversInCrash"
                                        className="w-full p-1 pl-0 pb-0 border-b-gray-300 border-b text-lg"
                                    >
                                        Drivers in crash
                                    </Label>
                                    <ScrollArea className="w-full h-[10vh] m-3 p-0 scroll-pb-20">
                                        <Scrollbar />
                                        {driversByYear?.map((driver, index) => {
                                            if (!driver.name || driver.name.trim() === '') return null;
                                            return (
                                                <div className="p-0 pb-2" key={`${driver.id}-${index}`}>
                                                    <DriverCheckbox
                                                        disabled={driversInCrashDisabled}
                                                        driver={driver}
                                                        index={index}
                                                        key={`${driver.id}-${index}`}
                                                        updateVoteValues={updateVoteValues}
                                                        voteValues={voteValues}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </ScrollArea>
                                </div>
                            </div>

                            <div className="grid w-full max-w-sm items-center gap-1.5 p-4 pt-0 pb-0">
                                <Label htmlFor="yellows" className="text-lg mt-2">
                                    Total Yellows
                                </Label>
                                <Input
                                    className="border-gray-400"
                                    id="yellows"
                                    min={0}
                                    onChange={(e) => updateVoteValues({ yellows: Number(e.target.value) })}
                                    placeholder="0"
                                    type="number"
                                />
                            </div>

                            <div className="grid w-full max-w-sm items-center gap-1.5 p-4 pt-0 pb-0">
                                <Label htmlFor="reds" className="text-lg mt-2">
                                    Total Reds
                                </Label>
                                <Input
                                    className="border-gray-400"
                                    id="reds"
                                    min={0}
                                    onChange={(e) => updateVoteValues({ reds: Number(e.target.value) })}
                                    placeholder="0"
                                    type="number"
                                />
                            </div>

                            <div className="h-fit overflow-hidden rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-4">
                                    <Switch
                                        className="border-gray-500"
                                        id="rain"
                                        onClick={() => {
                                            setToggleRain(!toggleRain);
                                            updateVoteValues({ rain: !voteValues.rain });
                                        }}
                                    />
                                    <Label htmlFor="rain" className="text-lg">
                                        Rain
                                    </Label>
                                </div>
                                <div
                                    className={cn(
                                        toggleRain ? 'block' : 'hidden',
                                        'border',
                                        'border-gray-400 p-4 rounded-lg',
                                    )}
                                >
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                className="border-gray-500"
                                                id="intermediates"
                                                onClick={() => updateVoteValues({ greenTires: !voteValues.greenTires })}
                                            />
                                            <Label htmlFor="intermediates" className="text-lg">
                                                Intermediates
                                            </Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                className="border-gray-500"
                                                id="fullWetBlueTires"
                                                onClick={() => updateVoteValues({ blueTires: !voteValues.blueTires })}
                                            />
                                            <Label htmlFor="fullWetBlueTires" className="text-lg">
                                                Full Wet
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* UPPER RIGHT */}
                    <div className="col-start-3 row-start-2 border border-red-700 rounded-tl-lg rounded-bl-lg p-4 flex flex-col">
                        <div className="racingFont text-2xl">Driver Specific:</div>
                    </div>
                    {/* LOWER RIGHT */}
                    <div className="border border-red-700 rounded-lg rounded-tr-none rounded-br-none flex flex-col gap-4 p-4">
                        <>
                            <Label htmlFor="name">Name:</Label>
                            <Input
                                className="border-gray-400"
                                id="name"
                                placeholder="Enter your name"
                                type="text"
                                {...form.register('name')}
                            />
                        </>

                        <Button type="submit">Submit</Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default Vote;
