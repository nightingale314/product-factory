import { AppSidebar } from "@/components/composition/sidebar/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { routes } from "@/constants/routes";
import { User } from "@prisma/client";

export default async function WithSideBarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const sessionUser = session?.user as User | undefined;

  if (!sessionUser) {
    redirect(routes.login);
  }

  return (
    <SidebarProvider>
      <AppSidebar user={sessionUser} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
