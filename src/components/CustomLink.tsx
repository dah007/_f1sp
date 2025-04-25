import React from 'react';

import { useAppDispatch } from '../hooks/reduxHooks';
import { useNavigate } from 'react-router-dom';
import { setCurrentRoute } from '../slices/routeSlice';

type CustomLinkProps = { route: RouteProps; roll?: string };

export type RouteProps = {
    parent: {
        path: string;
        label: string;
    };
    path: string;
    label: string;
    hidden?: boolean;
};

/**
 * CustomLink component is a reusable link component that handles navigation and state updates.
 *
 * @component
 * @param {CustomLinkProps} props - The properties for the CustomLink component.
 * @param {Object} props.route - The route object containing the path and label.
 * @param {string} props.route.path - The path to navigate to.
 * @param {string} props.route.label - The label to display for the link.
 * @param {string} [props.roll='button'] - The role attribute for the link element, default is 'button'.
 * @returns {JSX.Element} The rendered link component.
 *
 * @example
 * <CustomLink route={{ path: '/home', label: 'Home' }} />
 */
const CustomLink: React.FC<CustomLinkProps> = ({ route, roll = 'button' }: CustomLinkProps): JSX.Element => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    return (
        <a
            className="cursor-pointer link link-primary link-hover"
            onClick={() => {
                localStorage.setItem(
                    'currentRoute',
                    JSON.stringify({
                        label: 'Home',
                        path: route,
                    }),
                );
                dispatch(setCurrentRoute(route));
                navigate(route.path);
            }}
            role={roll}
        >
            {route.label}
        </a>
    );
};

export default CustomLink;
