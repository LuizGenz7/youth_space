import {
  Accessibility,
  Bike,
  BriefcaseBusiness,
  CakeSlice,
  Camera,
  Car,
  Code2,
  Dumbbell,
  Flower2,
  GraduationCap,
  Hammer,
  Heart,
  Home,
  Laptop,
  Mic2,
  Music,
  Palette,
  PenTool,
  Shirt,
  Sparkles,
  SprayCan,
  Store,
  Scissors,
  Video,
} from "lucide-react";

const iconMap = {
  accessibility: Accessibility,
  bike: Bike,
  briefcase: BriefcaseBusiness,
  cake: CakeSlice,
  camera: Camera,
  car: Car,
  code: Code2,
  dumbbell: Dumbbell,
  flower: Flower2,
  graduation: GraduationCap,
  hammer: Hammer,
  heart: Heart,
  home: Home,
  laptop: Laptop,
  mic: Mic2,
  music: Music,
  palette: Palette,
  "pen-tool": PenTool,
  shirt: Shirt,
  sparkles: Sparkles,
  "spray-can": SprayCan,
  store: Store,
  scissors: Scissors,
  video: Video,
};

export default function CategoryIcon({ icon, size = 18, ...props }) {
  const Icon = iconMap[icon] || BriefcaseBusiness;

  return <Icon size={size} {...props} />;
}