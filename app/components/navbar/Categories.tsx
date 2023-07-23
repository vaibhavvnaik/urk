'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { TbBabyCarriage, TbBeach, TbLuggage, TbMountain, TbPool, TbShoe } from 'react-icons/tb';
import { 
  GiBarn, 
  GiBoatFishing, 
  GiCactus, 
  GiCastle, 
  GiCaveEntrance, 
  GiClothes, 
  GiForestCamp, 
  GiHollowCat, 
  GiIsland,
  GiWindmill
} from 'react-icons/gi';
import { FaSkiing } from 'react-icons/fa';
import { BsSnow } from 'react-icons/bs';
import { IoDiamond, IoDiamondOutline, IoFitnessOutline, IoGameControllerOutline, IoHardwareChipOutline, IoRestaurantOutline } from 'react-icons/io5';
import { MdOutlineLocalGroceryStore, MdOutlineSportsFootball, MdOutlineVilla, MdTravelExplore } from 'react-icons/md';

import CategoryBox from "../CategoryBox";
import Container from '../Container';
import { FcElectronics } from 'react-icons/fc';
import { AiOutlineCar, AiOutlineHome } from 'react-icons/ai';
import { BiCameraMovie } from 'react-icons/bi';


export const categories = [
  {
    label: 'Grocery',
    icon: MdOutlineLocalGroceryStore,
    description: 'This property is close to the beach!',
  },
  {
    label: 'Footwear',
    icon: TbShoe,
    description: 'This property is has windmills!',
  },
  {
    label: 'Home',
    icon: AiOutlineHome,
    description: 'This property is modern!'
  },
  {
    label: 'Clothing',
    icon: GiClothes,
    description: 'This property is in the countryside!'
  },
  {
    label: 'Auto',
    icon: AiOutlineCar,
    description: 'This is property has a beautiful pool!'
  },
  {
    label: 'Health & Beauty',
    icon: IoFitnessOutline,
    description: 'This property is on an island!'
  },
  {
    label: 'Entertainment',
    icon: BiCameraMovie,
    description: 'This property is near a lake!'
  },
  {
    label: 'Travel',
    icon: MdTravelExplore,
    description: 'This property has skiing activies!'
  },
  {
    label: 'Babies & Kids',
    icon: TbBabyCarriage,
    description: 'This property is an ancient castle!'
  },
  {
    label: 'Sporting Goods',
    icon: MdOutlineSportsFootball,
    description: 'This property is in a spooky cave!'
  },
  {
    label: 'Pets',
    icon: GiHollowCat,
    description: 'This property offers camping activities!'
  },
  {
    label: 'Luggage',
    icon: TbLuggage,
    description: 'This property is in arctic environment!'
  },
  {
    label: 'Restaurants',
    icon: IoRestaurantOutline,
    description: 'This property is in the desert!'
  },
  {
    label: 'Electronics',
    icon: IoHardwareChipOutline,
    description: 'This property is in a barn!'
  },
  {
    label: 'Lux',
    icon: IoDiamondOutline,
    description: 'This property is brand new and luxurious!'
  }
]

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get('category');
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div
        className="
          pt-2
          flex 
          flex-row 
          items-center 
          justify-between
          overflow-x-auto
        "
      >
        {categories.map((item) => (
          <CategoryBox 
            key={item.label}
            label={item.label}
            icon={item.icon}
            selected={category === item.label}
          />
        ))}
      </div>
    </Container>
  );
}
 
export default Categories;