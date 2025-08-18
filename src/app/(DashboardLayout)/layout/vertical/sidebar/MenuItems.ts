import { uniqueId } from "lodash";

interface MenuitemsType {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: MenuitemsType[];
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
}

import {
  IconPoint,
  IconNotes,
  IconGitMerge,
  IconFileDescription,
  IconUserCircle,
  IconSettings,
  IconHome,
  IconDeviceGamepad2,
  IconAward,
  IconCreditCard,
  IconFilePlus,
  IconSearch,
  IconPuzzle,
} from "@tabler/icons-react";

const Menuitems: MenuitemsType[] = [
  {
    id: uniqueId(),
    navlabel: true,
    subheader: "Dashboard",
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconHome,
    href: "/",
  },
  {
    id: uniqueId(),
    navlabel: true,
    subheader: "Content",
  },
  {
    id: uniqueId(),
    title: "Casino Reviews",
    icon: IconNotes,
    href: "/content/casino-reviews",
    children: [
      // {
      //   id: uniqueId(),
      //   title: "Casino Reviews",
      //   icon: IconPoint,
      //   href: "/content/casino-reviews",
      // },
      {
        id: uniqueId(),
        title: "Casino Tags",
        icon: IconPoint,
        href: "/content/casino-reviews/tags",
      },
      {
        id: uniqueId(),
        title: "Countries",
        icon: IconPoint,
        href: "/content/casino-reviews/countries",
      },
      {
        id: uniqueId(),
        title: "Licences",
        icon: IconPoint,
        href: "/content/casino-reviews/licences",
      },
      {
        id: uniqueId(),
        title: "Languages",
        icon: IconPoint,
        href: "/content/casino-reviews/languages",
      },
      {
        id: uniqueId(),
        title: "Platforms",
        icon: IconPoint,
        href: "/content/casino-reviews/platforms",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Games",
    icon: IconDeviceGamepad2,
    href: "/content/games",
    children: [
      // {
      //   id: uniqueId(),
      //   title: "Games",
      //   icon: IconPoint,
      //   href: "/content/games",
      // },
      {
        id: uniqueId(),
        title: "Game Types",
        icon: IconPoint,
        href: "/content/games/types",
      },
      {
        id: uniqueId(),
        title: "Game Features",
        icon: IconPoint,
        href: "/content/games/features",
      },
      {
        id: uniqueId(),
        title: "Software Providers",
        icon: IconPoint,
        href: "/content/games/providers",
      },
      {
        id: uniqueId(),
        title: "Game Tags",
        icon: IconPoint,
        href: "/content/games/tags",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Bonuses",
    icon: IconAward,
    href: "/content/bonuses",
    children: [
      // {
      //   id: uniqueId(),
      //   title: "Bonuses",
      //   icon: IconPoint,
      //   href: "/content/bonuses",
      // },
      {
        id: uniqueId(),
        title: "Bonus Types",
        icon: IconPoint,
        href: "/content/bonuses/types",
      },
      {
        id: uniqueId(),
        title: "Bonus Tags",
        icon: IconPoint,
        href: "/content/bonuses/tags",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Payment Methods",
    icon: IconCreditCard,
    href: "/content/payment-methods",
  },
  {
    id: uniqueId(),
    title: "Custom Pages",
    icon: IconFilePlus,
    href: "/content/custom-pages",
  },
  {
    id: uniqueId(),
    navlabel: true,
    subheader: "Media Library",
  },
  {
    id: uniqueId(),
    title: "Media Library",
    icon: IconFileDescription,
    href: "/media-library",
  },

  {
    id: uniqueId(),
    navlabel: true,
    subheader: "Scraping",
  },
  {
    id: uniqueId(),
    title: "CSV Scraper",
    icon: IconGitMerge,
    href: "/scraping",
    // children: [
    //   {
    //     id: uniqueId(),
    //     title: "Scraping Settings",
    //     icon: IconPoint,
    //     href: "/scraping/settings",
    //   },
    //   {
    //     id: uniqueId(),
    //     title: "Scraping Logs",
    //     icon: IconPoint,
    //     href: "/scraping/logs",
    //   },
    // ],
  },
  {
    id: uniqueId(),
    navlabel: true,
    subheader: "Users",
  },
  {
    id: uniqueId(),
    title: "Users",
    icon: IconUserCircle,
    href: "/users",
  },
  {
    id: uniqueId(),
    navlabel: true,
    subheader: "Settings",
  },
  {
    id: uniqueId(),
    title: "General",
    icon: IconSettings,
    href: "/settings/general",
  },
  {
    id: uniqueId(),
    title: "SEO",
    icon: IconSearch,
    href: "/settings/seo",
  },
  {
    id: uniqueId(),
    title: "Custom Fields",
    icon: IconPuzzle,
    href: "/settings/custom-fields",
  },
];

export default Menuitems;