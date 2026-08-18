import jwt, { JwtPayload } from "jsonwebtoken";

const verifyToken = (token: string, secret: string) => {
   try {
      const decoded = jwt.verify(token, secret) as JwtPayload;

      return {
         success: true,
         data: decoded,
      };
   } catch {
      return {
         success: false,
         data: null,
      };
   }
};

export const jwtUtils = {
   verifyToken,
};
