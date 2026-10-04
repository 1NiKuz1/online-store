import { Heart, Search, ShoppingCart } from "lucide-react";

import { AuthSheet } from "@presentation/features/auth-otp";
import {
  Toolbar,
  ToolbarCenter,
  ToolbarIconButton,
  ToolbarLeft,
  ToolbarMenuItem,
  ToolbarRight,
  ToolbarTitle,
} from "@presentation/shared/ui/toolbar";

export function Header(): React.ReactNode {
  return (
    <Toolbar variant="bordered" size="md">
      <ToolbarLeft>
        <ToolbarMenuItem href="/">Главная</ToolbarMenuItem>
        <ToolbarMenuItem href="/catalog">Каталог</ToolbarMenuItem>
        <ToolbarMenuItem href="/about">О нас</ToolbarMenuItem>
      </ToolbarLeft>

      <ToolbarCenter>
        <ToolbarTitle>online store</ToolbarTitle>
      </ToolbarCenter>

      <ToolbarRight>
        <ToolbarIconButton icon={<Search />} label="Поиск" />
        <AuthSheet />
        <ToolbarIconButton icon={<Heart />} label="Избранное" />
        <ToolbarIconButton icon={<ShoppingCart />} label="Корзина" badge={3} />
      </ToolbarRight>
    </Toolbar>
  );
}
