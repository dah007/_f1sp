import { RootState, useAppDispatch, useAppSelector } from '@/app/store';
import DataTable from '@/components/DataTable';
import { useGetEnginesManufacturersQuery } from '@/features/constructorsApi';
import { cn } from '@/lib/utils';
import { setEnginesManufacturers } from '@/slices/constructorsSlice';
import { setError, setLoading } from '@/slices/systemWideSlice';
import { ManufacturerProps } from '@/types/constructors';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect } from 'react';

interface EnginesRouteProps {
    className?: string;
    manufacturerColDefs?: ColumnDef<ManufacturerProps>[];
}

const EnginesRoute = ({ className, manufacturerColDefs }: EnginesRouteProps) => {
    const dispatch = useAppDispatch();

    const enginesManufacturers = useAppSelector((state: RootState) => state.constructors.enginesManufacturers);

    const {
        data: enginesManufacturerData,
        isError: enginesManufacturerIsError,
        isLoading: enginesManufacturerIsLoading,
    } = useGetEnginesManufacturersQuery(undefined) as {
        data: ManufacturerProps[];
        isError: boolean;
        isLoading: boolean;
    };

    useEffect(() => {
        if (enginesManufacturerIsError) {
            dispatch(setError(true));
            return;
        }
        if (enginesManufacturerIsLoading) dispatch(setLoading(true));
        if (!enginesManufacturerData) return;

        dispatch(setEnginesManufacturers(enginesManufacturerData));
        dispatch(setLoading(false));
    }, [enginesManufacturerIsError, enginesManufacturerData, enginesManufacturerIsLoading, dispatch]);

    return (
        <DataTable
            className={cn(className, 'w-0-fit')}
            columns={manufacturerColDefs}
            data={enginesManufacturers ?? []}
        />
    );
};

export default EnginesRoute;
