import { Static, Type } from "@sinclair/typebox";

export const ParamsLoginObj = Type.Object({
    name:   Type.String()
})

export type ParamsLoginType = Static<typeof ParamsLoginObj>;