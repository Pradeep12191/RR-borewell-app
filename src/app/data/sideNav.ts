import { NavItem } from '../models';
const LEVEL_0_PADDING = 15;
const LEVEL_1_PADDING = 30;
const LEVEL_2_PADDING = 45;

export const SIDE_NAV_ITEMS: NavItem[] = [
    {
        name: 'Vehicle',
        isMain: true,
        icon: 'directions_car',
        path: 'vehicles',
        level: 0,
        paddingLeft: LEVEL_0_PADDING
    },
    {
        name: 'RPM',
        isMain: true,
        icon: 'av_timer',
        path: 'rpmEntry',
        level: 0,
        paddingLeft: LEVEL_0_PADDING,
        open: true,
        children: [
            {
                name: 'RPM Entry',
                isFirstChild: true,
                path: 'rpmEntry',
                level: 1,
                paddingLeft: LEVEL_1_PADDING,
            },
            {
                name: 'RPM Report',
                isLastChild: true,
                path: 'rpmEntryReport',
                level: 1,
                paddingLeft: LEVEL_1_PADDING,
            },
        ]
    },
    {
        name: 'Godown Inventory',
        icon: 'storefront',
        paddingLeft: LEVEL_0_PADDING,
        isMain: true,
        level: 0,
        open: true,
        children: [
            {
                name: 'Pipe',
                isFirstChild: true,
                path: 'pipes',
                level: 1,
                paddingLeft: LEVEL_1_PADDING,
            },
            // {
            //     name: 'Assign Vehicle (Pipe)',
            //     path: 'assignVehicle',
            //     level: 1,
            //     paddingLeft: LEVEL_1_PADDING,
            // },
            {
                name: 'Godown Exchange',
                path: 'godownExchange',
                level: 1,
                paddingLeft: LEVEL_1_PADDING,
            },
            {
                name: 'Bit',
                path: 'bits',
                level: 1,
                paddingLeft: LEVEL_1_PADDING,
            },
            {
                name: 'Bit Vehicle Exchange',
                path: 'bitsExchangeVehicle',
                level: 1,
                paddingLeft: LEVEL_1_PADDING,
            },
            {
                name: 'Hammer',
                path: 'hammers',
                isLastChild: true,
                level: 1,
                paddingLeft: LEVEL_1_PADDING,
            },
        ],
    },
];
