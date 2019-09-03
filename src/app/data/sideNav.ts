import { NavItem } from '../models';
const LEVEL_0_PADDING = 15;
const LEVEL_1_PADDING = 30;
const LEVEL_2_PADDING = 45;

export const SIDE_NAV_ITEMS: NavItem[] = [
    {
        name: 'Vehicle',
        isMain: true,
        icon: 'directions_car',
        path: 'vehicle',
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
                level: 1,
                paddingLeft: LEVEL_1_PADDING,
                children: [
                    { name: 'Add Pipe', isFirstChild: true, path: 'ytd10', level: 2, paddingLeft: LEVEL_2_PADDING },
                    { name: 'View Pipe', path: 'ytd10', level: 2, paddingLeft: LEVEL_2_PADDING },
                    { name: 'Give Vehicle', isLastChild: true, path: 'ytd10', level: 2, paddingLeft: LEVEL_2_PADDING },
                ]
            },
            {
                name: 'Bit',
                isLastChild: true,
                level: 1,
                paddingLeft: LEVEL_1_PADDING,
                children: [
                    { name: 'Add Bit', isFirstChild: true, path: 'ytd10', level: 2, paddingLeft: LEVEL_2_PADDING },
                    { name: 'View Bit', path: 'ytd10', level: 2, paddingLeft: LEVEL_2_PADDING },
                    { name: 'Give Vehicle', isLastChild: true, path: 'ytd10', level: 2, paddingLeft: LEVEL_2_PADDING },
                ]
            }
        ],
    },
];
