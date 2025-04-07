"server only";

import { Session } from "next-auth";

export const serverLogger = (session: Session | undefined, message: string) => {
  console.log({
    userId: session?.user?.id,
    message: message.substring(0, 300),
  });
};
