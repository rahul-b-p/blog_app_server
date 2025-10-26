import { createMap, forMember, mapFrom } from "@automapper/core";
import { User } from "../models";
import { UserDto } from "../dtos";
import { mapper } from "./mapper";

export function configureUserMapping() {
  createMap(
    mapper,
    User,
    UserDto,
    forMember(
      (destination) => destination.id,
      mapFrom((source) => source._id)
    )
  );
}
