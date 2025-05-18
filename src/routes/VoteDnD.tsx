import { cn } from '@/lib/utils';
import { DndContext, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { Scrollbar } from '@radix-ui/react-scroll-area';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';

import SortableItem from 'components/dnd-kit/SortableItem';
import DriverCheckbox from 'components/Driver/DriverCheckbox';
import LoadingToast from 'components/LoadingToast';
import Toggle from 'components/Toggle';
import { Card, CardTitle } from 'components/ui/card';
import { Form } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { ScrollArea } from 'components/ui/scroll-area';

import { YEAR } from 'constants/constants';

import { useGetDriversByYearQuery } from 'features/driversApi';
import { SubmitVoteRequest, useCheckVoteQuery, useSubmitVoteMutation } from 'features/userApi';

import { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { setDriversByYear } from 'slices/driversSlice';
import { setError, setLoading } from 'slices/siteWideSlice';
import { type Driver } from 'types/drivers';
import { type VoteValueProps } from 'types/vote';
import LoginForm from './LoginForm';

const columnHeights = 'lg:max-h-[70vh] md:max-h-[50vh] max-h-[32vh] min-h-[32vh]';

const Vote: React.FC = (): JSX.Element => {
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

    const [isClosed,] = useState(false);

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

    const [voteCheck, setVoteCheck] = useState(false);
    const voteCheckResults = useAppSelector((state: RootState) => state.user.user.voteCheck);

    const {
        data: voteCheckData,
        isLoading: voteCheckIsLoading,
        isError: voteCheckIsError
    } = useCheckVoteQuery({
        user_id: user?.id || 0,
        race_id: raceNext?.id || 0
    }) as {
        data: VoteValueProps | undefined;
        isLoading: boolean;
        isError: boolean;
    };

    useEffect(() => {
        console.log('0-Vote check results:', voteCheckResults);
        if (voteCheckIsError) {
            dispatch(setError(true));
            return;
        }
        if (voteCheckIsLoading) dispatch(setLoading(true));
        if (!voteCheckData) return;

        console.log('Vote check results:', voteCheckResults);

        if (voteCheckResults) {
            setVoteCheck(true);
        } else {
            setVoteCheck(false);
        }
    }, [voteCheckResults]);

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
        const completeVoteData: SubmitVoteRequest = {
            ...baseVoteValues,
            finishOrder: voteOrderedDrivers.map((driver) => ({
                position: driver.id,
                name: driver.name,
                id: driver.id,
            })),
            ...formData,
            race_id: raceNext.id,
            user_id: user?.id || formData.userId,
        };

        console.log('completeVoteData', completeVoteData);

        // ? this should be cleaned up and removed. it's really just a safety dance move at this point.
        if (completeVoteData.drivers) delete completeVoteData.drivers; // remove drivers if present

        const response = await submitVote(completeVoteData).unwrap();

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

    if (!localStorage.getItem('user')) {
        return (
            <div className="flex h-fit w-full justify-center">
                <LoginForm />
            </div>
        );
    }

    if (isClosed) {
        return (
            <div className="flex h-fit w-full justify-center">
                <div className="text-center p-4">
                    <div
                    className="
                    w-full dark:text-zinc-300 text-zinc-800 text-center p-4 text-2xl krona-one-regular"
                >
                    Voting Closed
                </div>
                <p>Next race: {raceNext?.date} - {raceNext?.short_name}</p>
                <p>Voting opens on Wednesday of Race week</p>
                <p>Voting closes 1 hour before lights out</p>
                </div>
            </div>
        );
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
                                    <p>Hello, welcome back!</p>

                                    <button 
                                        className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
                                        type="submit"
                                        disabled={isSubmittingVote || submitStatus.isSubmitting}
                                    >
                                        {isSubmittingVote || submitStatus.isSubmitting ? 'Submitting...' : 'Submit Vote'}
                                    </button>
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
