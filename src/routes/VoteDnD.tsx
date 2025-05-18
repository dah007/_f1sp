import { RootState, useAppDispatch, useAppSelector } from 'app/store';
import { useNavigate } from 'react-router-dom';
import { DndContext, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';

import Button from 'components/Button';
import DriverCheckbox from 'components/Driver/DriverCheckbox';
import LoadingToast from 'components/LoadingToast';
import SortableItem from 'components/dnd-kit/SortableItem';
import Toggle from 'components/Toggle';
import { Card, CardTitle } from 'components/ui/card';
import { Form } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import LoginForm from 'components/LoginForm';
import { ScrollArea } from 'components/ui/scroll-area';
import { Scrollbar } from '@radix-ui/react-scroll-area';
import { setDriversByYear } from 'slices/driversSlice';
import { setError } from 'slices/siteWideSlice';
import { useForm, FieldValues } from 'react-hook-form';

import { useGetDriversByYearQuery } from 'features/driversApi';
import { useSubmitVoteMutation } from 'features/userApi';

import { YEAR } from 'constants/constants';
import { cn } from '@/lib/utils';
import { type Driver } from 'types/drivers';
import { type VoteValueProps } from 'types/vote';

// export const FULL_ROW_HEIGHT = 'xl:h-[32vh] lg:h-[28vh] md:h-[25vh] h-[23vh] w-full';
const columnHeights = 'lg:max-h-[70vh] md:max-h-[50vh] max-h-[32vh] min-h-[32vh]'; // Fixed typo from max-[30hx] to max-h-[32vh]

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
    const dispatch = useAppDispatch();
    const form = useForm();
    const navigate = useNavigate();

    const driversByYear = useAppSelector((state: RootState) => state.drivers.driversByYear);
    const raceNext = useAppSelector((state: RootState) => state.races.raceNext);
    const user = useAppSelector((state: RootState) => state.user.user);

    const [submitStatus, setSubmitStatus] = useState({
        isSubmitting: false,
        isSuccess: false,
        isError: false,
        errorMessage: '',
    });

    const [submitVote, { isLoading: isSubmittingVote }] = useSubmitVoteMutation();

    const [, setOriginalOrderDrivers] = useState<Driver[]>([]);
    const [voteOrderedDrivers, setVoteOrderedDrivers] = useState<Driver[]>(driversByYear ?? []);
    const [driversInCrashDisabled, setDriversInCrashDisabled] = useState(true);

    const {
        data: driversByYearData,
        isLoading: driversByYearLoading,
        isError: driversByYearError,
    } = useGetDriversByYearQuery(YEAR);

    useEffect(() => {
        console.log('driversByYearData');
        console.log('error', driversByYearError);
        console.log('loading', driversByYearLoading);

        if (!driversByYearData) return;
        dispatch(setDriversByYear(driversByYearData?.value as Driver[]));

        setOriginalOrderDrivers(driversByYearData.value);
        setVoteOrderedDrivers(driversByYearData.value.slice());
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

        const de = () => {
            const oldIndex = voteOrderedDrivers.findIndex((driver) => driver.id === active.id);
            const newIndex = over ? voteOrderedDrivers.findIndex((driver) => driver.id === over.id) : -1;
            updateVoteValues({ finishOrder: arrayMove(voteOrderedDrivers, oldIndex, newIndex) });

            const updatedDrivers = arrayMove(voteOrderedDrivers, oldIndex, newIndex);
            return updatedDrivers;
        };

        if (active.id !== over?.id) {
            console.log('handleDragEnd', de());
            setVoteOrderedDrivers((drivers) => {
                const oldIndex = drivers.findIndex((driver) => driver.id === active.id);
                const newIndex = over ? drivers.findIndex((driver) => driver.id === over.id) : -1;
                updateVoteValues({ finishOrder: arrayMove(drivers, oldIndex, newIndex) });

                const updatedDrivers = arrayMove(drivers, oldIndex, newIndex);
                return updatedDrivers;
            });
        }
    };

    const onSubmit = async (formData: FieldValues) => {
        console.log('onSubmit');
        console.log('formData', formData);
        // try {
        setSubmitStatus({
            isSubmitting: true,
            isSuccess: false,
            isError: false,
            errorMessage: '',
        });

        const baseVoteValues = {
            blueTires: voteValues.blueTires ?? false,
            driversInCrash: voteValues.driversInCrash ?? {},
            fastestLap: '',
            finishOrder: voteValues.finishOrder ?? [],
            firstLapCrash: voteValues.firstLapCrash ?? false,
            greenTires: voteValues.greenTires ?? false,
            rain: voteValues.rain ?? false,
            reds: voteValues.reds ?? 0,
            yellows: voteValues.yellows ?? 0,
        };

        if (!raceNext?.id) {
            throw new Error('Race information is missing');
        }
        const completeVoteData = {
            ...baseVoteValues,
            finishOrder: voteOrderedDrivers.map((driver) => ({
                position: driver.id,
                name: driver.name,
                id: driver.id,
            })),
            ...formData,
        };

        const response = await submitVote({
            userId: user?.id || formData.userId,
            raceId: raceNext?.id,
            voteData: completeVoteData,
            email: user?.email || formData.email,
            // passcode: user?.passcode || formData.passcode,
        }).unwrap();

        console.log('Vote submitted successfully:', response);

        setSubmitStatus({
            isSubmitting: false,
            isSuccess: true,
            isError: false,
            errorMessage: '',
        });

        setTimeout(() => {
            navigate('/vote/success');
        }, 2000);
        // } catch (error) {
        //     console.error('Error submitting vote:', error);

        //     setSubmitStatus({
        //         isSubmitting: false,
        //         isSuccess: false,
        //         isError: true,
        //         errorMessage: 'Error submitting vote. Please try again.',
        //     });
        // }
    };

    if (driversByYearLoading) return <LoadingToast isLoading={driversByYearLoading} />;

    if (driversByYearError) {
        dispatch(setError(true));
        return <div>Error loading drivers</div>;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* TITLE */}
                <div
                    className="
                    w-full dark:text-zinc-300 text-zinc-800 text-center p-4 text-2xl krona-one-regular"
                >
                    Voting for: {raceNext?.date} - {raceNext?.short_name}
                </div>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4 krona-one-regular">
                    Voting closes 1 hours before lights out & opens on Tuesday after a race.
                </p>

                <div className="grid grid-cols-2 grid-rows-2 gap-4 align-middle">
                    {/* LEFT COLUMN */}
                    <div className="row-span-2 h-[70vh]">
                        <Card
                            className={cn(
                                columnHeights,
                                'overflow-hidden',
                                'dark:bg-zinc-800 bg-zinc-300 w-full h-full',
                            )}
                        >
                            <CardTitle className="pl-4 pt-0 m-0">Finish Order</CardTitle>

                            <ScrollArea className={cn(columnHeights)}>
                                <Scrollbar />
                                <DndContext onDragEnd={handleDragEnd}>
                                    <SortableContext items={voteOrderedDrivers} strategy={rectSortingStrategy}>
                                        {voteOrderedDrivers?.map((driver, index) => (
                                            <SortableItem
                                                id={driver.id}
                                                index={index + 1}
                                                key={`${driver.id}-${index}`}
                                                label={driver.name}
                                                value={driver.id}
                                            />
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            </ScrollArea>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="h-[32vh]">
                        <Card className={cn('overflow-hidden', 'dark:bg-zinc-800 bg-zinc-300 w-full h-full')}>
                            <CardTitle className="pl-4 pt-0 m-0">Race Specific</CardTitle>
                            <div className="flex gap-4 flex-col-[1fr,*]">
                                {/* FIRST LAP CRASH */}
                                <div className="overflow-hidden rounded-lg p-4 flex flex-col gap-3">
                                    <div className="flex items-center space-x-2">
                                        <Toggle
                                            className="border-zinc-500"
                                            id="firstLapCrash"
                                            onClick={() => {
                                                setToggleCrash(!toggleCrash);
                                                setDriversInCrashDisabled(!driversInCrashDisabled);
                                            }}
                                        />
                                        <Label htmlFor="firstLapCrash">Crash on First Lap</Label>
                                    </div>

                                    <div className={cn('border', 'border-zinc-400 p-4 rounded-lg')}>
                                        <Label
                                            htmlFor="driversInCrash"
                                            className="w-full p-1 pl-0 pb-0 border-b-zinc-300 border-b text-lg"
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

                                <div className="flex flex-col gap-4">
                                    <Label htmlFor="yellows" className="mt-2">
                                        Total Yellows
                                    </Label>
                                    <Input
                                        className="border-zinc-400"
                                        id="yellows"
                                        min={0}
                                        onChange={(e) => updateVoteValues({ yellows: Number(e.target.value) })}
                                        placeholder="0"
                                        type="number"
                                    />
                                    <Label htmlFor="reds" className="mt-2">
                                        Total Reds
                                    </Label>

                                    <Input
                                        className="border-zinc-400"
                                        id="reds"
                                        min={0}
                                        onChange={(e) => updateVoteValues({ reds: Number(e.target.value) })}
                                        placeholder="0"
                                        type="number"
                                    />
                                    <div className="flex items-center space-x-2 mb-4">
                                        <Toggle
                                            id="rain"
                                            onClick={() => {
                                                setToggleRain(!toggleRain);
                                                updateVoteValues({ rain: !voteValues.rain });
                                            }}
                                        />
                                        <Label htmlFor="rain">Rain</Label>
                                    </div>
                                    <div className={cn(toggleRain ? 'block' : 'hidden', 'p-4 pt-0')}>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <Toggle
                                                    id="intermediates"
                                                    onClick={() =>
                                                        updateVoteValues({ greenTires: !voteValues.greenTires })
                                                    }
                                                />
                                                <Label htmlFor="intermediates">Intermediates</Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Toggle
                                                    id="fullWetBlueTires"
                                                    onClick={() =>
                                                        updateVoteValues({ blueTires: !voteValues.blueTires })
                                                    }
                                                />
                                                <Label htmlFor="fullWetBlueTires">Full Wet</Label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="col-start-2 row-start-2 h-[32vh]">
                        <Card className="p-4 dark:bg-zinc-800 bg-zinc-300 h-full">
                            <CardTitle className="mb-4">Submit Vote</CardTitle>

                            {submitStatus.isError && (
                                <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded">
                                    {submitStatus.errorMessage}
                                </div>
                            )}

                            {submitStatus.isSuccess ? (
                                <div className="text-center p-4">
                                    <p className="text-green-600 dark:text-green-400 font-semibold">
                                        Vote submitted successfully!
                                    </p>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Redirecting...</p>
                                </div>
                            ) : (
                                <>
                                    <LoginForm />

                                    <Button
                                        type="submit"
                                        variant="default"
                                        className="w-full border border-zinc-300 shadow-2xl"
                                        disabled={isSubmittingVote || submitStatus.isSubmitting}
                                    >
                                        {isSubmittingVote ? 'Submitting...' : 'Submit Vote'}
                                    </Button>

                                    <div className="mt-2 text-center">
                                        <Button
                                            type="button"
                                            variant="link"
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => navigate('/account/new')}
                                        >
                                            New Account
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default Vote;
