// Step 1: Import each image file using a relative path
import cricketIcon from '../assets/images/categories/cricket.png';
import pickleballIcon from '../assets/images/categories/pickle-ball.png';
import golfIcon from '../assets/images/categories/golf.png';
import poolIcon from '../assets/images/categories/pool.png';
import snookerIcon from '../assets/images/categories/snooker.png';

// Step 2: Use the imported variables in your array
export const categories = [
  { 
    id: 1, 
    name: 'Cricket', 
    image: cricketIcon 
  },
  { 
    id: 2, 
    name: 'Pickleball', 
    image: pickleballIcon 
  },
  { 
    id: 3, 
    name: 'Golf', 
    image: golfIcon
  },
  { 
    id: 4, 
    name: 'Pool', 
    image: poolIcon
  },
  { 
    id: 5, 
    name: 'Snooker', 
    image: snookerIcon
  },
];