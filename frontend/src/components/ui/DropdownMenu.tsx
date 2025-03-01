// src/components/ui/DropdownMenu.tsx
import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import { MenuItemData } from "../../data/menuItems";
import { MenuItem } from "./MenuItem";
import { motion } from "framer-motion";

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: MenuItemData[];
}

export const DropdownMenu = ({ trigger, items }: DropdownMenuProps) => (
  <RadixDropdownMenu.Root>
    <RadixDropdownMenu.Trigger asChild>{trigger}</RadixDropdownMenu.Trigger>
    <RadixDropdownMenu.Portal>
      <RadixDropdownMenu.Content
        asChild
        className="mt-2 p-2 rounded-lg shadow-lg border w-64"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--muted)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {items.map((item, index) => (
            <RadixDropdownMenu.Item key={index} asChild>
              <MenuItem
                text={item.text}
                icon={item.icon}
                description={item.description}
                onClick={item.action}
              />
            </RadixDropdownMenu.Item>
          ))}
        </motion.div>
      </RadixDropdownMenu.Content>
    </RadixDropdownMenu.Portal>
  </RadixDropdownMenu.Root>
);