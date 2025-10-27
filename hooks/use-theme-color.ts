import { Colors } from '@/constants/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.dark 
) {
  const theme = 'dark';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors.dark[colorName];
  }
}