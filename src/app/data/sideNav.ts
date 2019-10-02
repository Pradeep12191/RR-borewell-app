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
        name: 'RPM Entry',
        isMain: true,
        icon: 'av_timer',
        path: 'rpmEntry',
        level: 0,
        paddingLeft: LEVEL_0_PADDING,
    },
    {
        name: 'Godown Inventory',
        icon: 'storefront',
        paddingLeft: LEVEL_0_PADDING,
        isMain: true,
        level: 0,
        children: [
            {
                name: 'Pipe',
                isFirstChild: true,
                path: 'pipes',
                level: 1,
                paddingLeft: LEVEL_1_PADDING,
            },
            {
                name: 'Assign Vehicle (Pipe)',
                path: 'assignVehicle',
                level: 1,
                paddingLeft: LEVEL_1_PADDING,
            },
            {
                name: 'Godown Exchange',
                path: 'godownExchange',
                level: 1,
                paddingLeft: LEVEL_1_PADDING,
            },
            {
                name: 'Bit',
                isLastChild: true,
                path: 'bits',
                level: 1,
                paddingLeft: LEVEL_1_PADDING,
            }
        ],
    },
];
