import React /*, { useEffect, useState }*/ from 'react';
// import { useGetConstructorStandingsQuery } from '../features/standingsApi';

// import type { ConstructorStanding } from 'types/standings';

// import { useAppDispatch, useAppSelector } from '../app/store';
// import { setSelectedYear } from 'slices/siteWideSlice';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface ConstructorsStandingProps {
    year: number;
}

const ConstructorsStanding: React.FC<ConstructorsStandingProps> = () => {
    // const dispatch = useAppDispatch();

    // const { data, isError, isLoading } = useGetConstructorStandingsQuery(year);
    // const [constructors, setConstructors] = useState<ConstructorStanding[]>([]);
    // const selectedYear = useAppSelector((state) => state.siteWide.selectedYear);

    // useEffect(() => {
    //     if (selectedYear !== year) {
    //         dispatch(setSelectedYear(year));
    //     }
    // }, [selectedYear, year, dispatch]);

    // useEffect(() => {
    //     if (data) {
    //         setConstructors(data);
    //     }
    // }, [data]);

    // if (isLoading) return <div>Loading...</div>;
    // if (isError) return <div>Error: {isError.toString()}</div>;

    // return (
    //     <div className="flex flex-col gap-1">
    //         <Table>
    //             <TableHeader>
    //                 <TableRow>
    //                     <TableHead>Constructor</TableHead>
    //                     <TableHead>Engine Manufacturer</TableHead>
    //                     <TableHead className="text-right">Points</TableHead>
    //                 </TableRow>
    //             </TableHeader>
    //             <TableBody>
    //                 {constructors.map((constructor) => (
    //                     <TableRow key={constructor.cName}>
    //                         <TableCell>{constructor.cName}</TableCell>
    //                         <TableCell>{constructor.emName}</TableCell>
    //                         <TableCell className="text-right">{constructor.points}</TableCell>
    //                     </TableRow>
    //                 ))}
    //             </TableBody>
    //         </Table>
    //     </div>
    // );
    return <>constructor</>;
};

export default ConstructorsStanding;
