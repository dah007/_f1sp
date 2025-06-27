import DriverCheckbox from '@/components/Driver/DriverCheckbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';
import { setError, setLoading } from '@/slices/systemWideSlice';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';
import LoadingToast from 'components/LoadingToast';
import { Card, CardTitle } from 'components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from 'components/ui/form';
import { YEAR } from 'constants/constants';
import { useGetDriversByYearQuery } from 'features/driversApi';
import { SubmitVoteRequest, useCheckVoteQuery, useSubmitVoteMutation } from 'features/userApi';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { setDriversByYear } from 'slices/driversSlice';
import type { Driver } from 'types/drivers';
import type { VoteValueProps } from 'types/vote';
import LoginForm from './LoginFormRoute';
// const columnHeights = 'lg:max-h-[70vh] md:max-h-[50vh] max-h-[32vh] min-h-[32vh]';

import Intermediates from '/assets/tires/intermediates.png';

import { Checkbox } from '@/components/ui/checkbox';
import FullWets from '/assets/tires/full_wets.png';

// TODO: Refactor this component the data object side is a hawt mess.
const Vote: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const form = useForm();
    const navigate = useNavigate();

    const driversByYear = useAppSelector((state: RootState) => state.drivers.driversByYear);
    const raceNext = useAppSelector((state: RootState) => state.races.raceNext);
    const user = JSON.parse(localStorage.getItem('user') ?? '{}'); // useAppSelector((state: RootState) => state.user.user);

    const [submitStatus, setSubmitStatus] = useState({
        isSubmitting: false,
        isSuccess: false,
        isError: false,
        errorMessage: '',
    });

    // const [isClosed] = useState(false);

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
        isError: voteCheckIsError,
    } = useCheckVoteQuery({
        email: user?.email || '',
        race_id: raceNext?.id || 0,
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
    }, [dispatch, voteCheckData, voteCheckIsError, voteCheckIsLoading, voteCheckResults]);

    const [toggleRain, setToggleRain] = useState(false);
    const [toggleCrash, setToggleCrash] = useState(false);

    const updateVoteValues = (value = {}) => {
        const newValues = { ...voteValues, ...value };
        setVoteValues(newValues);
    };

    const onSubmit = async (formData: FieldValues) => {
        console.log('onSubmit', `currently: ${voteCheck}`, formData);
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
            email: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).email : '',
        };

        completeVoteData.driversInCrash = JSON.stringify(completeVoteData.driversInCrash);
        completeVoteData.finishOrder = JSON.stringify(completeVoteData.finishOrder);

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

        navigate('/?success=true&message=Vote submitted successfully!');
    };

    const moveBy = (direction: string, driver: Driver) => {
        console.log('string', direction, 'driver', driver);
        // i need to move the past in driver up or down in the list of drivers (voteOrderedDrivers
        const currentIndex = voteOrderedDrivers.findIndex((d) => d.id === driver.id);
        if (currentIndex === -1) return; // Driver not found
        let newIndex = currentIndex;
        if (direction === 'up' && currentIndex > 0) {
            newIndex = currentIndex - 1;
        } else if (direction === 'down' && currentIndex < voteOrderedDrivers.length - 1) {
            newIndex = currentIndex + 1;
        }
        if (newIndex === currentIndex) return; // No change in position
        const updatedDrivers = [...voteOrderedDrivers];
        updatedDrivers.splice(currentIndex, 1); // Remove the driver from the current position
        updatedDrivers.splice(newIndex, 0, driver); // Insert the driver at the new position
        setVoteOrderedDrivers(updatedDrivers);
        updateVoteValues({ finishOrder: updatedDrivers });
        console.log('Updated drivers:', updatedDrivers);
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

    // if (isClosed) {
    //     return (
    //         <div className="flex h-fit w-full justify-center">
    //             <div className="text-center p-4">
    //                 <div
    //                     className="
    //                 w-full dark:text-zinc-300 text-zinc-800 text-center p-4 text-2xl krona-one-regular"
    //                 >
    //                     Voting Closed
    //                 </div>
    //                 <p>
    //                     Next race: {raceNext?.date} - {raceNext?.short_name}
    //                 </p>
    //                 <p>Voting opens on Wednesday of Race week</p>
    //                 <p>Voting closes 1 hour before lights out (give or take)</p>
    //             </div>
    //         </div>
    //     );
    // }

    const cardClass = 'dark:bg-zinc-800 bg-zinc-300 md:flex-1 w-[98%] flex flex-col gap-4';
    const cardTitleClass = 'pl-4 krona-one-regular';

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
                    Voting closes 1 hour before lights out & opens on Tuesday before the next race.
                </p>
                <div className="flex md:flex-row flex-col justify-between mb-4 gap-4 items-start">
                    <Card className={cardClass}>
                        <CardTitle className={cardTitleClass}>Finish Order</CardTitle>

                        <div className="flex flex-col gap-0 h-fit">
                            {voteOrderedDrivers?.map((driver, index) => (
                                <div
                                    className="w-full flex justify-between p-4 border-b select-none first:border-t"
                                    id={driver.id}
                                    data-index={index + 1}
                                    key={`${driver.id}-${index}`}
                                >
                                    {driver.name}
                                    <div className="flex gap-1 cursor-pointer">
                                        <ChevronUp
                                            className="w-6 h-6 hover:text-green-700"
                                            onClick={() => moveBy('up', driver)}
                                        />
                                        <ChevronDown
                                            className="w-6 h-6 hover:text-red-700"
                                            onClick={() => moveBy('down', driver)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                    <Card className={cn(cardClass, 'p-4')}>
                        <CardTitle className={cn(cardTitleClass, 'p-0')}>Other &ldquo;Bets&rdquo;</CardTitle>
                        <Label htmlFor="yellows" className="mt-2 font-bold">
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
                        <Label htmlFor="reds" className="mt-2 font-bold">
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
                        <div className="flex items-center space-x-2">
                            <FormField
                                name={`rain`}
                                render={() => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                className="border-gray-400"
                                                checked={toggleRain}
                                                onCheckedChange={() => {
                                                    setToggleRain(!toggleRain);
                                                    updateVoteValues({ rain: !voteValues.rain });
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-bold">Will there be rain?</FormLabel>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="p-4 pt-0">
                            <div className="flex flex-col gap-2 ">
                                <span>Tires used:</span>
                                <div className="flex items-center gap-2">
                                    <Toggle
                                        aria-label="Toggle intermediates"
                                        className={`border-zinc-500 hover:bg-zinc-700 ${
                                            voteValues.greenTires ? 'bg-zinc-500' : ''
                                        }`}
                                        id="intermediates"
                                        onClick={() => updateVoteValues({ greenTires: !voteValues.greenTires })}
                                    >
                                        <img src={Intermediates} alt="Intermediates" className="w-8" />

                                        <Label htmlFor="intermediates">Intermediates</Label>
                                    </Toggle>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Toggle
                                        aria-label="Toggle full wets"
                                        className={`border-zinc-500 hover:bg-zinc-700 ${
                                            voteValues.blueTires ? 'bg-zinc-500' : ''
                                        }`}
                                        id="fullWets"
                                        onClick={() => updateVoteValues({ blueTires: !voteValues.blueTires })}
                                    >
                                        <img src={FullWets} alt="Full Wets" className="w-8" />

                                        <Label htmlFor="fullWets">Full Wets</Label>
                                    </Toggle>
                                </div>
                            </div>
                        </div>

                        {/* END TIRES */}

                        <FormField
                            name={`firstLapCrash`}
                            render={() => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            className="border-gray-400"
                                            checked={toggleCrash}
                                            onCheckedChange={() => {
                                                setToggleCrash(!toggleCrash);
                                                setDriversInCrashDisabled(!driversInCrashDisabled);
                                            }}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-bold">Crash on First Lap ?</FormLabel>
                                </FormItem>
                            )}
                        />

                        <Label
                            htmlFor="driversInCrash"
                            className="w-full p-1 pl-0 pb-0 border-b-zinc-300 border-b text-lg dark:text-zinc-300 text-zinc-800"
                        >
                            Drivers in crash
                        </Label>
                        <div className={cn('border', 'border-zinc-400 p-4 rounded-lg flex flex-col')}>
                            {driversByYear?.map((driver, index) => {
                                if (!driver.name || driver.name.trim() === '') return null;
                                return (
                                    <div
                                        className="w-full flex justify-between p-4 border-b select-none spacing"
                                        id={driver.id}
                                        data-index={index + 1}
                                        key={`${driver.id}-${index}`}
                                    >
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
                        </div>
                    </Card>
                </div>
                <div className="col-start-2 row-start-2 h-[32vh] mt-4">
                    <Card className="p-4 dark:bg-zinc-800 bg-zinc-300 h-full">
                        <CardTitle className="krona-one-regular mb-4">Submit Vote</CardTitle>

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
                                <p>Let&apos;s do this! Place your votes!</p>

                                <p>
                                    <strong className="font-extrabold">NOTE:</strong> Your votes are saved, however due
                                    to a bug, they aren&apos;t currently displayed in the UI. There is an open issue for
                                    it.
                                </p>

                                <button
                                    className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
                                    type="submit"
                                    disabled={isSubmittingVote || submitStatus.isSubmitting}
                                >
                                    {/* {isSubmittingVote || submitStatus.isSubmitting
                                        ? 'Submitting...'
                                        : user?.email
                                        ? 'Update Vote'
                                        : 'Submit Vote'} */}
                                    Submit Vote
                                </button>
                            </>
                        )}
                    </Card>
                </div>{' '}
            </form>
        </Form>
    );
};

export default Vote;
