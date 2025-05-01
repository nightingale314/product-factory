import { CloudUpload, Notebook, Sparkles, Store } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User } from "@prisma/client";
import { NavUser } from "./NavUser";
import { routes } from "@/constants/routes";
import { Suspense } from "react";
import { SupplierSidebarHeader } from "./SupplierSidebarHeader";
import { Skeleton } from "@/components/ui/skeleton";

const items = [
  {
    title: "Products",
    url: routes.products.root,
    icon: Store,
  },
  {
    title: "Import",
    url: routes.import.products,
    icon: CloudUpload,
  },
  {
    title: "Attributes",
    url: routes.attributes,
    icon: Notebook,
  },
  {
    title: "Enrichment",
    url: routes.enrichment,
    icon: Sparkles,
  },
];

interface AppSidebarProps {
  user?: User;
}

export async function AppSidebar({ user }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="p-3">
              <Suspense fallback={<Skeleton className="h-6" />}>
                <SupplierSidebarHeader user={user} />
              </Suspense>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
