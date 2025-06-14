import { RootState, useAppDispatch, useAppSelector } from '@/app/store';
import DataTable from '@/components/DataTable';
import { useGetTyresManufacturersQuery } from '@/features/constructorsApi';
import { cn } from '@/lib/utils';
import { setTyresManufacturers } from '@/slices/constructorsSlice';
import { setError, setLoading } from '@/slices/systemWideSlice';
import { ManufacturerProps } from '@/types/constructors';
import { ColumnDef } from '@tanstack/react-table';

import { useEffect } from 'react';

interface TypeRouteProps {
    className?: string;
    manufacturerColDefs?: ColumnDef<ManufacturerProps>[];
}

const TyreRoute: React.FC<TypeRouteProps> = ({ className, manufacturerColDefs }: TypeRouteProps) => {
    const dispatch = useAppDispatch();
    const tyreManufacturers = useAppSelector((state: RootState) => state.constructors.tyresManufacturers);

    const {
        data: tyreManufacturerData,
        isError: tyreManufacturerIsError,
        isLoading: tyreManufacturerIsLoading,
    } = useGetTyresManufacturersQuery([]) as {
        data: ManufacturerProps[];
        isError: boolean;
        isLoading: boolean;
    };

    useEffect(() => {
        if (tyreManufacturerIsError) {
            dispatch(setError(true));
            return;
        }
        if (tyreManufacturerIsLoading) dispatch(setLoading(true));

        if (!tyreManufacturerData) return;
        dispatch(setTyresManufacturers(tyreManufacturerData));
        dispatch(setLoading(false));
    }, [tyreManufacturerData]);

    return <DataTable className={cn(className)} columns={manufacturerColDefs || []} data={tyreManufacturers ?? []} />;
};

export default TyreRoute;
