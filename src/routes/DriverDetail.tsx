// import { useGetDriverQuery } from '@/features/driversApi';
// import { Driver } from '@/types/drivers';
// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// const DriverDetail: React.FC = () => {
//     const [driver, setDriver] = useState<Driver | null>(null);
//     const { id, year } = useParams<{ id: string; year: string }>();

//     const { data: driverData } = useGetDriverQuery(id as string);

//     useEffect(() => {
//         const fetchDriver = async () => {
//             const response = await fetch(`/api/drivers/${id}?year=${year}`);
//             const data = await response.json();
//             setDriver(data);
//         };
//         fetchDriver();
//     }, [id, year]);

//     return (
//         <div className="flex flex-col items-center justify-center h-[85vh]">
//             <h1 className="mb-6 text-3xl font-bold">Driver Detail</h1>
//             {driver ? (
//                 <div className="text-center">
//                     <h2 className="text-2xl font-bold">{driver.name}</h2>
//                     <p
//                         className="text-lg

//                         text-gray-700"
//                     >{`Country: ${driver.country}`}</p>
//                     <p className="text-lg text-gray-700">{`Date of Birth: ${driver.dateOfBirth}`}</p>
//                 </div>
//             ) : (
//                 <p className="text-lg text-gray-700">...</p>
//             )}
//             {/* Uncomment the following line to display an image */}

//             {/* <img className="max-w-[40%] rounded-3xl" src={Error404Image} alt="404 Error" /> */}
//         </div>
//     );
// };

const DriverDetail: React.FC = () => {
    return (
        <div>
            <h1>Driver Detail</h1>
            <p>This is the driver detail page.</p>
        </div>
    );
};
export default DriverDetail;
