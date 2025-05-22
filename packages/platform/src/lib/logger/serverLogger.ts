"server only";

import { Session } from "next-auth";

export const serverLogger = (session: Session | undefined, message: string) => {
  console.dir(
    {
      userId: session?.user?.id,
      supplierId: session?.user?.supplierId,
      message: message,
    },
    {
      depth: null,
    }
  );
};
